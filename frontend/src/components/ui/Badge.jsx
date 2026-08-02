const variants = {
    Active: 'bg-emerald/10 text-emerald border border-emerald/20',
    Completed: 'bg-gold/10 text-gold border border-gold/20',
    Cancelled: 'bg-rose/10 text-rose border border-rose/20',
    Credited: 'bg-emerald/10 text-emerald border border-emerald/20',
    Pending: 'bg-gold/10 text-gold border border-gold/20',
    Failed: 'bg-rose/10 text-rose border border-rose/20',
    Inactive: 'bg-muted/10 text-muted border border-muted/20',
    Suspended: 'bg-rose/10 text-rose border border-rose/20',
};

const Badge = ({ status }) => {
    const classes = variants[status] || 'bg-muted/10 text-muted border border-muted/20';
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
            {status}
    </span>
    );
};

export default Badge;