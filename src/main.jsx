import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Bokheimen from './Bokheimen.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Bokheimen />
  </StrictMode>,
)
