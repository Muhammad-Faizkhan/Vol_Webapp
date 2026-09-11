import Image from "next/image";

type SettingsItem = {
  icon: string;
  label: string;
  danger?: boolean;
};

const sections: { title: string; items: SettingsItem[] }[] = [
  {
    title: "Account",
    items: [
      { icon: "settings-lock", label: "Change password" },
      { icon: "settings-delete", label: "Delete account", danger: true },
    ],
  },
  {
    title: "Preferences",
    items: [{ icon: "settings-bell", label: "Notifications" }],
  },
  {
    title: "Privacy & Legal",
    items: [
      { icon: "settings-privacy", label: "Privacy policy" },
      { icon: "settings-terms", label: "Terms & Conditions" },
      { icon: "settings-about", label: "About Volt" },
    ],
  },
  {
    title: "Support",
    items: [{ icon: "settings-help", label: "Help & Feedback" }],
  },
];

export default function SettingsPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-[-0.32px] text-[#020204] dark:text-dak-heading sm:text-[32px]">
          Settings
        </h1>
        <p className="text-sm text-[#2b2b31] dark:text-dak-body">
          Manage your account, preferences, privacy, and workspace experience.
        </p>
      </div>

      <div className="flex w-full max-w-[570px] flex-col gap-6 rounded-lg border border-[rgba(43,43,49,0.4)] bg-white p-[25px] shadow-[0px_4px_4px_rgba(43,43,49,0.2)] dark:rounded-3xl dark:border-[#c793ff] dark:border-[0.5px] dark:bg-[#0f090c] dark:p-10 dark:shadow-[0px_32px_32px_-16px_rgba(148,54,251,0.5)]">
        {sections.map((section) => (
          <div key={section.title} className="flex w-full flex-col gap-3">
            <h2 className="text-base font-semibold text-[#020204] dark:text-dak-heading">{section.title}</h2>
            {section.items.map((item) => (
              <button
                key={item.label}
                type="button"
                className="flex h-[60px] w-full items-center justify-between rounded-[14px] border border-[rgba(43,43,49,0.4)] bg-[#251437] px-4 py-[11px] dark:bg-[#121212]"
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`flex size-[34px] shrink-0 items-center justify-center rounded-lg ${
                      item.danger ? "bg-[rgba(195,35,35,0.1)]" : "bg-white/10"
                    }`}
                  >
                    <Image src={`/icons/${item.icon}.svg`} alt="" width={16} height={16} />
                  </span>
                  <span className="text-base text-white">{item.label}</span>
                </span>
                <Image src="/icons/settings-chevron.svg" alt="" width={16} height={16} />
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
