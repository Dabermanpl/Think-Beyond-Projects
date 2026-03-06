import React, { useRef } from 'react'
import { downloadBanner, downloadVideo } from '../utils/download'

interface BannerWrapperProps {
    version: string
    isVideo?: boolean
    children: React.ReactNode
    downloadFilename: string
}

export default function BannerWrapper({
    version,
    isVideo = false,
    children,
    downloadFilename,
}: BannerWrapperProps) {
    const bannerRef = useRef<HTMLDivElement>(null)
    const btnRef = useRef<HTMLButtonElement>(null)

    const handleDownload = () => {
        if (isVideo) {
            if (btnRef.current) {
                downloadVideo(btnRef.current, downloadFilename)
            }
        } else {
            if (bannerRef.current) {
                downloadBanner(bannerRef.current, downloadFilename)
            }
        }
    }

    const DownloadIcon = () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
    )

    return (
        <div className="banner-wrapper">
            <div className="banner-header">
                <h3>{version}</h3>
                <button ref={btnRef} className="download-btn" onClick={handleDownload}>
                    <DownloadIcon />
                    {isVideo ? 'Pobierz (MP4)' : 'Pobierz'}
                </button>
            </div>
            {React.cloneElement(children as React.ReactElement, { ref: bannerRef })}
        </div>
    )
}
