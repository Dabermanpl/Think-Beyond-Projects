import React from 'react'

const BannerV3 = React.forwardRef<HTMLDivElement>((_, ref) => (
    <div ref={ref} className="banner v3">
        <div className="logo-container">
            <img src="/LOGO_TB.svg" alt="Think Beyond" className="brand-logo" />
        </div>
        <div className="content glass">
            <h2 className="headline">Salesforce<br />Partner</h2>
            <p className="subheadline">Wdrażamy rozwiązania<br />Salesforce, które wspierają<br />wzrost i efektywność.</p>
            <a href="#" className="banner-cta">
                See more <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                    strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '1px' }}>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </a>
        </div>
        <div className="portrait-container">
            <img src="/portrait.png" alt="Marcin" className="portrait-img" />
        </div>
    </div>
))
BannerV3.displayName = 'BannerV3'
export default BannerV3
