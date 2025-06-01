import AdminDashboard from "@/components/admin/dashboard";
import Navbar from "@/components/navbar";
import { getBooks } from "@/lib/book";
import { getAuthors } from "@/lib/author";
import AdminNavbar from "@/components/admin-navbar";

export default async function AdminPage() {

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
        <AdminDashboard />
      </div>
    </main>
  );
}
