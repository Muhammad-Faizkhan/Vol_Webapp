// Response shapes of apps/api. Dates arrive as ISO strings.

export type AccountType = "INDIVIDUAL" | "BUSINESS";
export type Visibility = "PUBLIC" | "PRIVATE";
export type WorkspaceRole = "OWNER" | "ADMIN" | "COLLABORATOR" | "VIEWER";
export type AccountStatus = "ACTIVE" | "SUSPENDED" | "BANNED";
export type Verification = "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";

export type Paged<T> = { items: T[]; total: number; page: number; limit: number; pages: number };

export type UserSummary = {
  id: string;
  username: string | null;
  accountType: AccountType;
  name: string;
  avatarUrl: string | null;
  specialty: string | null;
  verified: boolean;
};

export type Me = UserSummary & {
  displayId: string;
  email: string;
  role: "USER" | "MODERATOR" | "ADMIN";
  emailVerified: boolean;
  onboarded: boolean;
  createdAt: string;
  profile: {
    fullName: string;
    avatarUrl: string | null;
    coverUrl: string | null;
    bio: string | null;
    specialty: string | null;
    interests: string[];
    tags: string[];
    portfolioUrl: string | null;
    phone: string | null;
    country: string | null;
    city: string | null;
    visibility: Visibility;
    searchIndexing: boolean;
    emailNotifications: boolean;
  } | null;
  business: {
    legalName: string;
    contactEmail: string | null;
    phone: string | null;
    website: string | null;
    description: string | null;
    logoUrl: string | null;
    coverUrl: string | null;
    specialty: string | null;
    industry: string | null;
    categoryTags: string[];
    verification: Verification;
    verificationDocUrl: string | null;
  } | null;
};

export type Session = { accessToken: string; user: Me };
export type SignupResult = Session | { email: string; verificationRequired: true };
export type LoginResult = Session | { email: string; twoFactorRequired: true };

export type PublicProfile = UserSummary & {
  isSelf: boolean;
  isFollowing: boolean;
  private: boolean;
  joinedAt: string;
  stats: { followers: number; following: number; products: number; workspaces: number; classrooms: number; canvases: number };
  profile: {
    bio: string | null;
    coverUrl: string | null;
    interests: string[];
    tags: string[];
    portfolioUrl: string | null;
    country: string | null;
    city: string | null;
  } | null;
  business: {
    legalName: string;
    description: string | null;
    logoUrl: string | null;
    coverUrl: string | null;
    industry: string | null;
    categoryTags: string[];
    contactEmail: string | null;
    phone: string | null;
    website: string | null;
    verification: Verification;
  } | null;
};

export type BusinessSuggestion = UserSummary & { industry: string | null; productCount: number; followerCount: number };

export type PersonCard = UserSummary & {
  industry: string | null;
  bio: string | null;
  coverUrl: string | null;
  followerCount: number;
  productCount: number;
  classroomCount: number;
  workspaceCount: number;
  isFollowing: boolean;
};

export type MyStats = {
  workspaces: { total: number; newThisWeek: number };
  canvases: { total: number; public: number };
  products: { total: number; public: number };
  followers: { total: number; newThisMonth: number };
};

export type Notification = {
  id: string;
  type:
    | "WORKSPACE_INVITE"
    | "WORKSPACE_JOIN_REQUEST"
    | "WORKSPACE_JOIN_ACCEPTED"
    | "CLASSROOM_ENROLLED"
    | "POST_COMMENT"
    | "POST_LIKE"
    | "NEW_FOLLOWER"
    | "ACCOUNT_WARNING"
    | "SECURITY_ALERT";
  title: string;
  body: string;
  data: Record<string, string> | null;
  read: boolean;
  resolved: boolean;
  createdAt: string;
  actor: UserSummary | null;
};

export type WorkspaceCard = {
  id: string;
  name: string;
  description: string | null;
  industry: string | null;
  imageUrl: string | null;
  visibility: Visibility;
  owner: UserSummary;
  isOwner: boolean;
  memberCount: number;
  canvasCount: number;
  productCount: number;
  members: (UserSummary & { role: WorkspaceRole })[];
  createdAt: string;
  lastActivityAt: string;
};

export type WorkspaceDetail = WorkspaceCard & { myRole: WorkspaceRole | null };

