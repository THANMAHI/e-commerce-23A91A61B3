import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession, signIn } from 'next-auth/react';
import prisma from '../lib/prisma';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';

export async function getServerSideProps(context) {
  const { q = '', page = 1 } = context.query;
  const pageNum = parseInt(page);
  const pageSize = 12;

  const where = q
    ? {
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ],
    }
    : {};

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)), // Serialize dates
      currentPage: pageNum,
      totalPages: Math.ceil(totalCount / pageSize),
      searchTerm: q,
    },
  };
}

export default function Home({ products, currentPage, totalPages, searchTerm }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async (productId) => {
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
        body: JSON.stringify({ productId, quantity: 1 }),
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

  const changePage = (page) => {
    router.push({
      pathname: '/',
      query: { ...router.query, page },
    });
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          {searchTerm ? `Search Results for "${searchTerm}"` : 'Featured Products'}
        </h1>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-12 space-x-4">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-4 py-2 bg-gray-800 text-white rounded-md disabled:opacity-50 hover:bg-gray-700 transition-colors"
            data-testid="pagination-prev"
          >
            Previous
          </button>
          <span className="flex items-center text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-4 py-2 bg-gray-800 text-white rounded-md disabled:opacity-50 hover:bg-gray-700 transition-colors"
            data-testid="pagination-next"
          >
            Next
          </button>
        </div>
      )}
    </Layout>
  );
}
