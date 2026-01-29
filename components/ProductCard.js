import Link from 'next/link';
import Image from 'next/image';

export default function ProductCard({ product, onAddToCart }) {
    return (
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group border border-gray-700" data-testid={`product-card-${product.id}`}>
            <div className="relative h-64 overflow-hidden">
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Link href={`/products/${product.id}`} className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors">
                        View Details
                    </Link>
                </div>
            </div>
            <div className="p-5">
                <Link href={`/products/${product.id}`}>
                    <h3 className="text-xl font-bold text-white mb-2 hover:text-blue-400 transition-colors">{product.name}</h3>
                </Link>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-emerald-400">${product.price.toFixed(2)}</span>
                    <button
                        onClick={() => onAddToCart(product.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                        data-testid={`add-to-cart-button-${product.id}`}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
