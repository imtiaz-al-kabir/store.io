import Footer from "@/components/Footer";
import ItemCard from "@/components/ItemCard";
import Navbar from "@/components/Navbar";

// Force dynamic to ensure we always fetch fresh data from DB
export const dynamic = "force-dynamic";

import { getDb } from "@/lib/db";

async function getItems() {
  try {
    const db = await getDb();
    const items = await db.collection("products").find({}).toArray();
    return items.map(item => ({
      ...item,
      id: item._id.toString()
    }));
  } catch (error) {
    console.error("Error fetching items:", error);
    return [];
  }
}

export default async function ItemsPage() {
  const items = await getItems();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl pt-15">
            Our Items
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Explore our exclusive collection.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              No items found. expecting new arrivals soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:gap-x-8">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
