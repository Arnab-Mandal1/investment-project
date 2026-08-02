import CountUp from './CountUp';

const StatCard = ({ label, value, type = 'currency', icon, change }) => {
    const renderValue = () => {
        if (type === 'currency') {
            return (
                <div className="font-display text-3xl font-semibold text-ink-text tabular">
                    ₹<CountUp end={value} decimals={2} duration={1800} />
                </div>
            );
        }
        if (type === 'number') {
            return (
                <div className="font-display text-3xl font-semibold text-ink-text">
                    <CountUp end={value} decimals={0} duration={1500} />
                </div>
            );
        }
        return (
            <div className="font-display text-3xl font-semibold text-ink-text">
                {value}
            </div>
        );
    };

    return (
        <div className="relative bg-surface rounded-2xl p-6 overflow-hidden group hover:bg-surface-raised transition-colors duration-300">
            {/* Gold accent line at top */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold/0 via-gold to-gold/0" />

            {/* Icon */}
            {icon && (
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center mb-4 text-gold">
                    {icon}
                </div>
            )}

            {/* Label */}
            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">
                {label}
            </p>

            {/* Value */}
            {renderValue()}

            {/* Change indicator */}
            {change !== undefined && (
                <p className={`text-xs mt-2 ${change >= 0 ? 'text-emerald' : 'text-rose'}`}>
                    {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% today
                </p>
            )}
        </div>
    );
};

export default StatCard;