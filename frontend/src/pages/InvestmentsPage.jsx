import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { FullPageSpinner } from '../components/ui/Spinner';
import { investmentService } from '../services/investmentService';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';

// ─── Investment Plans ─────────────────────────────────────────────────────────
const PLANS = [
    { id: 'basic', name: 'Basic', range: '₹1K – ₹9,999', min: 1000, max: 9999, roi: 1.0, color: 'text-muted', border: 'border-white/10' },
    { id: 'silver', name: 'Silver', range: '₹10K – ₹49,999', min: 10000, max: 49999, roi: 1.5, color: 'text-ink-text', border: 'border-white/10' },
    { id: 'gold', name: 'Gold', range: '₹50K – ₹1,99,999', min: 50000, max: 199999, roi: 2.0, color: 'text-gold', border: 'border-gold/30', popular: true },
    { id: 'platinum', name: 'Platinum', range: '₹2L+', min: 200000, max: Infinity, roi: 2.5, color: 'text-emerald', border: 'border-emerald/20' },
];

// ─── Create Investment Modal ──────────────────────────────────────────────────
const CreateInvestmentModal = ({ onClose, onSuccess }) => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const detectedPlan = PLANS.find(p => {
        const num = parseFloat(amount);
        return num >= p.min && num <= p.max;
    });

    const dailyROI = detectedPlan && amount
        ? (parseFloat(amount) * (detectedPlan.roi / 100)).toFixed(2)
        : null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await investmentService.create({ amount: parseFloat(amount) });
            if (response.success) {
                onSuccess();
                onClose();
            } else {
                setError(response.message || 'Failed to create investment.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-surface border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-xl font-semibold text-ink-text">New Investment</h2>
                    <button onClick={onClose} className="text-muted hover:text-ink-text transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Plan cards */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                    {PLANS.map((plan) => (
                        <div
                            key={plan.id}
                            className={`p-3 rounded-xl border ${
                                detectedPlan?.id === plan.id
                                    ? `${plan.border} bg-surface-raised`
                                    : 'border-white/5 bg-surface-raised/50'
                            } transition-all`}
                        >
                            <p className={`text-sm font-semibold ${detectedPlan?.id === plan.id ? plan.color : 'text-muted'}`}>
                                {plan.name}
                            </p>
                            <p className="text-xs text-muted">{plan.range}</p>
                            <p className={`text-sm font-mono font-semibold mt-1 ${detectedPlan?.id === plan.id ? plan.color : 'text-muted'}`}>
                                {plan.roi}% / day
                            </p>
                        </div>
                    ))}
                </div>

                {error && (
                    <div className="mb-4 bg-rose/10 border border-rose/20 rounded-xl px-4 py-3">
                        <p className="text-rose text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-2">
                            Investment Amount (₹)
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => { setAmount(e.target.value); setError(''); }}
                            placeholder="e.g. 5000"
                            min="1000"
                            required
                            className="w-full bg-ink border border-white/10 rounded-xl px-4 py-3 text-ink-text placeholder-muted/50 focus:outline-none focus:border-gold/50 transition-all duration-200 text-sm font-mono"
                        />
                    </div>

                    {/* Live preview */}
                    {detectedPlan && amount && (
                        <div className="bg-ink rounded-xl p-4 border border-white/5 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted">Plan detected</span>
                                <span className={`font-semibold ${detectedPlan.color}`}>{detectedPlan.name}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted">Daily ROI ({detectedPlan.roi}%)</span>
                                <span className="text-emerald font-mono font-semibold">+₹{dailyROI}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted">Duration</span>
                                <span className="text-ink-text">90 days</span>
                            </div>
                            <div className="flex justify-between text-sm border-t border-white/5 pt-2">
                                <span className="text-muted">Total ROI (90 days)</span>
                                <span className="text-emerald font-mono font-semibold">
                  +₹{(parseFloat(dailyROI) * 90).toFixed(2)}
                </span>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !detectedPlan}
                        className="w-full bg-gold text-ink font-semibold py-3.5 rounded-xl hover:bg-gold/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
                                Processing...
                            </>
                        ) : (
                            `Invest ${amount ? formatCurrency(parseFloat(amount)) : ''}`
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const InvestmentsPage = () => {
    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [activeFilter, setActiveFilter] = useState('All');

    const fetchInvestments = async () => {
        try {
            const response = await investmentService.getAll();
            if (response.success) {
                setInvestments(response.data.investments);
            }
        } catch {
            // handle silently
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvestments();
    }, []);

    const filters = ['All', 'Active', 'Completed', 'Cancelled'];

    const filtered = activeFilter === 'All'
        ? investments
        : investments.filter(i => i.status === activeFilter);

    if (loading) return <FullPageSpinner />;

    return (
        <Layout>
            {/* ── Header ── */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-1">Portfolio</p>
                    <h1 className="font-display text-3xl font-semibold text-ink-text">Investments</h1>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-gold text-ink font-semibold px-5 py-2.5 rounded-xl hover:bg-gold/90 transition-all duration-200 hover:shadow-lg hover:shadow-gold/20 text-sm"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Investment
                </button>
            </div>

            {/* ── Summary Strip ── */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                    { label: 'Total Investments', value: investments.length },
                    { label: 'Active', value: investments.filter(i => i.status === 'Active').length },
                    { label: 'Total Invested', value: formatCurrency(investments.reduce((s, i) => s + i.amount, 0), true) },
                ].map((stat) => (
                    <div key={stat.label} className="bg-surface rounded-2xl p-4 border border-white/5 text-center">
                        <p className="font-display text-2xl font-semibold text-ink-text">{stat.value}</p>
                        <p className="text-xs text-muted mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* ── Filter Tabs ── */}
            <div className="flex gap-2 mb-6">
                {filters.map((f) => (
                    <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                            activeFilter === f
                                ? 'bg-gold/10 text-gold border border-gold/20'
                                : 'text-muted hover:text-ink-text hover:bg-white/5'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* ── Investment Table ── */}
            <div className="bg-surface rounded-2xl border border-white/5 overflow-hidden">
                {filtered.length === 0 ? (
                    <EmptyState
                        icon="📊"
                        title="No investments found"
                        description="Create your first investment to start earning daily ROI"
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b border-white/5">
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-muted">Plan</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-muted">Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-muted">Daily ROI</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-muted">Start Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-muted">End Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-muted">ROI Paid</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-muted">Status</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                            {filtered.map((inv) => (
                                <tr key={inv._id} className="hover:bg-surface-raised transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium text-ink-text">{inv.plan.planName}</p>
                                        <p className="text-xs text-muted">{inv.plan.dailyROIPercentage}% / day</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-mono font-semibold text-ink-text">
                                        {formatCurrency(inv.amount,true)}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-mono text-emerald">
                                        +{formatCurrency(inv.amount * (inv.plan.dailyROIPercentage / 100),true)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted">{formatDate(inv.startDate)}</td>
                                    <td className="px-6 py-4 text-sm text-muted">{formatDate(inv.endDate)}</td>
                                    <td className="px-6 py-4 text-sm font-mono text-gold">
                                        {formatCurrency(inv.totalROIPaid,true)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge status={inv.status} />
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ── Modal ── */}
            {showModal && (
                <CreateInvestmentModal
                    onClose={() => setShowModal(false)}
                    onSuccess={fetchInvestments}
                />
            )}
        </Layout>
    );
};

export default InvestmentsPage;