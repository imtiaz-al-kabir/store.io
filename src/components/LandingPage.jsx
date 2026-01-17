"use client";

import Link from 'next/link';
import { ArrowRight, Package, Star, Shield, Zap, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const stagger = {
    show: {
        transition: {
            staggerChildren: 0.05
        }
    }
};

export default function LandingPage({ items = [] }) {
    return (
        <main className="pt-24 pb-12">
            {/* Section 1: Hero - Modern Center Aligned */}
            <section className="relative px-6 lg:px-8 py-20 lg:py-32 max-w-[1200px] mx-auto text-center">
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={stagger}
                    className="flex flex-col items-center"
                >
                    <motion.div variants={fadeInUp} className="inline-flex items-center rounded-full border border-border bg-secondary/50 px-3 py-1 text-sm font-medium text-secondary-foreground mb-8">
                        <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                        New Arrivals for 2024
                    </motion.div>

                    <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 max-w-4xl mx-auto leading-[1.1]">
                        The future of shopping is <br /> <span className="text-muted-foreground">clean and simple.</span>
                    </motion.h1>

                    <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                        Discover a curated collection of premium goods efficiently. No clutter, just quality.
                    </motion.p>

                    <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-xs sm:max-w-md mx-auto">
                        <Link href="/items" className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-primary-foreground bg-primary rounded-full hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                            Start Exploring
                        </Link>
                        <Link href="/login" className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-foreground bg-white border border-border rounded-full hover:bg-muted transition-all">
                            Join Community
                        </Link>
                    </motion.div>
                </motion.div>
            </section>

            {/* Section 2: Features - Bento Grid Style */}
            <section className="py-24 bg-white">
                <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: Globe, title: 'Global', desc: 'Sourced from everywhere.' },
                            { icon: Shield, title: 'Secure', desc: 'Bank-grade protection.' },
                            { icon: Zap, title: 'Fast', desc: 'Instant processing.' },
                        ].map((feature, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                key={idx}
                                className="p-8 rounded-2xl bg-secondary/30 border border-border/50 flex flex-col items-center text-center hover:bg-secondary/50 transition-colors"
                            >
                                <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-foreground mb-4">
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground text-sm">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 3: Trending - Clean Cards */}
            <section className="py-24 bg-muted/30 border-y border-border/40">
                <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Trending Now</h2>
                            <p className="text-muted-foreground mt-2">Pieces you won't want to miss.</p>
                        </div>
                        <Link href="/items" className="font-medium text-foreground hover:opacity-70 flex items-center transition-opacity">
                            View All <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {items?.length > 0 ? (
                            items.map((item, i) => (
                                <Link href={`/items/${item.id}`} key={item.id} className="group block bg-white rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                                    <div className="aspect-square relative overflow-hidden bg-secondary">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-semibold text-foreground mb-1 truncate">{item.name}</h3>
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground text-sm">In Stock</span>
                                            <span className="font-bold text-foreground">${item.price}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center text-muted-foreground">
                                Loading latest arrivals...
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Section 4: How It Works - Clean Steps */}
            <section className="py-24 bg-white border-b border-border/40">
                <div className="max-w-[1200px] mx-auto px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-16">Simple as 1-2-3</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {[
                            { step: '01', title: 'Discover', desc: 'Browse our curated collection of premium items.' },
                            { step: '02', title: 'Select', desc: 'Choose what fits your style and add to cart.' },
                            { step: '03', title: 'Enjoy', desc: 'Fast shipping directly to your doorstep.' }
                        ].map((item, i) => (
                            <div key={i} className="relative z-10 bg-white p-6 rounded-3xl border border-dashed border-border/60">
                                <div className="text-4xl font-bold text-muted-foreground/20 mb-4">{item.step}</div>
                                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                <p className="text-muted-foreground">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 5: Testimonials - Modern Cards */}
            <section className="py-24 bg-muted/20">
                <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-16">Trusted by Creators</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { quote: "The quality is unmatched. Pure aesthetic joy.", author: "Alex D.", role: "Designer" },
                            { quote: "Finally, a store that understands minimalism.", author: "Sarah M.", role: "Architect" },
                            { quote: "Fast, secure, and beautiful packaging.", author: "James L.", role: "Developer" }
                        ].map((t, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-border/40">
                                <div className="flex gap-1 text-yellow-400 mb-4">
                                    {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
                                </div>
                                <p className="text-foreground mb-6 font-medium">"{t.quote}"</p>
                                <div>
                                    <div className="font-bold text-sm">{t.author}</div>
                                    <div className="text-xs text-muted-foreground">{t.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 6: FAQ - clean accordion style */}
            <section className="py-24 bg-white">
                <div className="max-w-2xl mx-auto px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-12">Common Questions</h2>
                    <div className="space-y-4">
                        {[
                            { q: "Do you ship worldwide?", a: "Yes, we ship to over 100 countries via secured partners." },
                            { q: "What is the return policy?", a: "30-day no-questions-asked return policy on all items." },
                            { q: "Is my payment secure?", a: "We use bank-grade encryption for all transactions." }
                        ].map((faq, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-secondary/20 border border-border/40">
                                <h3 className="font-bold mb-2">{faq.q}</h3>
                                <p className="text-muted-foreground text-sm">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 7: Newsletter */}
            <section className="py-24 bg-secondary/10 border-t border-border/40">
                <div className="max-w-xl mx-auto px-6 text-center">
                    <div className="mb-6 inline-flex p-3 rounded-2xl bg-secondary/50 text-foreground">
                        <Package className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Join the list</h2>
                    <p className="text-muted-foreground mb-8">No spam, just updates on new drops.</p>
                    <form className="flex gap-2">
                        <input
                            type="email"
                            placeholder="email@example.com"
                            className="flex-1 px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
                        />
                        <button type="submit" className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
                            Join
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
}
