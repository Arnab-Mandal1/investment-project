const LoadingScreen = () => {
    return (
        <div className="min-h-screen bg-ink flex flex-col items-center justify-center">
            {/* Background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
            </div>

            {/* Logo */}
            <div className="relative flex flex-col items-center gap-6">
                <div className="relative">
                    {/* Outer ring animation */}
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 flex items-center justify-center">
                        <span className="font-display font-bold text-gold text-3xl">P</span>
                    </div>

                    {/* Spinning ring around logo */}
                    <div className="absolute -inset-2 rounded-3xl border-2 border-transparent border-t-gold/50 border-r-gold/20 animate-spin" />
                </div>

                {/* Brand name */}
                <div className="text-center">
                    <p className="font-display text-xl font-semibold text-ink-text">
                        Pro <span className="text-gold">Investment</span>
                    </p>
                    <p className="text-muted text-sm mt-1">Loading your portfolio...</p>
                </div>

                {/* Animated dots */}
                <div className="flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-gold/40"
                            style={{
                                animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Bottom tagline */}
            <p className="absolute bottom-8 text-xs text-muted/50 tracking-widest uppercase">
                Grow Your Wealth Daily
            </p>
        </div>
    );
};

export default LoadingScreen;