export type WorkspaceMember = UserSummary & { email: string | null; role: WorkspaceRole; isYou: boolean; joinedAt: string };

export type PendingInvite = { id: string; email: string; role: WorkspaceRole; createdAt: string; expiresAt: string | null };

export type InviteLink = { url: string; token: string; role: WorkspaceRole };

export type InviteLinkPreview = {
  workspace: { id: string; name: string; description: string | null; imageUrl: string | null; memberCount: number; owner: UserSummary };
  role: WorkspaceRole;
  isMember: boolean;
  requestStatus: "PENDING" | "ACCEPTED" | "DECLINED" | null;
};

export type JoinRequest = { id: string; user: UserSummary; createdAt: string };

export type Activity = { id: string; message: string; actor: UserSummary | null; createdAt: string };

export type Folder = { id: string; name: string; canvasCount: number };

export type CanvasCard = {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  visibility: Visibility;
  folderId: string | null;
  workspace: { id: string; name: string };
  collaboratorCount: number;
  productCount: number;
  createdBy: UserSummary;
  createdAt: string;
  updatedAt: string;
};

export type CanvasObject = {
  id: string;
  type: "rect" | "ellipse" | "line" | "path" | "text" | "comment" | "product" | "image";
  x: number;
  y: number;
  w?: number;
  h?: number;
  points?: [number, number][];
  text?: string;
  color?: string;
  fill?: string;
  strokeWidth?: number;
  fontSize?: number;
  productId?: string;
  src?: string;
  author?: string;
};

export type CanvasDocument = { objects: CanvasObject[]; viewport?: { x: number; y: number; zoom: number } };

export type CanvasDetail = CanvasCard & {
  data: CanvasDocument;
  myRole: WorkspaceRole | null;
  canEdit: boolean;
  autosaveSeconds: number;
  products: { id: string; name: string; brand: string | null; image: string | null; business: UserSummary }[];
};

export type SkillLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type LessonKind = "VIDEO" | "DOCUMENT" | "CANVAS" | "QUIZ";

export type ClassroomCard = {
  id: string;
  title: string;
  category: string | null;
  skillLevel: SkillLevel | null;
  imageUrl: string | null;
  visibility: Visibility;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  instructor: UserSummary;
  moduleCount: number;
  enrolledCount: number;
  lessonCount: number;
  completedLessons: number;
  progress: number | null;
  updatedAt: string;
};

export type Lesson = {
  id: string;
  title: string;
  kind: LessonKind;
  position: number;
  durationMinutes: number | null;
  body: string | null;
  resourceUrl: string | null;
  canvas: { id: string; title: string; thumbnailUrl: string | null } | null;
  completed: boolean;
};

export type ClassroomModule = {
  id: string;
  title: string;
  description: string | null;
  position: number;
  durationMinutes: number | null;
  lessons: Lesson[];
};

export type ClassroomDetail = Omit<ClassroomCard, "lessonCount" | "completedLessons" | "progress"> & {
  description: string | null;
  targetAudience: string | null;
  durationLabel: string | null;
  joinCode: string | null;
  isInstructor: boolean;
  isEnrolled: boolean;
  discussionCount: number;
  lessonCount: number;
  completedLessons: number;
  progress: number | null;
  currentModuleId: string | null;
  modules: ClassroomModule[];
};

export type ClassroomPreview = Omit<ClassroomCard, "lessonCount" | "completedLessons" | "progress">;

export type Student = UserSummary & { status: "ACTIVE" | "INACTIVE"; enrolledAt: string; progress: number };

