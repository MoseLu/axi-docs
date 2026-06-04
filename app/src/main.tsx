import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import { buildBrowserPathFromLegacyHashRoute, normalizeRouterBasename } from './lib/routes'
import './styles/index.css'

const routerBasename = normalizeRouterBasename(import.meta.env.BASE_URL)

function upgradeLegacyHashRoute() {
  const upgradedLegacyHashPath = buildBrowserPathFromLegacyHashRoute(window.location, routerBasename)
  if (upgradedLegacyHashPath) {
    window.history.replaceState(null, '', upgradedLegacyHashPath)
  }
}

upgradeLegacyHashRoute()
window.addEventListener('hashchange', upgradeLegacyHashRoute)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter basename={routerBasename}>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
