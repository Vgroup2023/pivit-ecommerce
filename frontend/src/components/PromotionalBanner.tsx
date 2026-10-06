import { Link } from 'react-router-dom';

export default function PromotionalBanner() {
  return (
    <div className="hero-section">
      <div className="max-w-6xl mx-auto">
        {/* Promotional Product Image - Coming Soon */}
        <div className="mb-6">
          <img
            src="/promotional.svg"
            alt="Coming Soon - Premium Fishing Jigs & Lures"
            className="hero-image"
            onError={(e) => {
              // Fallback content if image not found
              (e.target as HTMLImageElement).parentElement!.innerHTML = `
                <div style="background: linear-gradient(135deg, #b8860b 0%, #d4a574 100%);
                           border-radius: 0.5rem;
                           padding: 3rem 1.5rem;
                           text-align: center;
                           color: white;">
                  <h2 style="font-size: 2rem; font-weight: bold; margin-bottom: 1rem;">
                    Coming Soon
                  </h2>
                  <p style="font-size: 1.125rem; margin-bottom: 2rem;">
                    Premium Precision Jigs, Lures & Hooks
                  </p>
                </div>
              `;
            }}
          />
        </div>

        {/* Promotional Content */}
        <div className="text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Premium Fishing Excellence
          </h2>
          <p className="text-lg mb-6 max-w-2xl">
            Discover our collection of precision-engineered jigs, lures, and hooks designed for serious fishermen.
            Crafted with premium materials for superior performance.
          </p>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="gold-accent-border">
              <h3 className="text-xl font-bold mb-2">Precision Engineered</h3>
              <p className="text-sm">Each product crafted with meticulous attention to detail</p>
            </div>
            <div className="gold-accent-border">
              <h3 className="text-xl font-bold mb-2">Premium Materials</h3>
              <p className="text-sm">High-quality materials for durability and performance</p>
            </div>
            <div className="gold-accent-border">
              <h3 className="text-xl font-bold mb-2">Expert Design</h3>
              <p className="text-sm">Developed by experienced fishing professionals</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/products"
              className="btn btn-gold"
            >
              Explore Products
            </Link>
            <button
              className="btn btn-outline text-white border-2"
              onClick={() => {
                // Subscribe to notifications - placeholder
                alert('Notifications will be enabled soon!');
              }}
            >
              Notify Me
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
