import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TecDoc Article Manager',
  description: 'Manage TecDoc articles and mark their existence',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center space-x-8">
                  <h1 className="text-2xl font-bold text-gray-900">
                    TecDoc Article Manager
                  </h1>
                  <nav className="flex space-x-4">
                    <a 
                      href="/" 
                      className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      Multiple Articles
                    </a>
                    <a 
                      href="/single-articles" 
                      className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      Single Articles
                    </a>
                    <a 
                      href="/not-found" 
                      className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                    >
                      Not Found Articles
                    </a>
                    <a 
                      href="/search" 
                      className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
                    >
                      🔍 Search
                    </a>
                  </nav>
                </div>
                <div className="text-sm text-gray-500">
                  Manage TecDoc articles and mark their existence
                </div>
              </div>
            </div>
          </header>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
