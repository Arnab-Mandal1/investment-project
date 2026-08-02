const EmptyState = ({ icon, title, description }) => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
        {icon && (
            <div className="w-16 h-16 rounded-2xl bg-surface-raised flex items-center justify-center mb-4 text-muted text-2xl">
                {icon}
            </div>
        )}
        <h3 className="text-ink-text font-medium mb-1">{title}</h3>
        {description && (
            <p className="text-muted text-sm text-center max-w-xs">{description}</p>
        )}
    </div>
);

export default EmptyState;