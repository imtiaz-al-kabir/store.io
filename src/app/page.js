import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LandingPage from '@/components/LandingPage';

import { getDb } from "@/lib/db";

async function getTrendingItems() {
  try {
    const db = await getDb();
    // Fetch top 4 items
    const items = await db.collection("products").find({}).limit(4).toArray();

    return items.map(item => ({
      ...item,
      id: item._id.toString()
    }));
  } catch (error) {
    console.error("Failed to fetch trending items", error);
    return [];
  }
}

export default async function Home() {
  const items = await getTrendingItems();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      <LandingPage items={items} />
      <Footer />
    </div>
  );
}
