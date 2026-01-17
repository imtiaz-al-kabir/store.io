import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LandingPage from '@/components/LandingPage';

async function getTrendingItems() {
  try {
    // In a real app, you might add a ?limit=4 query param
    const res = await fetch('http://localhost:4000/items', {
      next: { revalidate: 60 }
    });
    if (!res.ok) return [];
    const items = await res.json();
    return items.slice(0, 4); // Just show top 4
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
