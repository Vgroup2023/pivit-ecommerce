import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';

export default function Header() {
  const { user, isAuthenticated } = useAuthStore();
  const cartCount = useCartStore((state) => state.getItemCount());

  return (
    <header className="brand-header text-white">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition">
            {/* Logo will be loaded from public/logo.svg */}
            <img
              src="/logo.svg"
              alt="PIVIT Fishing"
              className="brand-logo"
              onError={(e) => {
                // Fallback if logo not found
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="text-xl font-bold hidden sm:inline">
              <span className="text-white">PIVIT</span>
              <span className="brand-accent-text"> Fishing</span>
            </span>
            <span className="sm:hidden text-lg font-bold">🎣 PIVIT</span>
          </Link>

          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-secondary">
              Home
            </Link>
            <Link to="/products" className="hover:text-secondary">
              Shop
            </Link>
            <Link to="/cart" className="hover:text-secondary flex items-center">
              Cart {cartCount > 0 && <span className="ml-2 bg-secondary px-2 py-1 rounded">{cartCount}</span>}
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm">{user?.firstName}</span>
                {user?.isAdmin && (
                  <Link to="/admin" className="btn btn-outline text-sm py-1 px-2">
                    Admin
                  </Link>
                )}
                <button
                  onClick={async () => {
                    try {
                      await fetch('/api/auth/logout', { method: 'POST' });
                      useAuthStore.setState({ user: null, isAuthenticated: false });
                    } catch (error) {
                      console.error('Logout failed:', error);
                    }
                  }}
                  className="btn btn-outline text-sm py-1 px-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline text-sm py-1 px-2">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary text-sm py-1 px-2">
                  Sign Up
                </Link>
              </>
            )}
            <button
              onClick={(window as any).installApp}
              className="btn btn-secondary text-sm py-1 px-2"
              title="Install app on your device"
            >
              ⬇️ Install
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
