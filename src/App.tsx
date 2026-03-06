import { Link } from 'react-router-dom'
import BannerWrapper from './components/BannerWrapper'
import BannerV1 from './components/banners/BannerV1'
import BannerV2 from './components/banners/BannerV2'
import BannerV3 from './components/banners/BannerV3'
import BannerV4 from './components/banners/BannerV4'
import BannerV5 from './components/banners/BannerV5'
import BannerV6 from './components/banners/BannerV6'
import BannerV7 from './components/banners/BannerV7'
import BannerV8 from './components/banners/BannerV8'
import BannerV9 from './components/banners/BannerV9'
import BannerV10 from './components/banners/BannerV10'

export default function App() {
    return (
        <>
            <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1>Think Beyond - SM (1:1)</h1>
                    <p style={{ color: '#ffffff' }}>Projekty Marzec 2026 r.</p>
                </div>
                <Link to="/publish" style={{
                    background: 'linear-gradient(90deg, #E14ED8, #8160FC)',
                    border: 'none',
                    color: '#fff',
                    padding: '10px 24px',
                    borderRadius: '100px',
                    fontSize: '14px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    fontFamily: 'Satoshi, sans-serif',
                    marginTop: '5px'
                }}>
                    Publish
                </Link>
            </header>

            <main className="grid-container">
                <BannerWrapper version="Wersja 1" downloadFilename="Wersja_1.png">
                    <BannerV1 />
                </BannerWrapper>

                <BannerWrapper version="Wersja 2" downloadFilename="Wersja_2.png">
                    <BannerV2 />
                </BannerWrapper>

                <BannerWrapper version="Wersja 3" downloadFilename="Wersja_3.png">
                    <BannerV3 />
                </BannerWrapper>

                <BannerWrapper version="Wersja 4" downloadFilename="Wersja_4.png">
                    <BannerV4 />
                </BannerWrapper>

                <BannerWrapper version="Wersja 5" downloadFilename="Wersja_5.png">
                    <BannerV5 />
                </BannerWrapper>

                <BannerWrapper version="Wersja 6" downloadFilename="Wersja_6.png">
                    <BannerV6 />
                </BannerWrapper>

                <BannerWrapper version="Wersja 7" downloadFilename="Wersja_7.png">
                    <BannerV7 />
                </BannerWrapper>

                <BannerWrapper version="Wersja 8" downloadFilename="Wersja_8.png">
                    <BannerV8 />
                </BannerWrapper>

                <BannerWrapper version="Wersja 9" downloadFilename="Wersja_9.png">
                    <BannerV9 />
                </BannerWrapper>

                <BannerWrapper version="Wersja 10 (wersja video)" downloadFilename="Wersja_10_animacja.mp4" isVideo>
                    <BannerV10 />
                </BannerWrapper>
            </main>
        </>
    )
}
