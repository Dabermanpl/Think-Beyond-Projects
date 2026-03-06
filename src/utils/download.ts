// Download a banner as PNG using html-to-image CDN (loaded in index.html)
declare const htmlToImage: {
    toPng: (element: HTMLElement, options?: Record<string, unknown>) => Promise<string>
}

export function downloadBanner(element: HTMLElement, filename: string): void {
    const originalTransform = element.style.transform
    const originalBoxShadow = element.style.boxShadow
    element.style.transform = 'none'
    element.style.boxShadow = 'none'

    htmlToImage.toPng(element, { pixelRatio: 2, skipFonts: true })
        .then((dataUrl) => {
            element.style.transform = originalTransform
            element.style.boxShadow = originalBoxShadow
            const link = document.createElement('a')
            link.download = filename
            link.href = dataUrl
            link.click()
        })
        .catch((error) => {
            console.error('Download failed:', error)
        })
}

export async function downloadVideo(
    btn: HTMLButtonElement,
    filename: string
): Promise<void> {
    const originalHTML = btn.innerHTML
    let timeLeft = 25
    btn.innerHTML = `⏳ Renderowanie (${timeLeft}s)...`
    btn.disabled = true
    btn.style.opacity = '0.7'

    const timer = setInterval(() => {
        timeLeft--
        btn.innerHTML = timeLeft > 0
            ? `⏳ Renderowanie (${timeLeft}s)...`
            : `⏳ Zapisywanie...`
    }, 1000)

    try {
        const response = await fetch('http://localhost:3000/api/render-v10')
        const data = await response.json() as { success: boolean; mp4Url?: string; error?: string }

        clearInterval(timer)

        if (data.success && data.mp4Url) {
            btn.innerHTML = `✅ Gotowe! Zapisywanie na dysku...`
            const resMp4 = await fetch('http://localhost:3000' + data.mp4Url)
            const blobMp4 = await resMp4.blob()
            const urlMp4 = window.URL.createObjectURL(blobMp4)
            const linkMp4 = document.createElement('a')
            linkMp4.href = urlMp4
            linkMp4.download = filename
            document.body.appendChild(linkMp4)
            linkMp4.click()
            linkMp4.remove()
            setTimeout(() => window.URL.revokeObjectURL(urlMp4), 500)
        } else {
            alert('Błąd podczas renderowania: ' + data.error)
        }
    } catch (err) {
        clearInterval(timer)
        alert('Serwer renderujący (server.js) nie jest uruchomiony! Wpisz: node server.js')
        console.error(err)
    } finally {
        setTimeout(() => {
            btn.innerHTML = originalHTML
            btn.disabled = false
            btn.style.opacity = '1'
        }, 3000)
    }
}
