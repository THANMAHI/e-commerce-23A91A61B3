import Link from 'next/link';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Layout({ children }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        router.push(`/?q=${searchTerm}`);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            <nav className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                                LuxeStore
                            </Link>
                        </div>
                        <div className="flex-1 max-w-md mx-4">
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="w-full bg-gray-700 text-white rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    data-testid="search-input"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                    data-testid="search-button"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                        <div className="flex items-center space-x-4">
                            {session ? (
                                <>
                                    <Link href="/cart" className="text-gray-300 hover:text-white transition-colors">
                                        Cart
                                    </Link>
                                    <div className="flex items-center space-x-2">
                                        <Image src={session.user.image || 'https://via.placeholder.com/32'} alt="User" width={32} height={32} className="rounded-full border border-gray-600" />
                                        <button
                                            onClick={() => signOut()}
                                            className="bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                                            data-testid="signout-button"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <button
                                    onClick={() => signIn()}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-lg shadow-blue-600/20"
                                    data-testid="signin-button"
                                >
                                    Sign In
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                {children}
            </main>
            <footer className="bg-gray-800 border-t border-gray-700 py-6 mt-12">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
                    &copy; 2026 LuxeStore. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
