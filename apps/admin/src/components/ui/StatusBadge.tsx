const tones = {
  success: "border-adm-success bg-adm-success/15 text-adm-success",
  warning: "border-adm-warning bg-adm-warning/15 text-adm-warning",
  danger: "border-adm-danger bg-adm-danger/15 text-adm-danger",
  info: "border-adm-blue bg-adm-blue/15 text-adm-blue",
  neutral: "border-dak-muted bg-dak-muted/15 text-dak-muted",
};

export type BadgeTone = keyof typeof tones;

export function StatusBadge({ label, tone }: { label: string; tone: BadgeTone }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-3xl border p-2 text-sm font-medium leading-4 tracking-[0.28px] ${tones[tone]}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

export function accountStatusTone(status: string): BadgeTone {
  if (status === "Active") return "success";
  if (status === "Suspended") return "warning";
  return "danger";
}
