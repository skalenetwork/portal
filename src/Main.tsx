import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { BrowserRouter } from 'react-router-dom'
import { inject } from '@vercel/analytics'
import { MetaportThemeProvider } from '@skalenetwork/metaport'

inject()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MetaportThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MetaportThemeProvider>
  </React.StrictMode>
)
