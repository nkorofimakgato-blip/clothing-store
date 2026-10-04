function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid sm:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Clothing Store</h3>
            <p className="text-sm text-gray-600">
              A demo storefront built with React, TypeScript, and Tailwind CSS.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">New Arrivals</a></li>
              <li><a href="#" className="hover:text-gray-900">Men</a></li>
              <li><a href="#" className="hover:text-gray-900">Women</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">About</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a
                  href="https://github.com/nkorofimakgato-blip/clothing-store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-900"
                >
                  GitHub
                </a>
              </li>
              <li><a href="#" className="hover:text-gray-900">Contact</a></li>
              <li><a href="#" className="hover:text-gray-900">Privacy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-500">
          © {year} Clothing Store. Built for demonstration purposes.
        </div>
      </div>
    </footer>
  )
}

export default Footer