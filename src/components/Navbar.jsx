import Link from 'next/link';
import { auth, signOut } from '@/auth';

export default async function Navbar() {
    const session = await auth();

    return (
        <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 transition-all duration-300">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                                S
                            </div>
                            <span className="text-xl font-bold tracking-tight text-foreground">store.io</span>
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        <nav className="flex space-x-6">
                            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                Home
                            </Link>
                            <Link href="/items" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                Collection
                            </Link>
                            {session && (
                                <Link href="/add-item" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                    Sell Item
                                </Link>
                            )}
                        </nav>

                        <div className="flex items-center gap-4 pl-6 border-l border-border/50">
                            {session ? (
                                <form
                                    action={async () => {
                                        "use server"
                                        await signOut()
                                    }}
                                >
                                    <button type="submit" className="text-sm font-medium text-muted-foreground hover:text-destructive transition-colors">
                                        Log out
                                    </button>
                                </form>
                            ) : (
                                <Link href="/login" className="px-5 py-2 rounded-full text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-sm hover:shadow-md">
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
