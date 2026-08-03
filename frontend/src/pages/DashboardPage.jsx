import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { FullPageSpinner } from '../components/ui/Spinner';
import { dashboardService } from '../services/dashboardService';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';

// ─── Custom Tooltip for Chart ─────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-surface-raised border border-white/10 rounded-xl px-4 py-3">
                <p className="text-xs text-muted mb-1">{label}</p>
                <p className="text-sm font-semibold text-emerald font-mono">
                    {formatCurrency(payload[0].value)}
                </p>
            </div>
        );
    }
    return null;
};

// ─── Section Header ───────────────────────────────────────────────────────────
const SectionHeader = ({ title, subtitle }) => (
    <div className="mb-6">
        <h2 className="text-lg font-semibold text-ink-text">{title}</h2>
        {subtitle && <p className="text-sm text-muted mt-0.5">{subtitle}</p>}
    </div>
);

// ─── Dashboard Page ───────────────────────────────────────────────────────────
const DashboardPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await dashboardService.getStats();
                if (response.success) {
                    setData(response.data);
                } else {
                    setError('Failed to load dashboard data.');
                }
            } catch {
                setError('Something went wrong. Please refresh.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) return <FullPageSpinner />;

    if (error) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-96">
                    <div className="text-center">
                        <p className="text-rose mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="text-sm text-gold hover:underline"
                        >
                            Refresh page
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    const { summary, recentROIHistory, recentReferralIncome, investments } = data;

    // Build chart data from ROI history (last 7 records reversed for chronological order)
    const chartData = [...recentROIHistory]
        .reverse()
        .map((record) => ({
            date: formatDate(record.creditedDate),
            roi: record.amount,
        }));

    return (
        <Layout>
            {/* ── Page Header ── */}
            <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-1">Overview</p>
                <h1 className="font-display text-3xl font-semibold text-ink-text">Dashboard</h1>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <StatCard
                    label="Wallet Balance"
                    value={summary.walletBalance}
                    type="currency"
                    icon={
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                    }
                />
                <StatCard
                    label="Total ROI Earned"
                    value={summary.totalROIEarned}
                    type="currency"
                    icon={
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    }
                />
                <StatCard
                    label="Level Income Earned"
                    value={summary.totalLevelIncomeEarned}
                    type="currency"
                    icon={
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
                        </svg>
                    }
                />
                <StatCard
                    label="Total Invested"
                    value={summary.totalInvested}
                    type="currency"
                    icon={
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
            </div>

            {/* ── ROI Chart ── */}
            {chartData.length > 0 && (
                <div className="bg-surface rounded-2xl p-6 border border-white/5 mb-8">
                    <SectionHeader
                        title="ROI Earnings"
                        subtitle="Daily returns credited to your wallet"
                    />
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="roiGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#34D399" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fill: '#8A93A6', fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: '#8A93A6', fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(v) => `₹${v}`}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="roi"
                                    stroke="#34D399"
                                    strokeWidth={2}
                                    fill="url(#roiGradient)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* ── Two column layout for tables ── */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">

                {/* Active Investments */}
                <div className="bg-surface rounded-2xl border border-white/5 overflow-hidden">
                    <div className="px-6 pt-6 pb-4 border-b border-white/5">
                        <SectionHeader
                            title="Active Investments"
                            subtitle={`${summary.activeInvestmentsCount} of ${summary.totalInvestmentsCount} investments active`}
                        />
                    </div>
                    {investments.filter(i => i.status === 'Active').length === 0 ? (
                        <EmptyState
                            icon="📈"
                            title="No active investments"
                            description="Create your first investment to start earning daily ROI"
                        />
                    ) : (
                        <div className="divide-y divide-white/5">
                            {investments.filter(i => i.status === 'Active').map((inv) => (
                                <div key={inv._id} className="px-6 py-4 flex items-center justify-between hover:bg-surface-raised transition-colors">
                                    <div>
                                        <p className="text-sm font-medium text-ink-text">{inv.plan.planName}</p>
                                        <p className="text-xs text-muted mt-0.5">
                                            {inv.plan.dailyROIPercentage}% daily · Ends {formatDate(inv.endDate)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-ink-text font-mono">
                                            {formatCurrency(inv.amount)}
                                        </p>
                                        <Badge status={inv.status} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent ROI History */}
                <div className="bg-surface rounded-2xl border border-white/5 overflow-hidden">
                    <div className="px-6 pt-6 pb-4 border-b border-white/5">
                        <SectionHeader
                            title="Recent ROI History"
                            subtitle="Last 10 daily ROI credits"
                        />
                    </div>
                    {recentROIHistory.length === 0 ? (
                        <EmptyState
                            icon="💰"
                            title="No ROI history yet"
                            description="ROI is credited daily at midnight once you invest"
                        />
                    ) : (
                        <div className="divide-y divide-white/5">
                            {recentROIHistory.map((record) => (
                                <div key={record._id} className="px-6 py-4 flex items-center justify-between hover:bg-surface-raised transition-colors">
                                    <div>
                                        <p className="text-sm font-medium text-ink-text">Daily ROI</p>
                                        <p className="text-xs text-muted mt-0.5">{formatDate(record.creditedDate)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-emerald font-mono">
                                            +{formatCurrency(record.amount)}
                                        </p>
                                        <Badge status={record.status} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Referral Income History ── */}
            <div className="bg-surface rounded-2xl border border-white/5 overflow-hidden">
                <div className="px-6 pt-6 pb-4 border-b border-white/5">
                    <SectionHeader
                        title="Referral Income History"
                        subtitle="Level income earned from your network"
                    />
                </div>
                {recentReferralIncome.length === 0 ? (
                    <EmptyState
                        icon="🤝"
                        title="No referral income yet"
                        description="Share your referral code to earn level income from your network"
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b border-white/5">
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-muted">From</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-muted">Level</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-muted">Date</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-widest text-muted">Amount</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                            {recentReferralIncome.map((record) => (
                                <tr key={record._id} className="hover:bg-surface-raised transition-colors">
                                    <td className="px-6 py-4 text-sm text-ink-text">
                                        {record.generatedBy?.fullName || 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold bg-gold/10 text-gold px-2 py-0.5 rounded-full">
                        L{record.level}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted">
                                        {formatDate(record.creditedDate)}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-semibold text-emerald font-mono">
                                        +{formatCurrency(record.amount)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </Layout>
    );
};

export default DashboardPage;