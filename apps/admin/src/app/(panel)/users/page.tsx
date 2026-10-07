import { UsersTable } from "./UsersTable";

export default async function UsersPage({ searchParams }: PageProps<"/users">) {
  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q) ?? "";
  // Keyed on the query so a new top-nav search resets the table's local search state.
  return <UsersTable key={query} initialQuery={query} />;
}
