import React from 'react'

const BannerV6 = React.forwardRef<HTMLDivElement>((_, ref) => (
    <div ref={ref} className="banner v6">
        <div className="logo-container">
            <img src="/LOGO_TB.svg" alt="Think Beyond" className="brand-logo" />
        </div>
        <div className="content">
            <h2 className="headline outline-text">Salesforce<br />Partner</h2>
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
            <img src="/portrait2.png" alt="Marcin" className="portrait-img" />
        </div>
        <div className="subtle-grid"></div>
    </div>
))
BannerV6.displayName = 'BannerV6'
export default BannerV6
