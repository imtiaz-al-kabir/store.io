import AddItemForm from "@/components/AddItemForm";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function AddItemPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-15 py-12">
        <AddItemForm />
      </main>
      <Footer />
    </div>
  );
}
