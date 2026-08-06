import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, ArrowLeft, ArrowRight, X } from 'lucide-react';
import apiService from '../../services/apiService';
import ProductCard from '../../components/products/ProductCard';
import Skeleton from '../../components/common/Skeleton';

export default function Catalog() {
  const location = useLocation();
  const navigate = useNavigate();

  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('categoryId') || '';

  // Local state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtering inputs
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchVal, setSearchVal] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('price');
  const [sortDir, setSortDir] = useState('asc');
  
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Sync state with URL parameter changes
  useEffect(() => {
    const cid = new URLSearchParams(location.search).get('categoryId') || '';
    setSelectedCategory(cid);
    setPage(0);
  }, [location.search]);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const catList = await apiService.home.getCategories();
        setCategories(catList || []);
      } catch (err) {
        console.error('Failed to load categories:', err.message);
      }
    };
    loadCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const pagedData = await apiService.products.getAll({
          page,
          size: 8,
          sortBy,
          sortDir,
          search: searchQuery,
          categoryId: selectedCategory
        });

        if (pagedData) {
          setProducts(pagedData.content || []);
          setTotalPages(pagedData.totalPages || 0);
          setTotalElements(pagedData.totalElements || 0);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, selectedCategory, searchQuery, sortBy, sortDir]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchVal);
    setPage(0);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setPage(0);
    if (categoryId) {
      navigate(`/catalog?categoryId=${categoryId}`);
    } else {
      navigate('/catalog');
    }
  };

  const clearFilters = () => {
    setSearchVal('');
    setSearchQuery('');
    handleCategorySelect('');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-bg-surface/50 border border-white/5 p-6 rounded-2xl">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            className="w-full pl-11 pr-4 py-2.5 bg-bg-surface border border-white/10 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl outline-none text-white text-sm transition"
            placeholder="Search products..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <SlidersHorizontal size={16} className="text-gray-400" />
          <select
            className="px-4 py-2.5 bg-bg-surface border border-white/10 focus:border-brand-primary rounded-xl text-sm text-gray-200 outline-none cursor-pointer"
            value={`${sortBy}-${sortDir}`}
            onChange={(e) => {
              const [field, dir] = e.target.value.split('-');
              setSortBy(field);
              setSortDir(dir);
              setPage(0);
            }}
          >
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>
      </div>

      {/* Catalog Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="space-y-6">
          <div className="bg-bg-surface border border-white/5 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Filter size={16} className="text-brand-primary" />
              Categories
            </h3>
            
            <div className="flex flex-col gap-1 text-sm text-gray-400">
              <button
                onClick={() => handleCategorySelect('')}
                className={`w-full text-left px-3 py-2 rounded-xl transition ${
                  selectedCategory === ''
                    ? 'bg-brand-primary/10 text-brand-primary font-bold border-l-3 border-brand-primary'
                    : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(String(cat.id))}
                  className={`w-full text-left px-3 py-2 rounded-xl transition ${
                    selectedCategory === String(cat.id)
                      ? 'bg-brand-primary/10 text-brand-primary font-bold border-l-3 border-brand-primary'
                      : 'hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="lg:col-span-3 space-y-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <Skeleton variant="card" count={6} />
            </div>
          ) : error ? (
            <div className="glass flex items-center justify-center p-12 rounded-2xl text-rose-400 font-medium">
              {error}
            </div>
          ) : products.length === 0 ? (
            <div className="glass flex flex-col items-center justify-center py-20 px-4 rounded-2xl text-center space-y-4">
              <h3 className="text-xl font-bold text-gray-300">No Products Found</h3>
              <p className="text-gray-500 text-sm max-w-sm">
                We couldn't find any products matching your select query parameters. Try modifying your search filters.
              </p>
              {(searchQuery || selectedCategory) && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white cursor-pointer"
                >
                  <X size={14} />
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-4">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    className="flex items-center gap-1.5 px-4 py-2 bg-bg-surface border border-white/10 hover:border-white/20 text-xs font-bold rounded-xl text-gray-300 hover:text-white disabled:opacity-40 transition cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    Previous
                  </button>
                  <span className="text-sm font-semibold text-gray-400">
                    Page {page + 1} of {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    className="flex items-center gap-1.5 px-4 py-2 bg-bg-surface border border-white/10 hover:border-white/20 text-xs font-bold rounded-xl text-gray-300 hover:text-white disabled:opacity-40 transition cursor-pointer"
                  >
                    Next
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
