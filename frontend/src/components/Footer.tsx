import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-12">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">🎣 PIVIT Fishing</h3>
            <p className="text-gray-400">Your trusted source for quality fishing gear and outdoor equipment.</p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Shop</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/products" className="hover:text-secondary">All Products</Link></li>
              <li><a href="#" className="hover:text-secondary">New Arrivals</a></li>
              <li><a href="#" className="hover:text-secondary">Best Sellers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-secondary">Help Center</a></li>
              <li><a href="#" className="hover:text-secondary">Contact Us</a></li>
              <li><a href="#" className="hover:text-secondary">Shipping Info</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-secondary">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-secondary">Terms of Service</a></li>
              <li><a href="#" className="hover:text-secondary">Refund Policy</a></li>
              <li><Link to="/compliance" className="hover:text-secondary">Compliance</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 PIVIT Fishing. All rights reserved.</p>
          <p className="text-sm mt-2">Built with ❤️ for fishing enthusiasts</p>
        </div>
      </div>
    </footer>
  );
}
