import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await login(formData);
            if (response.success) {
                navigate('/dashboard');
            } else {
                setError(response.message || 'Login failed. Please try again.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-ink flex">

            {/* ── Left Panel — Branding ── */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-surface flex-col justify-between p-12 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 -left-20 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-emerald/5 rounded-full blur-3xl" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
                </div>

                {/* Logo */}
                <div className="relative flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold to-gold/60 flex items-center justify-center">
                        <span className="text-ink font-bold font-display">P</span>
                    </div>
                    <span className="font-display font-semibold text-ink-text text-xl">
            Pro <span className="text-gold">Investment</span>
          </span>
                </div>

                {/* Center content */}
                <div className="relative">
                    <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-3 py-1 mb-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                        <span className="text-gold text-xs font-semibold uppercase tracking-widest">
              Live Platform
            </span>
                    </div>
                    <h2 className="font-display text-4xl font-semibold text-ink-text mb-4 leading-tight">
                        Your money works<br />
                        <span className="text-gold">while you sleep</span>
                    </h2>
                    <p className="text-muted leading-relaxed max-w-sm">
                        Daily ROI credited automatically at midnight. No manual claims, no waiting — just consistent growth.
                    </p>

                    {/* Stats */}
                    <div className="mt-10 grid grid-cols-3 gap-6">
                        {[
                            { value: '2.5%', label: 'Max Daily ROI' },
                            { value: '5', label: 'Referral Levels' },
                            { value: '90', label: 'Days Duration' },
                        ].map((stat) => (
                            <div key={stat.label}>
                                <div className="font-display text-2xl font-semibold text-gold mb-1">{stat.value}</div>
                                <div className="text-xs text-muted">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom testimonial */}
                <div className="relative bg-surface-raised rounded-2xl p-4 border border-white/5">
                    <p className="text-sm text-ink-text mb-2">
                        "Earning ₹1,500 daily from my ₹60,000 investment. The referral income is a bonus."
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center text-gold text-xs font-semibold">R</div>
                        <div>
                            <p className="text-xs text-ink-text font-medium">Rahul S.</p>
                            <p className="text-xs text-muted">Gold Plan Investor</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Right Panel — Form ── */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md">

                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold/60 flex items-center justify-center">
                            <span className="text-ink font-bold text-sm font-display">P</span>
                        </div>
                        <span className="font-display font-semibold text-ink-text text-lg">
              Pro <span className="text-gold">Investment</span>
            </span>
                    </div>

                    {/* Heading */}
                    <div className="mb-8">
                        <h1 className="font-display text-3xl font-semibold text-ink-text mb-2">
                            Welcome back
                        </h1>
                        <p className="text-muted">
                            Sign in to your account to continue
                        </p>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="mb-6 bg-rose/10 border border-rose/20 rounded-xl px-4 py-3">
                            <p className="text-rose text-sm">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="arnab@gmail.com"
                                required
                                className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-ink-text placeholder-muted/50 focus:outline-none focus:border-gold/50 focus:bg-surface-raised transition-all duration-200 text-sm"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 pr-12 text-ink-text placeholder-muted/50 focus:outline-none focus:border-gold/50 focus:bg-surface-raised transition-all duration-200 text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink-text transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gold text-ink font-semibold py-3.5 rounded-xl hover:bg-gold/90 transition-all duration-200 hover:shadow-lg hover:shadow-gold/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 flex items-center gap-4">
                        <div className="flex-1 h-px bg-white/5" />
                        <span className="text-muted text-xs">or</span>
                        <div className="flex-1 h-px bg-white/5" />
                    </div>

                    {/* Register link */}
                    <p className="text-center text-sm text-muted">
                        Don&apos;t have an account?{' '}
                        <Link to="/register" className="text-gold hover:text-gold/80 font-medium transition-colors">
                            Create one for free
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;