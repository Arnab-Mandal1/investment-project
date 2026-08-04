import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [avatarOpen, setAvatarOpen] = useState(false); // desktop avatar dropdown
    const [mobileOpen, setMobileOpen] = useState(false); // mobile hamburger nav
    const avatarRef = useRef(null);

    // Close avatar dropdown when user clicks anywhere outside it
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (avatarRef.current && !avatarRef.current.contains(e.target)) {
                setAvatarOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    const navLinks = [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Investments', path: '/investments' },
        { label: 'Referrals', path: '/referrals' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 bg-ink/80 backdrop-blur-xl border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link to="/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold/60 flex items-center justify-center">
                            <span className="text-ink font-bold text-sm font-display">P</span>
                        </div>
                        <span className="font-display font-semibold text-ink-text text-lg tracking-tight">
              Pro <span className="text-gold">Investment</span>
            </span>
                    </Link>

                    {/* Desktop nav links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                    isActive(link.path)
                                        ? 'bg-gold/10 text-gold'
                                        : 'text-muted hover:text-ink-text hover:bg-white/5'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* User menu */}
                    <div className="flex items-center gap-3">
                        {/* Wallet balance pill */}
                        <div className="hidden sm:flex items-center gap-2 bg-surface rounded-xl px-3 py-1.5 border border-white/5">
                            <div className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
                            <span className="text-xs text-muted font-mono">
                ₹{user?.walletBalance?.toFixed(2) || '0.00'}
              </span>
                        </div>

                        {/* Avatar dropdown */}
                        <div className="relative" ref={avatarRef}>
                            <button
                                onClick={() => setAvatarOpen(!avatarOpen)}
                                className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 flex items-center justify-center text-gold font-semibold text-sm hover:border-gold/40 transition-colors"
                            >
                                {user?.fullName?.[0]?.toUpperCase() || 'U'}
                            </button>

                            {avatarOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-surface border border-white/10 rounded-2xl shadow-xl overflow-hidden z-50">
                                    <div className="px-4 py-3 border-b border-white/5">
                                        <p className="text-sm font-medium text-ink-text">{user?.fullName}</p>
                                        <p className="text-xs text-muted truncate">{user?.email}</p>
                                    </div>
                                    <div className="p-2">
                                        <div className="px-3 py-2">
                                            <p className="text-xs text-muted uppercase tracking-wider mb-1">Referral Code</p>
                                            <p className="font-mono text-sm text-gold">{user?.referralCode}</p>
                                        </div>
                                        <button
                                            onClick={() => { setAvatarOpen(false); handleLogout(); }}
                                            className="w-full text-left px-3 py-2 text-sm text-rose hover:bg-rose/10 rounded-xl transition-colors"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden text-muted hover:text-ink-text"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile nav */}
                {mobileOpen && (
                    <div className="md:hidden py-3 border-t border-white/5">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setMobileOpen(false)}
                                className={`block px-4 py-2.5 rounded-lg text-sm font-medium mb-1 transition-colors ${
                                    isActive(link.path)
                                        ? 'bg-gold/10 text-gold'
                                        : 'text-muted hover:text-ink-text hover:bg-white/5'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;