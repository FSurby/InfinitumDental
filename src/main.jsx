import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import InfinitumDental from './InfinitumDental.jsx'
import { storage } from './storage.js'

// Make storage available globally so InfinitumDental.jsx can use window.storage
window.storage = storage

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <InfinitumDental />
  </StrictMode>,
)
