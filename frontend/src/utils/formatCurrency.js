export const formatCurrency = (amount, compact = false) => {
    if (compact) {
        if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
        if (amount >= 100000)   return `₹${(amount / 100000).toFixed(2)}L`;
        if (amount >= 1000)     return `₹${(amount / 1000).toFixed(2)}K`;
        return `₹${amount.toFixed(2)}`;
    }
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(amount);
};

export const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return new Intl.NumberFormat('en-IN').format(num);
};