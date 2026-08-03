import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import EmptyState from '../components/ui/EmptyState';
import { FullPageSpinner } from '../components/ui/Spinner';
import { useAuth } from '../context/AuthContext';
import { referralService } from '../services/referralService';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';

// ─── Referral Tree Node ───────────────────────────────────────────────────────
const TreeNode = ({ node, depth = 0 }) => {
    const [expanded, setExpanded] = useState(true);
    const hasChildren = node.children && node.children.length > 0;

    const levelColors = [
        'border-gold/40 bg-gold/5',
        'border-emerald/40 bg-emerald/5',
        'border-blue-400/40 bg-blue-400/5',
        'border-purple-400/40 bg-purple-400/5',
        'border-rose/40 bg-rose/5',
    ];

    const levelBadgeColors = [
        'bg-gold/10 text-gold',
        'bg-emerald/10 text-emerald',
        'bg-blue-400/10 text-blue-400',
        'bg-purple-400/10 text-purple-400',
        'bg-rose/10 text-rose',
    ];

    return (
        <div className={`${depth > 0 ? 'ml-6 mt-3' : ''}`}>
            <div className={`relative border rounded-xl p-4 ${levelColors[depth % levelColors.length]} transition-all`}>
                {/* Level badge */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-surface-raised flex items-center justify-center text-sm font-semibold text-ink-text border border-white/10">
                            {node.fullName?.[0]?.toUpperCase()}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-ink-text">{node.fullName}</p>
                            <p className="text-xs text-muted">{node.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${levelBadgeColors[depth % levelBadgeColors.length]}`}>
              L{node.level}
            </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                            node.accountStatus === 'Active'
                                ? 'bg-emerald/10 text-emerald'
                                : 'bg-muted/10 text-muted'
                        }`}>
              {node.accountStatus}
            </span>
                        {hasChildren && (
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="text-muted hover:text-ink-text transition-colors ml-1"
                            >
                                <svg
                                    className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-2 flex items-center gap-4">
                    <p className="text-xs text-muted">
                        Joined {formatDate(node.joinedAt)}
                    </p>
                    <p className="text-xs font-mono text-muted">
                        {node.referralCode}
                    </p>
                </div>
            </div>

            {/* Children */}
            {hasChildren && expanded && (
                <div className="border-l border-white/10 ml-4">
                    {node.children.map((child) => (
                        <TreeNode key={child.id} node={child} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const ReferralsPage = () => {
    const { user } = useAuth();
    const [directReferrals, setDirectReferrals] = useState([]);
    const [tree, setTree] = useState([]);
    const [levelSummary, setLevelSummary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState('direct');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [directRes, treeRes] = await Promise.all([
                    referralService.getDirectReferrals(),
                    referralService.getReferralTree(),
                ]);
                if (directRes.success) setDirectReferrals(directRes.data.referrals);
                if (treeRes.success) {
                    setTree(treeRes.data.tree);
                    setLevelSummary(treeRes.data.levelIncomeSummary);
                }
            } catch {
                // handle silently
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const copyReferralCode = () => {
        navigator.clipboard.writeText(user?.referralCode || '');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return <FullPageSpinner />;

    return (
        <Layout>
            {/* ── Header ── */}
            <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-1">Network</p>
                <h1 className="font-display text-3xl font-semibold text-ink-text">Referral Center</h1>
            </div>

            {/* ── Referral Code Card ── */}
            <div className="bg-surface rounded-2xl p-6 border border-white/5 mb-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-emerald/5" />
                <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Your Referral Code</p>
                        <p className="font-display text-4xl font-semibold text-gold font-mono tracking-widest">
                            {user?.referralCode}
                        </p>
                        <p className="text-sm text-muted mt-2">
                            Share this code to earn level income from your network
                        </p>
                    </div>
                    <button
                        onClick={copyReferralCode}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                            copied
                                ? 'bg-emerald/10 text-emerald border border-emerald/20'
                                : 'bg-gold text-ink hover:bg-gold/90'
                        }`}
                    >
                        {copied ? (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Copied!
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Copy Code
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* ── Level Income Summary ── */}
            {levelSummary.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
                    {levelSummary.map((level) => (
                        <div key={level._id} className="bg-surface rounded-2xl p-4 border border-white/5 text-center">
                            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Level {level._id}</p>
                            <p className="font-display text-lg font-semibold text-gold font-mono">
                                {formatCurrency(level.totalIncome)}
                            </p>
                            <p className="text-xs text-muted mt-1">{level.count} credits</p>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Tabs ── */}
            <div className="flex gap-2 mb-6">
                {[
                    { id: 'direct', label: `Direct Referrals (${directReferrals.length})` },
                    { id: 'tree', label: 'Referral Tree' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                            activeTab === tab.id
                                ? 'bg-gold/10 text-gold border border-gold/20'
                                : 'text-muted hover:text-ink-text hover:bg-white/5'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Direct Referrals Tab ── */}
            {activeTab === 'direct' && (
                <div className="bg-surface rounded-2xl border border-white/5 overflow-hidden">
                    {directReferrals.length === 0 ? (
                        <EmptyState
                            icon="👥"
                            title="No direct referrals yet"
                            description="Share your referral code to build your network and earn level income"
                        />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="border-b border-white/5">
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-muted">Member</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-muted">Referral Code</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-muted">Joined</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-muted">Total Invested</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-muted">Status</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                {directReferrals.map((ref) => (
                                    <tr key={ref.id} className="hover:bg-surface-raised transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold text-sm font-semibold">
                                                    {ref.fullName?.[0]?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-ink-text">{ref.fullName}</p>
                                                    <p className="text-xs text-muted">{ref.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-mono text-muted">{ref.referralCode}</td>
                                        <td className="px-6 py-4 text-sm text-muted">{formatDate(ref.joinedAt)}</td>
                                        <td className="px-6 py-4 text-sm font-mono text-ink-text">
                                            {formatCurrency(ref.totalInvested)}
                                        </td>
                                        <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            ref.accountStatus === 'Active'
                                ? 'bg-emerald/10 text-emerald'
                                : 'bg-muted/10 text-muted'
                        }`}>
                          {ref.accountStatus}
                        </span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* ── Referral Tree Tab ── */}
            {activeTab === 'tree' && (
                <div className="bg-surface rounded-2xl border border-white/5 p-6">
                    {tree.length === 0 ? (
                        <EmptyState
                            icon="🌳"
                            title="Your referral tree is empty"
                            description="Start referring people to build your network tree"
                        />
                    ) : (
                        <div>
                            {tree.map((node) => (
                                <TreeNode key={node.id} node={node} depth={0} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </Layout>
    );
};

export default ReferralsPage;