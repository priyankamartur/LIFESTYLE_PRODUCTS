import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, Search, ArrowLeft, ArrowRight } from 'lucide-react';
import apiService from '../../services/apiService';

export default function AdminProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await apiService.admin.getProducts({
        page,
        size: 10,
        search: searchQuery
      });
      setProducts(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      toast.error('Failed to load products list.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [page, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchVal);
    setPage(0);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Products Catalog</h1>
          <p className="text-gray-400 text-sm">Add, modify, or archive inventory products</p>
        </div>
        <Link
          to="/admin/products/add"
          className="flex items-center gap-1.5 px-5 py-3 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold rounded-xl shadow-md transition duration-200"
        >
          <Plus size={16} />
          Create Product
        </Link>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-grow">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search by product name, catalog reference..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl outline-none text-white text-sm transition focus:border-amber-500"
          />
        </div>
        <button
          type="submit"
          className="px-6 bg-gray-900 hover:bg-gray-850 border border-gray-800 hover:border-gray-700 text-white font-bold rounded-xl text-sm transition cursor-pointer"
        >
          Search
        </button>
      </form>

      {/* Product List Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-lg">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-gray-700 border-t-amber-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="text-xs font-bold text-gray-500 uppercase border-b border-gray-800">
                  <tr>
                    <th className="pb-3 pl-2">Product</th>
                    <th className="pb-3">Reference ID</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Price</th>
                    <th className="pb-3 text-right pr-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {products.length > 0 ? (
                    products.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-850/50 transition">
                        <td className="py-4 pl-2 flex items-center gap-3">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-10 h-10 object-cover rounded-lg border border-gray-800"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60';
                            }}
                          />
                          <span className="font-semibold text-white">{p.name}</span>
                        </td>
                        <td className="py-4 font-mono text-xs">#{p.id}</td>
                        <td className="py-4 text-xs font-semibold">{p.categoryName || 'General'}</td>
                        <td className="py-4 font-bold text-white">${parseFloat(p.price || 0).toFixed(2)}</td>
                        <td className="py-4 text-right pr-2 space-x-2">
                          <Link
                            to={`/admin/products/edit/${p.id}`}
                            className="inline-flex p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition"
                          >
                            <Edit size={14} />
                          </Link>
                          <Link
                            to={`/admin/products/delete/${p.id}`}
                            className="inline-flex p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 rounded-lg transition"
                          >
                            <Trash2 size={14} />
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-12 text-center text-gray-500">
                        No products found matching the criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center pt-4 border-t border-gray-800 text-xs">
                <span className="text-gray-500 font-semibold">
                  Page {page + 1} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="flex items-center gap-1 px-3 py-2 bg-gray-850 hover:bg-gray-800 disabled:opacity-40 text-gray-300 font-bold rounded-xl transition border border-gray-800 cursor-pointer"
                  >
                    <ArrowLeft size={13} /> Prev
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page === totalPages - 1}
                    className="flex items-center gap-1 px-3 py-2 bg-gray-850 hover:bg-gray-800 disabled:opacity-40 text-gray-300 font-bold rounded-xl transition border border-gray-800 cursor-pointer"
                  >
                    Next <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
