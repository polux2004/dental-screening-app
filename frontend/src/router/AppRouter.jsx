import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CapturePage from '../pages/CapturePage'
import CorrectionPage from '../pages/CorrectionPage'
import InstructionsPage from '../pages/InstructionsPage'
import LandingPage from '../pages/LandingPage'
import ResultsPage from '../pages/ResultsPage'
import SelectionPage from '../pages/SelectionPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<LandingPage />} />
        <Route path="/seleccion"   element={<SelectionPage />} />
        <Route path="/instrucciones" element={<InstructionsPage />} />
        <Route path="/captura"     element={<CapturePage />} />
        <Route path="/correccion"  element={<CorrectionPage />} />
        <Route path="/resultados"  element={<ResultsPage />} />
      </Routes>
    </BrowserRouter>
  )
}
