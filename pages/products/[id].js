import { useState } from 'react';
import Image from 'next/image';
import { useSession, signIn } from 'next-auth/react';
import prisma from '../../lib/prisma';
import Layout from '../../components/Layout';

export async function getServerSideProps(context) {
    const { id } = context.params;

    const product = await prisma.product.findUnique({
        where: { id },
    });

    if (!product) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            product: JSON.parse(JSON.stringify(product)),
        },
    };
}

export default function ProductDetail({ product }) {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);

    const handleAddToCart = async () => {
        if (!session) {
            signIn();
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId: product.id, quantity: 1 }),
            });

            if (res.ok) {
                alert('Product added to cart!');
            } else {
                alert('Failed to add to cart.');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
                <div className="md:flex">
                    <div className="md:flex-shrink-0 md:w-1/2">
                        <div className="h-96 md:h-full relative">
                            <img
                                className="w-full h-full object-cover"
                                src={product.imageUrl}
                                alt={product.name}
                            />
                        </div>
                    </div>
                    <div className="p-8 md:w-1/2 flex flex-col justify-center">
                        <h1 className="text-3xl font-bold text-white mb-4" data-testid="product-name">
                            {product.name}
                        </h1>
                        <p className="text-emerald-400 text-2xl font-semibold mb-6" data-testid="product-price">
                            ${product.price.toFixed(2)}
                        </p>
                        <p className="text-gray-300 text-lg mb-8 leading-relaxed" data-testid="product-description">
                            {product.description}
                        </p>
                        <button
                            onClick={handleAddToCart}
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-blue-600/20 transform transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            data-testid="add-to-cart-button"
                        >
                            {loading ? 'Adding...' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
