import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <img src="/logo.jpg" alt="ReadRack Logo" className="h-8 w-8" />
          <span className="text-xl font-bold text-gray-800">ReadRack</span>
        </Link>

        <div className="flex space-x-6">
          <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
            About Us
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  )
}
