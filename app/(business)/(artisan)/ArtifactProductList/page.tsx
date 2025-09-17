'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';

interface Product {
  name: string;
  price: string;
  images: string[];
}

interface ArtifactRow {
  products: Product[] | null;
  payment_status: boolean | null;
}

export default function ArtifactProductList() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasPaid, setHasPaid] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) console.error('User error:', userError);

      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from('artifacts')
          .select('products, payment_status')
          .eq('artisan_id', user.id)
          .single<ArtifactRow>();

        if (error && error.code !== 'PGRST116') {
          // PGRST116 = no rows found
          console.error('Fetch artifacts error:', error);
        }

        if (data) {
          setHasPaid(Boolean(data.payment_status));
          setProducts(data.products ?? []);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If the user hasn't paid, show a pay-now screen
  if (!hasPaid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Listing Payment Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please pay the listing fee to showcase your products on the map.
          </p>
          <button
            onClick={() => router.push('/ArtisanPayment')}
            className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-green-600 hover:to-blue-700 transition-all"
          >
            Pay Listing Fee
          </button>
        </div>
      </div>
    );
  }

  // Show products if payment_status is true
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Your Products</h1>
          <Link
            href="/ArtisanProductForm"
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            Add Shop & Artifacts
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                No Products Listed
              </h2>
              <p className="text-gray-600">
                Add products to display them on the map.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((product, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-green-600 font-semibold">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
