import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AuthProvider } from '@/context/AuthContext'
import { BookmarkProvider } from '@/context/BookmarkContext'
import App from './App'
import './styles/index.css'

/**
 * TanStack Query global client configuration.
 *
 * Why these defaults:
 * - staleTime 5 min  → product list rarely changes; avoid redundant refetches
 * - retry 2          → transient network failures should self-heal silently
 * - refetchOnWindowFocus false → prevents surprise refetches when switching tabs
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:           5 * 60 * 1000, // 5 minutes
      retry:               2,
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <BookmarkProvider>
            <App />
          </BookmarkProvider>
        </AuthProvider>
      </BrowserRouter>
      {/* DevTools panel is stripped automatically in production builds */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
)
