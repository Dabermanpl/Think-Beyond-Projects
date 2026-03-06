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

    await page.goto('file:///Users/emilianstorta/Downloads/thinkbeyond/banners/index.html', { waitUntil: 'networkidle0' });

    // Czekamy i zatrzymujemy wideo by klatkować ręcznie
    await page.evaluate(async () => {
        document.querySelectorAll('.banner-wrapper').forEach(el => {
            if (!el.textContent.includes('Wersja 10')) el.style.display = 'none';
        });
        document.querySelector('.page-header').style.display = 'none';

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
    const duration = 4; // 4s wideo testowo (wystarczy do gifa)
    const totalFrames = fps * duration;

    for (let i = 0; i < totalFrames; i++) {
        const time = i / fps;
        await page.evaluate(async (t) => {
            const video = document.querySelector('.v10 video');
            if (video) {
                video.currentTime = t;
                await new Promise(r => requestAnimationFrame(r)); // dom render
            }
        }, time);

        // Zgrywamy screenshota wycinka V10
        await page.screenshot({
            path: path.join(framesDir, `frame-${String(i).padStart(4, '0')}.png`),
            clip: rect
        });
        process.stdout.write('.');
    }
    console.log('\nFrames captured. Compiling to GIF and MP4 using ffmpeg...');
    await browser.close();

    const mp4Output = path.join(__dirname, 'Wersja_10_animacja.mp4');

    // KROK 1: Generowanie MP4
    console.log('Generating MP4...');
    await new Promise((resolve, reject) => {
        ffmpeg()
            .input(path.join(framesDir, 'frame-%04d.png'))
            .inputOptions([`-framerate ${fps}`])
            .outputOptions([
                '-c:v libx264',
                '-pix_fmt yuv420p',
                '-crf 15', // super wysoka jakość
                '-y'
            ])
            .output(mp4Output)
            .on('end', resolve)
            .on('error', reject)
            .run();
    });
    console.log('OK! Saved to Wersja_10_animacja.mp4');

    // Sprzątamy klatki
    console.log('Cleaning up frames...');
    const cleanupFiles = fs.readdirSync(framesDir);
    for (const f of cleanupFiles) fs.unlinkSync(path.join(framesDir, f));
    fs.rmdirSync(framesDir);

    console.log('ALL DONE! Masz gotowe pliki GIF i MP4!');
}

createAnimation().catch(console.error);
