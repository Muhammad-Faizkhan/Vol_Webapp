type StepperProps = {
  steps: string[];
  currentStep: number;
};

export function Stepper({ steps, currentStep }: StepperProps) {
  const fillPercent =
    steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0;

  return (
    <div className="relative my-6 flex items-center">
      <div className="absolute left-4 right-4 top-4 h-0.5 bg-light-border" />
      <div
        className="absolute left-4 top-4 h-0.5 bg-auth-navy"
        style={{ width: `calc(${fillPercent}% - ${fillPercent > 0 ? 32 * (fillPercent / 100) : 0}px)` }}
      />
      {steps.map((label, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        return (
          <div key={label} className="relative z-[1] flex flex-1 flex-col items-center">
            <div
              className={`flex size-8 items-center justify-center rounded-full border-2 text-sm font-semibold ${
                done
                  ? "border-auth-navy bg-auth-navy text-white"
                  : active
                    ? "border-auth-navy bg-white text-auth-navy"
                    : "border-light-border bg-white text-[#929292]"
              }`}
            >
              {done ? "✓" : i + 1}
            </div>
            <span className="mt-2 text-xs text-auth-navy">{label}</span>
          </div>
        );
      })}
    </div>
  );
}
