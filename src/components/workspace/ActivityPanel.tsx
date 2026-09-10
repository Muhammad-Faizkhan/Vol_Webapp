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
    <div className="overflow-hidden rounded-lg border border-light-border">
      <div className="bg-[#e7e8e9] px-6 py-3 text-sm font-medium tracking-[0.28px] text-auth-navy">
        Workspace Activity
      </div>
      <div className="flex flex-col bg-white">
        {items.map((item, i) => (
          <div
            key={i}
            className={`flex items-center justify-between gap-3 p-4 ${i !== 0 ? "border-t border-light-border" : ""}`}
          >
            <div className="flex flex-col gap-1">
              <p className="text-sm text-auth-navy">{item.text}</p>
              <span className="text-xs text-[#929292]">{item.ago}</span>
            </div>
            <button className="shrink-0 rounded-lg bg-auth-navy px-3 py-1.5 text-xs font-medium text-white">
              See details
            </button>
          </div>
        ))}
        {showFullAuditTrail && (
          <div className="p-4 pt-2">
            <button className="w-full rounded-2xl border border-light-border py-3 text-base font-medium text-auth-navy">
              See Full Audit Trial
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
