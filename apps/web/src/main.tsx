import { createRoot } from 'react-dom/client'
import { QueryProvider } from './providers/QueryProvider.js';
import './index.css';
import App from './App.jsx'

createRoot(document.getElementById('root')!).render(
  <QueryProvider>
    <App />
  </QueryProvider>,
)
