import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await authService.forgotPassword(email);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-ink flex items-center justify-center p-6">
            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold to-gold/60 flex items-center justify-center">
                        <span className="text-ink font-bold font-display">P</span>
                    </div>
                    <span className="font-display font-semibold text-ink-text text-xl">
                        Pro <span className="text-gold">Investment</span>
                    </span>
                </div>

                <div className="bg-surface border border-white/10 rounded-2xl p-8">

                    {success ? (
                        /* ── Success State ── */
                        <div className="text-center">
                            <div className="w-14 h-14 rounded-full bg-emerald/10 border border-emerald/20 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-7 h-7 text-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="font-display text-xl font-semibold text-ink-text mb-2">Check your email</h2>
                            <p className="text-muted text-sm mb-6">
                                If an account exists for <span className="text-ink-text font-medium">{email}</span>, a reset link has been sent. Check your inbox and spam folder.
                            </p>
                            <Link
                                to="/login"
                                className="text-gold hover:text-gold/80 text-sm font-medium transition-colors"
                            >
                                ← Back to login
                            </Link>
                        </div>
                    ) : (
                        /* ── Form State ── */
                        <>
                            <div className="mb-6">
                                <h1 className="font-display text-2xl font-semibold text-ink-text mb-2">
                                    Forgot password?
                                </h1>
                                <p className="text-muted text-sm">
                                    Enter your registered email and we'll send you a reset link.
                                </p>
                            </div>

                            {error && (
                                <div className="mb-5 bg-rose/10 border border-rose/20 rounded-xl px-4 py-3">
                                    <p className="text-rose text-sm">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                        placeholder="arnab@gmail.com"
                                        required
                                        className="w-full bg-ink border border-white/10 rounded-xl px-4 py-3 text-ink-text placeholder-muted/50 focus:outline-none focus:border-gold/50 focus:bg-surface-raised transition-all duration-200 text-sm"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gold text-ink font-semibold py-3.5 rounded-xl hover:bg-gold/90 transition-all duration-200 hover:shadow-lg hover:shadow-gold/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Reset Link'
                                    )}
                                </button>
                            </form>

                            <p className="text-center text-sm text-muted mt-6">
                                Remember your password?{' '}
                                <Link to="/login" className="text-gold hover:text-gold/80 font-medium transition-colors">
                                    Back to login
                                </Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;