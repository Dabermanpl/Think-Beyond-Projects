import React, { useEffect, useRef } from 'react'

const BannerV10 = React.forwardRef<HTMLDivElement>((_, ref) => {
    const headlineRef = useRef<HTMLHeadingElement>(null)
    const subheadlineRef = useRef<HTMLParagraphElement>(null)
    const ctaRef = useRef<HTMLAnchorElement>(null)

    useEffect(() => {
        const animateElement = (el: HTMLElement, groupDelay: number) => {
            const html = el.innerHTML
            const textNodesAndTags = html.split(/(<[^>]+>)/g)
            let newHtml = ''
            let charIndex = 0

            textNodesAndTags.forEach((part) => {
                if (part.startsWith('<')) {
                    newHtml += part
                } else {
                    part.split('').forEach((char) => {
                        if (char === ' ') {
                            newHtml += ' '
                        } else {
                            const delay = groupDelay + charIndex * 0.03
                            newHtml += `<span class="fade-char" style="animation-delay: ${delay}s">${char}</span>`
                            charIndex++
                        }
                    })
                }
            })

            el.innerHTML = newHtml
        }

        if (headlineRef.current) animateElement(headlineRef.current, 0)
        if (subheadlineRef.current) animateElement(subheadlineRef.current, 0.5)
    }, [])

    return (
        <div ref={ref} className="banner v3 v10 run-animation">
            <div className="logo-container">
                <img src="LOGO_TB.svg" alt="Think Beyond" className="brand-logo" />
            </div>
            <div className="content glass">
                <h2 ref={headlineRef} className="headline animate-text">Salesforce<br />Partner</h2>
                <p ref={subheadlineRef} className="subheadline animate-text">Wdrażamy rozwiązania<br />Salesforce, które wspierają<br />wzrost i efektywność.</p>
                <a ref={ctaRef} href="#" className="banner-cta animate-text">
                    See more <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                        strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '1px' }}>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </a>
            </div>
            <div className="video-container">
                <video src="smile.mp4" autoPlay loop muted playsInline></video>
            </div>
        </div>
    )
})
BannerV10.displayName = 'BannerV10'
export default BannerV10
