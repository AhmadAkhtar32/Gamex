import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminProductsPage() {
  await requireAdmin();

  return (
    <main className="min-h-screen bg-white p-10">
      <h1 className="text-3xl font-bold text-brand-deep">
        Admin Products Works
      </h1>
    </main>
  );
}