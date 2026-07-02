import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// The dashboard mounts into an existing #dashboard element so it can be
// dropped into a foreign host page as an embed. When testing dist/index.html
// standalone, this same div is already present in the page markup.
const container = document.getElementById('dashboard')

if (container) {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
