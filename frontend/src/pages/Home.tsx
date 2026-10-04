import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-dark text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">🎣 Welcome to PIVIT Fishing</h1>
          <p className="text-xl mb-8">Your trusted source for quality fishing gear and outdoor equipment</p>
          <Link to="/products" className="btn btn-secondary px-8 py-3 text-lg">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-light">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose PIVIT?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
              <p className="text-gray-600">Hand-selected fishing gear trusted by professionals</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-bold mb-2">Fast Shipping</h3>
              <p className="text-gray-600">Quick delivery to get you fishing sooner</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold mb-2">Expert Support</h3>
              <p className="text-gray-600">Dedicated support from fishing enthusiasts</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Install?</h2>
          <p className="mb-6">Download PIVIT Fishing as an app on your phone or tablet for the best shopping experience</p>
          <button onClick={(window as any).installApp} className="btn btn-primary px-8 py-3 text-lg">
            ⬇️ Install App
          </button>
        </div>
      </section>
    </div>
  );
}
