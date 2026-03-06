import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BannerV1 from './banners/BannerV1'
import BannerV2 from './banners/BannerV2'
import BannerV3 from './banners/BannerV3'
import BannerV4 from './banners/BannerV4'
import BannerV5 from './banners/BannerV5'
import BannerV6 from './banners/BannerV6'
import BannerV7 from './banners/BannerV7'
import BannerV8 from './banners/BannerV8'
import BannerV9 from './banners/BannerV9'
import BannerV10 from './banners/BannerV10'

declare const htmlToImage: {
    toJpeg: (el: HTMLElement, opts?: Record<string, unknown>) => Promise<string>
}

interface RenderedBanner {
    version: string
    dataUrl: string
    filename: string
}

const bannerComponents = [
    { version: 'Wersja 1', Component: BannerV1, filename: 'Wersja_1.jpg' },
    { version: 'Wersja 2', Component: BannerV2, filename: 'Wersja_2.jpg' },
    { version: 'Wersja 3', Component: BannerV3, filename: 'Wersja_3.jpg' },
    { version: 'Wersja 4', Component: BannerV4, filename: 'Wersja_4.jpg' },
    { version: 'Wersja 5', Component: BannerV5, filename: 'Wersja_5.jpg' },
    { version: 'Wersja 6', Component: BannerV6, filename: 'Wersja_6.jpg' },
    { version: 'Wersja 7', Component: BannerV7, filename: 'Wersja_7.jpg' },
    { version: 'Wersja 8', Component: BannerV8, filename: 'Wersja_8.jpg' },
    { version: 'Wersja 9', Component: BannerV9, filename: 'Wersja_9.jpg' },
]

export default function PublishPage() {
    const navigate = useNavigate()
    const [rendered, setRendered] = useState<RenderedBanner[]>([])
    const [progress, setProgress] = useState(0)
    const [done, setDone] = useState(false)
    const bannerRefs = useRef<(HTMLDivElement | null)[]>([])

    useEffect(() => {
        const renderAll = async () => {
            const results: RenderedBanner[] = []

            for (let i = 0; i < bannerComponents.length; i++) {
                const el = bannerRefs.current[i]
                if (!el) continue

                // Give the component time to paint
                await new Promise(r => setTimeout(r, 300))

                try {
                    const dataUrl = await htmlToImage.toJpeg(el, {
                        pixelRatio: 2,
                        quality: 1,
                        skipFonts: true,
                    })
                    results.push({
                        version: bannerComponents[i].version,
                        dataUrl,
                        filename: bannerComponents[i].filename,
                    })
                } catch (e) {
                    console.error(`Błąd przy renderowaniu ${bannerComponents[i].version}:`, e)
                }

                setProgress(i + 1)
            }

            setRendered(results)
            setDone(true)
        }

        renderAll()
    }, [])

    const handleDownload = (dataUrl: string, filename: string) => {
        const link = document.createElement('a')
        link.href = dataUrl
        link.download = filename
        link.click()
    }

    const handleDownloadAll = () => {
        rendered.forEach(({ dataUrl, filename }) => {
            setTimeout(() => {
                const link = document.createElement('a')
                link.href = dataUrl
                link.download = filename
                link.click()
            }, 200)
        })
    }

    return (
        <div style={{ minHeight: '100vh', background: '#000', color: '#fff', padding: '40px', fontFamily: 'Satoshi, sans-serif' }}>
            {/* Hidden banner renders */}
            <div style={{ position: 'fixed', top: '-9999px', left: '-9999px', pointerEvents: 'none', opacity: 0 }}>
                {bannerComponents.map(({ Component }, i) => (
                    <div key={i} style={{ width: '600px', height: '600px' }}>
                        <Component ref={el => { bannerRefs.current[i] = el }} />
                    </div>
                ))}
            </div>

            {/* Header */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '50px', paddingBottom: '16px', borderBottom: '1px solid #444' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '5px' }}>Think Beyond — Published</h1>
                    <p style={{ color: '#ffffff', fontSize: '1.1rem' }}>
                        {done
                            ? `${rendered.length} images rendered at full quality`
                            : `Rendering... ${progress} / ${bannerComponents.length}`}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {done && (
                        <button
                            onClick={handleDownloadAll}
                            style={{
                                background: 'linear-gradient(90deg, #E14ED8, #8160FC)',
                                border: 'none',
                                color: '#fff',
                                padding: '8px 20px',
                                borderRadius: '100px',
                                fontSize: '13px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontFamily: 'Satoshi, sans-serif',
                            }}
                        >
                            ↓ Download all
                        </button>
                    )}
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: '#fff',
                            padding: '8px 20px',
                            borderRadius: '100px',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: 'Satoshi, sans-serif',
                        }}
                    >
                        ← Back
                    </button>
                </div>
            </header>

            {/* Progress bar */}
            {!done && (
                <div style={{ marginBottom: '40px' }}>
                    <div style={{ background: '#222', borderRadius: '100px', height: '4px', overflow: 'hidden' }}>
                        <div style={{
                            background: 'linear-gradient(90deg, #E14ED8, #8160FC)',
                            height: '100%',
                            width: `${(progress / bannerComponents.length) * 100}%`,
                            transition: 'width 0.4s ease',
                        }} />
                    </div>
                </div>
            )}

            {/* Rendered images grid */}
            <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', maxWidth: '1200px', margin: '0 auto' }}>
                {rendered.map(({ version, dataUrl, filename }) => (
                    <div key={version} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <img
                            src={dataUrl}
                            alt={version}
                            style={{ width: '100%', aspectRatio: '1/1', display: 'block', objectFit: 'cover' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 5px' }}>
                            <span style={{ fontSize: '12px', color: '#888' }}>{version}</span>
                            <button
                                onClick={() => handleDownload(dataUrl, filename)}
                                style={{
                                    background: 'rgba(255,255,255,0.5)',
                                    border: 'none',
                                    color: '#000',
                                    padding: '6px 14px',
                                    borderRadius: '100px',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    fontFamily: 'Satoshi, sans-serif',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                Download JPG
                            </button>
                        </div>
                    </div>
                ))}

                {/* Wersja 10 — video */}
                {done && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ width: '100%', aspectRatio: '1/1', position: 'relative', overflow: 'hidden' }}>
                            <BannerV10 />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 5px' }}>
                            <span style={{ fontSize: '12px', color: '#888' }}>Wersja 10 (video)</span>
                            <a
                                href="http://localhost:3000/api/download-v10"
                                download="Wersja_10_animacja.mp4"
                                style={{
                                    background: 'rgba(255,255,255,0.5)',
                                    border: 'none',
                                    color: '#000',
                                    padding: '6px 14px',
                                    borderRadius: '100px',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    fontFamily: 'Satoshi, sans-serif',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    textDecoration: 'none',
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                Download MP4
                            </a>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
