// The compact "who is this" shape used anywhere a user appears next to content
// (authors, members, followers...). Select it with `userSummarySelect`, map it with `toUserSummary`.

export const userSummarySelect = {
  id: true,
  username: true,
  accountType: true,
  profile: { select: { fullName: true, avatarUrl: true, specialty: true } },
  business: { select: { legalName: true, logoUrl: true, specialty: true, verification: true } },
} as const;

type UserSummaryRow = {
  id: string;
  username: string | null;
  accountType: "INDIVIDUAL" | "BUSINESS";
  profile: { fullName: string; avatarUrl: string | null; specialty: string | null } | null;
  business: { legalName: string; logoUrl: string | null; specialty: string | null; verification: string } | null;
};

export function toUserSummary(user: UserSummaryRow) {
  const isBusiness = user.accountType === "BUSINESS" && !!user.business;
  return {
    id: user.id,
    username: user.username,
    accountType: user.accountType,
    name: (isBusiness ? user.business?.legalName : user.profile?.fullName) ?? user.username ?? "VÔL member",
    avatarUrl: (isBusiness ? user.business?.logoUrl : null) ?? user.profile?.avatarUrl ?? null,
    specialty: (isBusiness ? user.business?.specialty : user.profile?.specialty) ?? null,
    verified: user.business?.verification === "VERIFIED",
  };
}

export type UserSummary = ReturnType<typeof toUserSummary>;
