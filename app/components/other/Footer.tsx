import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <img src="/logo.png" alt="Acco-Finder Logo" className="w-10 h-10" />
          </div>
          <span className="text-xl font-bold">Acco-Finder</span>
        </div>
        <nav>
          <ul className="flex flex-wrap justify-center gap-4 md:gap-6">
            <li>
              <Link
                href="/"
                className="hover:text-blue-400 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="hover:text-blue-400 transition-colors"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="hover:text-blue-400 transition-colors"
              >
                Privacy
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="hover:text-blue-400 transition-colors"
              >
                Terms
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-blue-400 transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="mt-8 text-center text-gray-400">
        <p>
          &copy; {new Date().getFullYear()} Acco-Finder. All rights
          reserved.
        </p>
      </div>
    </div>
  </footer>
  )
}

export default Footer
