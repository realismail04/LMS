import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { CourseProvider } from './context/CourseContext.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CourseProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </CourseProvider>
    </AuthProvider>
  </React.StrictMode>,
)
