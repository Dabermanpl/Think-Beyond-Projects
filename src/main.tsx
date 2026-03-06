import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import PublishPage from './components/PublishPage'
import './index.css'

if (import.meta.env.DEV) {
    import('@locator/runtime').then(({ default: initLocatorJs }) => {
        initLocatorJs({ adapter: 'react' })
    })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/publish" element={<PublishPage />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
)
