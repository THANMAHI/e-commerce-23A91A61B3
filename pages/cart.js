import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../components/Layout';

export default function Cart() {
    const { data: session, status } = useSession();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCart = async () => {
        try {
            const res = await fetch('/api/cart');
            if (res.ok) {
                const data = await res.json();
                setCartItems(data);
            }
        } catch (error) {
            console.error('Failed to fetch cart', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === 'authenticated') {
            fetchCart();
        } else if (status === 'unauthenticated') {
            setLoading(false);
            // Middleware should handle redirect, but client-side check is safe
        }
    }, [status]);

    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;

        // Optimistic update
        setCartItems(prev => prev.map(item =>
            item.productId === productId ? { ...item, quantity: newQuantity } : item
        ));

        try {
            const res = await fetch('/api/cart', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, quantity: newQuantity }),
            });
            if (!res.ok) {
                // Revert on failure
                fetchCart();
            }
        } catch (error) {
            fetchCart();
        }
    };

    const removeItem = async (productId) => {
        // Optimistic update
        setCartItems(prev => prev.filter(item => item.productId !== productId));

        try {
            await fetch('/api/cart', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId }),
            });
        } catch (error) {
            console.error(error);
            fetchCart();
        }
    };

    const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    if (loading) return <Layout><div className="text-center py-20">Loading cart...</div></Layout>;

    return (
        <Layout>
            <h1 className="text-3xl font-bold mb-8 text-white">Your Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-20 bg-gray-800 rounded-xl border border-gray-700">
                    <p className="text-xl text-gray-400 mb-4">Your cart is empty.</p>
                    <Link href="/" className="text-blue-400 hover:text-blue-300 font-medium">
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex items-center space-x-6"
                                data-testid={`cart-item-${item.productId}`}
                            >
                                <img
                                    src={item.product.imageUrl}
                                    alt={item.product.name}
                                    className="w-24 h-24 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-white">{item.product.name}</h3>
                                    <p className="text-emerald-400 font-medium">${item.product.price.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                                        className="w-20 bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        data-testid={`quantity-input-${item.productId}`}
                                    />
                                    <button
                                        onClick={() => removeItem(item.productId)}
                                        className="text-red-400 hover:text-red-300 p-2 rounded-full hover:bg-red-400/10 transition-colors"
                                        data-testid={`remove-item-button-${item.productId}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 sticky top-24">
                            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-gray-400">Total</span>
                                <span className="text-3xl font-bold text-emerald-400" data-testid="cart-total">
                                    ${total.toFixed(2)}
                                </span>
                            </div>
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-600/20 transition-all active:scale-95">
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
