import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // If no token in URL, show invalid link message immediately
    if (!token) {
        return (
            <div className="min-h-screen bg-ink flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-surface border border-white/10 rounded-2xl p-8 text-center">
                    <div className="w-14 h-14 rounded-full bg-rose/10 border border-rose/20 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-7 h-7 text-rose" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="font-display text-xl font-semibold text-ink-text mb-2">Invalid reset link</h2>
                    <p className="text-muted text-sm mb-6">This link is missing a reset token. Please request a new one.</p>
                    <Link to="/forgot-password" className="text-gold hover:text-gold/80 text-sm font-medium transition-colors">
                        Request new link
                    </Link>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            return setError('Passwords do not match.');
        }
        if (newPassword.length < 6) {
            return setError('Password must be at least 6 characters.');
        }

        setLoading(true);
        try {
            await authService.resetPassword(token, newPassword);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Reset failed. The link may have expired.');
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
                            <h2 className="font-display text-xl font-semibold text-ink-text mb-2">Password reset!</h2>
                            <p className="text-muted text-sm mb-2">
                                Your password has been updated successfully.
                            </p>
                            <p className="text-muted text-xs">
                                Redirecting to login in 3 seconds...
                            </p>
                        </div>
                    ) : (
                        /* ── Form State ── */
                        <>
                            <div className="mb-6">
                                <h1 className="font-display text-2xl font-semibold text-ink-text mb-2">
                                    Set new password
                                </h1>
                                <p className="text-muted text-sm">
                                    Choose a strong password for your account.
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
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                                            placeholder="••••••••"
                                            required
                                            className="w-full bg-ink border border-white/10 rounded-xl px-4 py-3 pr-12 text-ink-text placeholder-muted/50 focus:outline-none focus:border-gold/50 focus:bg-surface-raised transition-all duration-200 text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink-text transition-colors"
                                        >
                                            {showPassword ? (
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">
                                        Confirm Password
                                    </label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                                        placeholder="••••••••"
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
                                            Resetting...
                                        </>
                                    ) : (
                                        'Reset Password'
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

export default ResetPasswordPage;