type ActivityItem = {
  text: string;
  ago: string;
};

const activity: ActivityItem[] = [
  { text: "John Smith added 6 products to abc workspace", ago: "12mins ago" },
  { text: "John Smith added 6 products to abc workspace", ago: "12mins ago" },
  { text: "John Smith added 6 products to abc workspace", ago: "12mins ago" },
];

export function ActivityPanel({ showFullAuditTrail = false }: { showFullAuditTrail?: boolean }) {
  const items = showFullAuditTrail ? activity : activity.slice(0, 1);

  return (
    <div className="overflow-hidden rounded-lg border border-light-border dark:border-dak-border">
      <div className="bg-app-dark-surface px-6 py-3 text-sm font-medium tracking-[0.28px] text-white">
        Workspace Activity
      </div>
      <div className="flex flex-col bg-white dark:bg-dak-surface">
        {items.map((item, i) => (
          <div
            key={i}
            className={`flex items-center justify-between gap-3 p-4 ${i !== 0 ? "border-t border-light-border dark:border-dak-border" : ""}`}
          >
            <div className="flex flex-col gap-1">
              <p className="text-sm text-auth-navy dark:text-dak-heading">{item.text}</p>
              <span className="text-xs text-[#929292] dark:text-dak-muted">{item.ago}</span>
            </div>
            <button className="shrink-0 rounded-lg bg-app-dark-surface px-3 py-1.5 text-xs font-medium text-white">
              See details
            </button>
          </div>
        ))}
        {showFullAuditTrail && (
          <div className="p-4 pt-2">
            <button className="w-full rounded-2xl border border-light-border py-3 text-base font-medium text-auth-navy dark:border-dak-border dark:text-dak-heading">
              See Full Audit Trial
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
