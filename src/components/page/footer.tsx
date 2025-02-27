import Link from 'next/link';
export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/2 text-center md:text-left px-8">
            <p className="uppercase mb-6 font-bold">CCC</p>
            <div className="flex flex-col">
              CCC (3xc = Coding Challenge + Web3).
            </div>
          </div>
          <div className="w-full md:w-1/4 text-center md:text-left px-8">
            <p className="uppercase mb-6 font-bold">Learn</p>
            <ul className="mb-4">
              <li className="mt-2">
                <Link
                  href="/learn"
                  className="hover:underline text-gray-600 hover:text-gray-800"
                >
                  Learn
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 text-center md:text-left px-8">
            <p className="uppercase mb-6 font-bold">Support</p>
            <ul className="mb-4">
              <li className="mt-2">
                <a
                  href="/contact"
                  className="hover:underline text-gray-600 hover:text-gray-800"
                >
                  Contact Us
                </a>
              </li>
              <li className="mt-2">
                <a
                  href="/terms/privacy"
                  className="hover:underline text-gray-600 hover:text-gray-800"
                >
                  Privacy Policy
                </a>
              </li>
              <li className="mt-2">
                <a
                  href="/terms"
                  className="hover:underline text-gray-600 hover:text-gray-800"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-base text-gray-400">
            © 2025 • CCC All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
