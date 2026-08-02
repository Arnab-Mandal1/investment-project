import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import CountUp from '../components/ui/CountUp';

// ─── Animated section wrapper ─────────────────────────────────────────────────
const FadeIn = ({ children, delay = 0, className = '' }) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.15 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            style={{ transitionDelay: `${delay}ms` }}
            className={`transition-all duration-700 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } ${className}`}
        >
            {children}
        </div>
    );
};

// ─── Feature card ─────────────────────────────────────────────────────────────
const FeatureCard = ({ icon, title, description, delay }) => (
    <FadeIn delay={delay}>
        <div className="bg-surface rounded-2xl p-6 border border-white/5 hover:border-gold/20 transition-colors duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-4 text-gold group-hover:bg-gold/20 transition-colors">
                {icon}
            </div>
            <h3 className="font-semibold text-ink-text mb-2">{title}</h3>
            <p className="text-muted text-sm leading-relaxed">{description}</p>
        </div>
    </FadeIn>
);

// ─── Step card ────────────────────────────────────────────────────────────────
const StepCard = ({ number, title, description, delay }) => (
    <FadeIn delay={delay}>
        <div className="relative">
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-gold font-display font-semibold text-sm">{number}</span>
                </div>
                <div>
                    <h3 className="font-semibold text-ink-text mb-1">{title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{description}</p>
                </div>
            </div>
        </div>
    </FadeIn>
);

// ─── Main Landing Page ────────────────────────────────────────────────────────
const LandingPage = () => {
    return (
        <div className="min-h-screen bg-ink overflow-x-hidden">

            {/* ── Navbar ── */}
            <nav className="sticky top-0 z-50 bg-ink/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold/60 flex items-center justify-center">
                            <span className="text-ink font-bold text-sm font-display">P</span>
                        </div>
                        <span className="font-display font-semibold text-ink-text text-lg">
              Pro <span className="text-gold">Investment</span>
            </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            to="/login"
                            className="text-sm text-muted hover:text-ink-text transition-colors px-4 py-2"
                        >
                            Sign in
                        </Link>
                        <Link
                            to="/register"
                            className="text-sm bg-gold text-ink font-semibold px-4 py-2 rounded-xl hover:bg-gold/90 transition-colors"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ── Hero Section ── */}
            <section className="relative pt-24 pb-32 px-4">
                {/* Background glow */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl" />
                    <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-emerald/5 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-4xl mx-auto text-center">
                    {/* Eyebrow label */}
                    <FadeIn>
                        <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 mb-8">
                            <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                            <span className="text-gold text-xs font-semibold uppercase tracking-widest">
                Trusted Investment Platform
              </span>
                        </div>
                    </FadeIn>

                    {/* Headline */}
                    <FadeIn delay={100}>
                        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold text-ink-text leading-tight mb-6 text-balance">
                            Grow Your Wealth{' '}
                            <span className="text-gold">Daily</span>
                        </h1>
                    </FadeIn>

                    {/* Subheadline */}
                    <FadeIn delay={200}>
                        <p className="text-muted text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                            Invest smart, earn daily ROI up to 2.5%, and build passive income
                            through our 5-level referral program.
                        </p>
                    </FadeIn>

                    {/* CTA Buttons */}
                    <FadeIn delay={300}>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/register"
                                className="w-full sm:w-auto bg-gold text-ink font-semibold px-8 py-3.5 rounded-xl hover:bg-gold/90 transition-all duration-200 hover:shadow-lg hover:shadow-gold/20 hover:-translate-y-0.5"
                            >
                                Start Investing Today
                            </Link>
                            <Link
                                to="/login"
                                className="w-full sm:w-auto bg-surface text-ink-text font-medium px-8 py-3.5 rounded-xl border border-white/10 hover:border-gold/30 hover:bg-surface-raised transition-all duration-200"
                            >
                                Sign In →
                            </Link>
                        </div>
                    </FadeIn>

                    {/* Hero stats strip */}
                    <FadeIn delay={400}>
                        <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto">
                            {[
                                { label: 'Daily ROI', value: 2.5, suffix: '%', decimals: 1 },
                                { label: 'Referral Levels', value: 5, suffix: '', decimals: 0 },
                                { label: 'Min Investment', value: 1000, prefix: '₹', decimals: 0 },
                            ].map((stat) => (
                                <div key={stat.label} className="text-center">
                                    <div className="font-display text-2xl font-semibold text-gold font-mono">
                                        {stat.prefix}<CountUp end={stat.value} decimals={stat.decimals} duration={2000} />{stat.suffix}
                                    </div>
                                    <div className="text-xs text-muted mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ── Platform Stats ── */}
            <section className="py-16 border-y border-white/5 bg-surface/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { label: 'Active Investors', value: 12480, prefix: '' },
                            { label: 'Total Invested', value: 48, prefix: '₹', suffix: 'Cr+' },
                            { label: 'ROI Distributed', value: 3.2, prefix: '₹', suffix: 'Cr+' },
                            { label: 'Referral Earnings', value: 1.8, prefix: '₹', suffix: 'Cr+' },
                        ].map((stat) => (
                            <FadeIn key={stat.label}>
                                <div className="text-center">
                                    <div className="font-display text-3xl font-semibold text-ink-text mb-1 font-mono">
                                        {stat.prefix}
                                        <CountUp end={stat.value} decimals={stat.value % 1 !== 0 ? 1 : 0} duration={2000} />
                                        {stat.suffix}
                                    </div>
                                    <div className="text-sm text-muted">{stat.label}</div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section className="py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <FadeIn>
                        <div className="text-center mb-16">
                            <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-3">Why Pro Investment</p>
                            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink-text">
                                Everything you need to grow
                            </h2>
                        </div>
                    </FadeIn>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            delay={0}
                            icon={
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            }
                            title="Daily ROI Up to 2.5%"
                            description="Earn guaranteed daily returns on your investment. Plans starting from ₹1,000 with up to 2.5% daily ROI."
                        />
                        <FeatureCard
                            delay={100}
                            icon={
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
                                </svg>
                            }
                            title="5-Level Referral Income"
                            description="Earn up to 10% level income from your referrals' ROI across 5 levels. The more you refer, the more you earn."
                        />
                        <FeatureCard
                            delay={200}
                            icon={
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            }
                            title="Secure & Transparent"
                            description="JWT-secured accounts, encrypted passwords, and complete transaction history. Your money, your control."
                        />
                        <FeatureCard
                            delay={300}
                            icon={
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                            title="Auto Daily Credits"
                            description="ROI is automatically calculated and credited to your wallet every day at midnight. No manual claims needed."
                        />
                        <FeatureCard
                            delay={400}
                            icon={
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            }
                            title="Real-time Dashboard"
                            description="Track your investments, ROI history, referral income, and wallet balance all in one beautiful dashboard."
                        />
                        <FeatureCard
                            delay={500}
                            icon={
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            }
                            title="Multiple Plans"
                            description="Choose from Basic, Silver, Gold, and Platinum plans based on your investment capacity and goals."
                        />
                    </div>
                </div>
            </section>

            {/* ── How It Works ── */}
            <section className="py-24 px-4 bg-surface/30">
                <div className="max-w-7xl mx-auto">
                    <FadeIn>
                        <div className="text-center mb-16">
                            <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-3">Simple Process</p>
                            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink-text">
                                Start earning in 3 steps
                            </h2>
                        </div>
                    </FadeIn>

                    <div className="max-w-2xl mx-auto space-y-8">
                        <StepCard
                            number="01"
                            delay={0}
                            title="Create Your Account"
                            description="Register with your details and optionally use a referral code from an existing member to join their network."
                        />
                        <div className="w-px h-8 bg-gold/20 ml-5" />
                        <StepCard
                            number="02"
                            delay={100}
                            title="Choose & Fund Your Plan"
                            description="Select from Basic (₹1K), Silver (₹10K), Gold (₹50K), or Platinum (₹2L+) plans and make your investment."
                        />
                        <div className="w-px h-8 bg-gold/20 ml-5" />
                        <StepCard
                            number="03"
                            delay={200}
                            title="Earn Daily & Refer"
                            description="Watch your wallet grow daily with automatic ROI credits. Share your referral code and earn from 5 levels of network."
                        />
                    </div>
                </div>
            </section>

            {/* ── Investment Plans ── */}
            <section className="py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <FadeIn>
                        <div className="text-center mb-16">
                            <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-3">Plans</p>
                            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink-text">
                                Choose your investment plan
                            </h2>
                        </div>
                    </FadeIn>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: 'Basic', range: '₹1K – ₹9,999', roi: '1.0', duration: '90 days', color: 'text-muted' },
                            { name: 'Silver', range: '₹10K – ₹49,999', roi: '1.5', duration: '90 days', color: 'text-ink-text' },
                            { name: 'Gold', range: '₹50K – ₹1,99,999', roi: '2.0', duration: '90 days', color: 'text-gold', featured: true },
                            { name: 'Platinum', range: '₹2L+', roi: '2.5', duration: '90 days', color: 'text-emerald' },
                        ].map((plan) => (
                            <FadeIn key={plan.name} delay={plan.name === 'Basic' ? 0 : plan.name === 'Silver' ? 100 : plan.name === 'Gold' ? 200 : 300}>
                                <div className={`relative bg-surface rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 ${
                                    plan.featured
                                        ? 'border-gold/40 shadow-lg shadow-gold/10'
                                        : 'border-white/5 hover:border-white/10'
                                }`}>
                                    {plan.featured && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gold text-ink text-xs font-bold px-3 py-1 rounded-full">
                        POPULAR
                      </span>
                                        </div>
                                    )}
                                    <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-gold/0 via-gold/50 to-gold/0" />
                                    <h3 className={`font-display text-xl font-semibold mb-1 ${plan.color}`}>{plan.name}</h3>
                                    <p className="text-xs text-muted mb-4">{plan.range}</p>
                                    <div className="mb-4">
                                        <span className="font-display text-4xl font-semibold text-ink-text">{plan.roi}</span>
                                        <span className="text-muted text-sm">% / day</span>
                                    </div>
                                    <p className="text-xs text-muted">{plan.duration} duration</p>
                                    <Link
                                        to="/register"
                                        className="mt-6 block text-center text-sm font-semibold py-2.5 rounded-xl border border-gold/30 text-gold hover:bg-gold hover:text-ink transition-all duration-200"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA Section ── */}
            <section className="py-24 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <FadeIn>
                        <div className="bg-surface rounded-3xl p-12 border border-white/5 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-emerald/5" />
                            <div className="relative">
                                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink-text mb-4">
                                    Ready to start earning?
                                </h2>
                                <p className="text-muted mb-8 leading-relaxed">
                                    Join thousands of investors already growing their wealth daily with Pro Investment.
                                </p>
                                <Link
                                    to="/register"
                                    className="inline-flex items-center gap-2 bg-gold text-ink font-semibold px-8 py-3.5 rounded-xl hover:bg-gold/90 transition-all duration-200 hover:shadow-lg hover:shadow-gold/20 hover:-translate-y-0.5"
                                >
                                    Create Free Account
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="border-t border-white/5 py-8 px-4">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-gold/20 flex items-center justify-center">
                            <span className="text-gold font-bold text-xs font-display">P</span>
                        </div>
                        <span className="text-muted text-sm font-display">Pro Investment</span>
                    </div>
                    <p className="text-muted text-xs">
                        © 2026 Pro Investment. All rights reserved.
                    </p>
                </div>
            </footer>

        </div>
    );
};

export default LandingPage;