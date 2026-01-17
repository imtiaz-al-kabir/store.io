import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

async function getItem(id) {
    try {
        if (!ObjectId.isValid(id)) return null;

        const db = await getDb();
        const item = await db.collection("products").findOne({ _id: new ObjectId(id) });

        if (!item) return null;
        return { ...item, id: item._id.toString() };
    } catch (error) {
        console.error("Error fetching item:", error);
        return null;
    }
}

export default async function ItemDetailsPage({ params }) {
    // Await params object before accessing properties (NextJS 15+ requirement)
    const { id } = await params;
    const item = await getItem(id);

    if (!item) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <main className="flex-grow flex flex-col items-center justify-center max-w-7xl mx-auto px-4 py-12 text-center">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Item not found</h1>
                        <p className="text-gray-500 mb-6">The item you are looking for does not exist or has been removed.</p>
                        <Link href="/items" className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors w-full">
                            Back to Items
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <nav className="mb-8">
                    <Link href="/items" className="inline-flex items-center text-gray-500 hover:text-blue-600 transition-colors font-medium">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Collection
                    </Link>
                </nav>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="lg:flex lg:items-stretch min-h-[600px]">
                        <div className="lg:w-3/5 bg-gray-100 relative group overflow-hidden flex items-center justify-center bg-secondary/20">
                            <div className="relative w-full aspect-[4/3]">
                                <Image
                                    className="h-full w-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    priority
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="lg:w-2/5 p-8 lg:p-12 flex flex-col bg-white">
                            <div className="flex-grow">
                                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-blue-50 text-blue-700 mb-6">
                                    Premium Product
                                </div>
                                <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
                                    {item.name}
                                </h1>
                                <div className="h-px bg-gray-100 w-full mb-8"></div>
                                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                                    {item.description}
                                </p>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-100">
                                <div className="flex items-center justify-between gap-6 mb-8">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Price</p>
                                        <span className="text-4xl font-bold text-gray-900 tracking-tight">${item.price}</span>
                                    </div>
                                    <div className="h-12 w-px bg-gray-200 hidden sm:block"></div>
                                    <div className="hidden sm:block">
                                        <p className="text-sm text-gray-500 mb-1">Availability</p>
                                        <span className="text-green-600 font-medium flex items-center">
                                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                            In Stock
                                        </span>
                                    </div>
                                </div>
                                <button className="w-full bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all transform active:scale-[0.98] shadow-lg hover:shadow-blue-500/30 text-lg">
                                    Add to Cart
                                </button>
                                <p className="text-center text-xs text-gray-400 mt-4">
                                    Free shipping on all orders over $100
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
