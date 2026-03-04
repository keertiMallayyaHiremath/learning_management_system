import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LMS - Learning Management System',
  description: 'A comprehensive learning management system',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-semibold text-gray-900">
                    LMS
                  </h1>
                </div>
                <nav className="flex items-center space-x-4">
                  <a href="/auth/login" className="text-gray-600 hover:text-gray-900">
                    Login
                  </a>
                  <a href="/auth/register" className="text-gray-600 hover:text-gray-900">
                    Register
                  </a>
                </nav>
              </div>
            </div>
          </header>
          
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}