export type Post = {
  id: string;
  title: string;
  body: string;
  category: string | null;
  tags: string[];
  imageUrl: string | null;
  visibility: Visibility;
  classroomId: string | null;
  author: UserSummary;
  canvas: { id: string; title: string; thumbnailUrl: string | null } | null;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  liked: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Comment = { id: string; body: string; author: UserSummary; isMine: boolean; createdAt: string };

export type Product = {
  id: string;
  name: string;
  brand: string | null;
  category: string | null;
  trade: string | null;
  description: string | null;
  heightMm: number | null;
  widthMm: number | null;
  lengthMm: number | null;
  weightKg: number | null;
  price: number | null;
  currency: string;
  images: string[];
  status: "DRAFT" | "PUBLISHED" | "REMOVED";
  size: string | null;
  business: UserSummary;
  canvasCount: number;
  createdAt: string;
  updatedAt: string;
  isMine?: boolean;
};

export type Facets = { trades: { value: string; count: number }[]; brands: { value: string; count: number }[] };

export type SearchResults = {
  people: UserSummary[];
  workspaces: { id: string; name: string; imageUrl: string | null; visibility: Visibility }[];
  classrooms: { id: string; title: string; imageUrl: string | null; category: string | null }[];
  posts: { id: string; title: string; createdAt: string }[];
  products: { id: string; name: string; brand: string | null; image: string | null }[];
};

export type Policy = { type: "TERMS" | "PRIVACY"; version: number; content: string; publishedAt: string };

// ─── Admin ────────────────────────────────────────────────────────────────────

export type AdminUser = {
  id: string;
  displayId: string;
  name: string;
  email: string;
  username: string | null;
  avatarUrl: string | null;
  accountType: AccountType;
  status: AccountStatus;
  suspendedUntil: string | null;
  emailVerified: boolean;
  reports: number;
  lastActiveAt: string | null;
  phone: string | null;
  country: string | null;
  city: string | null;
  joinedAt: string;
  visibility: Visibility;
  business: { legalName: string; verification: Verification; industry: string | null } | null;
};

export type ModerationEntry = { id: string; type: string; reason: string; actor: UserSummary; createdAt: string };

export type AdminUserDetail = AdminUser & {
  bio: string | null;
  workspaces: { id: string; name: string; role: WorkspaceRole; members: number; canvases: number; visibility: Visibility; updatedAt: string }[];
  classrooms: { id: string; title: string; role: "INSTRUCTOR" | "STUDENT"; progress: number | null; status: string }[];
  history: ModerationEntry[];
};

export type CaseStatus = "OPEN" | "IN_REVIEW" | "RESOLVED" | "DISMISSED";

export type AdminCase = {
  id: string;
  displayId: string;
  title: string;
  violation: string;
  status: CaseStatus;
  reportedUser: UserSummary;
  reporter: UserSummary | null;
  assignee: UserSummary | null;
  reportCount: number;
  location: string | null;
  recommendation: string | null;
  evidence: string[];
  escalatedAt: string;
  resolvedAt: string | null;
  createdAt: string;
};

export type AdminCaseDetail = AdminCase & {
  reports: { id: string; targetType: string; targetId: string; reason: string; details: string | null; reporter: UserSummary; createdAt: string }[];
  actions: ModerationEntry[];
};

export type AdminCaseList = Paged<AdminCase> & { stats: { open: number; inReview: number; reopenedThisMonth: number } };

type Stat = { value: number; delta?: string; thisWeek?: number };

export type AdminDashboard = {
  stats: {
    totalUsers: Stat;
    individualUsers: Stat;
    businessUsers: Stat;
    activeUsers30d: Stat;
    newRegistrations7d: Stat;
    workspaces: Stat;
    classrooms: Stat;
    catalogs: Stat;
    canvases: Stat;
    suspendedUsers: Stat;
    bannedUsers: Stat;
  };
  userGrowth: { label: string; total: number; active: number }[];
  businessGrowth: { label: string; business: number }[];
  activityByWeek: { label: string; workspaces: number; canvases: number; classrooms: number; catalog: number }[];
  health: { openCriticalCases: number; securityAlerts24h: number; failedAdminLogins24h: number };
};

export type AdminAnalytics = {
  stats: { totalUsers: number; activeWorkspaces: number; classroomsRunning: number; products: number };
  growth: { label: string; total: number; active: number }[];
  accountShare: { name: string; value: number }[];
};

export type SettingField =
  | { key: string; label: string; kind: "text"; value: string }
  | { key: string; label: string; kind: "number"; value: number; min?: number; max?: number }
  | { key: string; label: string; kind: "toggle"; value: boolean; hint?: string }
  | { key: string; label: string; kind: "select"; value: string; options: string[] };

export type SettingsTab = { value: string; label: string; cards: { title: string; fields: SettingField[] }[] };

export type SecurityOverview = {
  policies: { key: string; label: string; hint?: string; value: boolean }[];
  health: AdminDashboard["health"];
};

export type AuditEntry = {
  id: string;
  action: string;
  entityType: string | null;
  entityId: string | null;
  metadata: unknown;
  ip: string | null;
  actor: UserSummary | null;
  createdAt: string;
};
