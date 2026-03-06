const puppeteer = require('puppeteer');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const path = require('path');

// Skonfiguruj ffpmeg-static jako główny silnik do kompilacji
ffmpeg.setFfmpegPath(ffmpegStatic);

async function createAnimation() {
    console.log('Starting Puppeteer for V10 Animation...');

    const framesDir = path.join(__dirname, 'frames_v10');
    if (!fs.existsSync(framesDir)) fs.mkdirSync(framesDir);

    const files = fs.readdirSync(framesDir);
    for (const file of files) fs.unlinkSync(path.join(framesDir, file));

    const browser = await puppeteer.launch({
        headless: 'new',
        defaultViewport: { width: 1000, height: 1000 },
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    console.log('Loading local HTML file ...');

    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });

    // Dodatkowe opóźnienie na ustabilizowanie się Vite/React (zwiększone do 2s)
    await new Promise(r => setTimeout(r, 2000));
    await page.evaluate(async () => {
        const header = document.querySelector('.page-header');
        if (header) header.style.display = 'none';

        // Ukryj LocatorJS overlay
        const locator = document.querySelector('#locatorjs-wrapper');
        if (locator) locator.style.display = 'none';

        const bannerWrappers = document.querySelectorAll('.banner-wrapper');
        bannerWrappers.forEach(el => {
            const h3 = el.querySelector('h3');
            if (h3 && !h3.textContent.includes('Wersja 10')) {
                el.style.display = 'none';
            }
        });

        const video = document.querySelector('.v10 video');
        if (video) {
            video.pause();
            video.currentTime = 0;
            // Wymuś pre-render pierwszej klatki
            await new Promise((r) => {
                video.addEventListener('seeked', r, { once: true });
                video.currentTime = 0.01;
            });
        }
    });

    const rect = await page.evaluate(() => {
        const el = document.querySelector('.v10');
        if (!el) return null;
        const { x, y, width, height } = el.getBoundingClientRect();
        return { x: Math.floor(x), y: Math.floor(y), width: Math.floor(width), height: Math.floor(height) };
    });

    if (!rect) {
        console.error('Nie znaleziono Wersji 10');
        await browser.close();
        return;
    }

    console.log(`V10 Banner found at:`, rect);
    console.log('Capturing frames...');

    const fps = 24;
    const duration = 4; // 4s wideo
    const totalFrames = fps * duration;

    // --- KLATKA 0: bez animacji (brak klasy .run-animation) i bez przycisku ---
    await page.evaluate(() => {
        const el = document.querySelector('.v10');
        if (el) el.classList.remove('run-animation');

        const cta = document.querySelector('.v10 .banner-cta');
        if (cta) cta.style.opacity = '0';
    });

    // Ustal video na czas 0
    await page.evaluate(async () => {
        const video = document.querySelector('.v10 video');
        if (video) {
            video.currentTime = 0;
            await new Promise(r => requestAnimationFrame(r));
        }
    });

    const frame0Path = path.join(framesDir, `frame-0000.png`);
    await page.screenshot({
        path: frame0Path,
        clip: rect
    });
    process.stdout.write('0');

    // --- KLATKI 1..N: start animacji i klatkowanie ---
    for (let i = 1; i < totalFrames; i++) {
        const time = i / fps;
        await page.evaluate(async (t, frameIndex) => {
            const el = document.querySelector('.v10');
            const cta = document.querySelector('.v10 .banner-cta');

            if (el && frameIndex === 1) {
                el.classList.add('run-animation');
                if (cta) cta.style.opacity = '1';
            }

            const video = document.querySelector('.v10 video');
            if (video) {
                video.currentTime = t;
                await new Promise(r => requestAnimationFrame(r));
            }
        }, time, i);

        await page.screenshot({
            path: path.join(framesDir, `frame-${String(i).padStart(4, '0')}.png`),
            clip: rect
        });
        process.stdout.write('.');
    }
    console.log('\nFrames captured. Compiling to GIF and MP4 using ffmpeg...');
    await browser.close();

    const gifOutput = path.join(__dirname, 'Wersja_10_animacja.gif');
    const mp4Output = path.join(__dirname, 'Wersja_10_animacja.mp4');
    const palettePath = path.join(__dirname, 'palette.png');

    // KROK 1: Generowanie palety dla GIFa (najlepsza jakość)
    console.log('Generating GIF palette...');
    await new Promise((resolve, reject) => {
        ffmpeg()
            .input(path.join(framesDir, 'frame-%04d.png'))
            .inputOptions([`-framerate ${fps}`])
            .complexFilter('palettegen')
            .output(palettePath)
            .on('end', resolve)
            .on('error', reject)
            .run();
    });

    // KROK 2: Generowanie GIFa przy użyciu palety
    console.log('Generating high-quality GIF...');
    await new Promise((resolve, reject) => {
        ffmpeg()
            .input(path.join(framesDir, 'frame-%04d.png'))
            .inputOptions([`-framerate ${fps}`])
            .input(palettePath)
            .complexFilter('fps=24,scale=1000:-1:flags=lanczos [x]; [x][1:v] paletteuse')
            .output(gifOutput)
            .on('end', resolve)
            .on('error', reject)
            .run();
    });
    console.log('OK! Saved to Wersja_10_animacja.gif');

    // KROK 3: Konwersja GIF do MP4
    console.log('Converting GIF to MP4...');
    await new Promise((resolve, reject) => {
        ffmpeg()
            .input(gifOutput)
            .outputOptions([
                '-c:v libx264',
                '-pix_fmt yuv420p',
                '-crf 15',
                '-y'
            ])
            .output(mp4Output)
            .on('end', resolve)
            .on('error', reject)
            .run();
    });
    console.log('OK! Saved to Wersja_10_animacja.mp4');

    // Sprzątamy klatki i paletę
    console.log('Cleaning up temporary files...');
    const cleanupFiles = fs.readdirSync(framesDir);
    for (const f of cleanupFiles) fs.unlinkSync(path.join(framesDir, f));
    if (fs.existsSync(framesDir)) fs.rmdirSync(framesDir);
    if (fs.existsSync(palettePath)) fs.unlinkSync(palettePath);

    console.log('ALL DONE! Renderowanie zakończone sukcesem.');
}

createAnimation().catch(console.error);
