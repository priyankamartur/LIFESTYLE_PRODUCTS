import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { Package2, Plus, Edit3, Trash2, List, ArrowLeft, ArrowRight, ShieldAlert, X } from 'lucide-react';
import apiService from '../../services/apiService';

export default function ProductAdmin() {
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'categories'
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Modal toggle states
  const [showProductModal, setShowProductModal] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // Forms setup
  const {
    register: registerProduct,
    handleSubmit: handleProductSubmit,
    setValue: setProductValue,
    reset: resetProductForm,
    formState: { errors: productErrors },
  } = useForm();

  const {
    register: registerCategory,
    handleSubmit: handleCategorySubmit,
    setValue: setCategoryValue,
    reset: resetCategoryForm,
    formState: { errors: categoryErrors },
  } = useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const [catsData, prodsData] = await Promise.all([
        apiService.categories.getAll(),
        apiService.products.getAll({ page, size: 10 })
      ]);
      setCategories(catsData.content || catsData || []);
      setProducts(prodsData.content || []);
      setTotalPages(prodsData.totalPages || 0);
    } catch (err) {
      toast.error('Failed to load catalog data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, activeTab]);

  const onProductSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        price: parseFloat(data.price),
        description: data.description,
        categoryId: parseInt(data.categoryId),
        imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60',
        featured: data.featured
      };

      if (isEditingProduct) {
        await apiService.products.update(selectedProductId, payload);
        toast.success('Product updated successfully!');
      } else {
        await apiService.products.create(payload);
        toast.success('Product created successfully!');
      }

      setShowProductModal(false);
      resetProductForm();
      loadData();
    } catch (err) {
      toast.error(err.message || 'Operation failed.');
    }
  };

  const handleEditProductClick = (p) => {
    setIsEditingProduct(true);
    setSelectedProductId(p.id);
    setProductValue('name', p.name);
    setProductValue('price', p.price);
    setProductValue('description', p.description || '');
    setProductValue('categoryId', p.categoryId || '');
    setProductValue('imageUrl', p.imageUrl || '');
    setProductValue('featured', p.featured || false);
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Delete product "${name}"? This action cannot be reverted.`)) return;
    try {
      await apiService.products.delete(id);
      toast.success('Product deleted.');
      loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to delete product.');
    }
  };

  const onCategorySubmit = async (data) => {
    try {
      if (isEditingCategory) {
        await apiService.categories.update(selectedCategoryId, data);
        toast.success('Category updated successfully!');
      } else {
        await apiService.categories.create(data);
        toast.success('Category created successfully!');
      }

      setShowCategoryModal(false);
      resetCategoryForm();
      loadData();
    } catch (err) {
      toast.error(err.message || 'Operation failed.');
    }
  };

  const handleEditCategoryClick = (c) => {
    setIsEditingCategory(true);
    setSelectedCategoryId(c.id);
    setCategoryValue('name', c.name);
    setCategoryValue('description', c.description || '');
    setCategoryValue('imageUrl', c.imageUrl || '');
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"? Warning: products under this category might experience errors.`)) return;
    try {
      await apiService.categories.delete(id);
      toast.success('Category deleted.');
      loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to delete category.');
    }
  };

  const styles = {
    subbar: 'flex gap-4 border-b border-white/5 pb-4 mb-8',
    subLink: 'px-4 py-2 rounded-xl text-sm font-semibold text-gray-400 transition hover:text-white',
    activeSubLink: 'bg-brand-primary/10 text-brand-primary border-l-2 border-brand-primary',
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-white tracking-tight font-sans">Product Catalog Admin</h1>
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-accent/10 border border-brand-accent/20 text-brand-accent rounded-lg text-xs font-semibold uppercase tracking-wider">
          <ShieldAlert size={14} />
          Inventory Command
        </span>
      </div>

      {/* Admin subbar navigation */}
      <div className={styles.subbar}>
        <Link to="/admin/dashboard" className={styles.subLink}>
          Analytics Overview
        </Link>
        <Link to="/admin/products" className={`${styles.subLink} ${styles.activeSubLink}`}>
          Products Management
        </Link>
        <Link to="/admin/users" className={styles.subLink}>
          Users Management
        </Link>
      </div>

      {/* Toggle View Tabs */}
      <div className="flex gap-4">
        <button
          onClick={() => { setActiveTab('products'); setPage(0); }}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
            activeTab === 'products' ? 'bg-brand-primary text-white' : 'bg-white/5 hover:bg-white/10 text-gray-300'
          }`}
        >
          <Package2 size={15} />
          Products Table
        </button>
        <button
          onClick={() => { setActiveTab('categories'); setPage(0); }}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
            activeTab === 'categories' ? 'bg-brand-primary text-white' : 'bg-white/5 hover:bg-white/10 text-gray-300'
          }`}
        >
          <List size={15} />
          Categories Table
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-10 h-10 border-3 border-gray-700 border-t-brand-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* TAB 1: PRODUCT LIST */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-bg-surface/50 border border-white/5 p-5 rounded-2xl">
                <h3 className="text-base font-bold text-white tracking-tight">Catalog Inventory</h3>
                <button
                  onClick={() => { setIsEditingProduct(false); resetProductForm(); setShowProductModal(true); }}
                  className="flex items-center gap-1 px-4 py-2.5 bg-gradient-to-r from-brand-primary to-indigo-600 hover:opacity-95 text-white font-bold rounded-xl text-xs shadow-lg transition cursor-pointer"
                >
                  <Plus size={15} />
                  Add New Product
                </button>
              </div>

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Product Details</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Featured</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {products.map((p) => (
                      <tr key={p.id} className="text-gray-300">
                        <td className="font-semibold text-white py-4">{p.name}</td>
                        <td>{p.categoryName || 'General'}</td>
                        <td>${p.price.toFixed(2)}</td>
                        <td>
                          {p.featured ? (
                            <span className="badge bg-brand-primary/10 border border-brand-primary/20 text-brand-primary">Featured</span>
                          ) : (
                            <span className="badge bg-white/5 border border-white/10 text-gray-400">Standard</span>
                          )}
                        </td>
                        <td className="text-right py-4 space-x-2">
                          <button
                            onClick={() => handleEditProductClick(p)}
                            className="p-2 bg-white/5 border border-white/10 hover:border-brand-primary hover:bg-brand-primary/10 text-gray-300 hover:text-white rounded-xl transition cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-2 bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500 text-gray-400 hover:text-white rounded-xl transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Product pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4">
                  <button disabled={page === 0} onClick={() => setPage(p => Math.max(0, p - 1))} className="flex items-center gap-1.5 px-4 py-2 bg-bg-surface border border-white/10 rounded-xl text-xs font-bold text-gray-300 hover:text-white disabled:opacity-40 transition cursor-pointer">
                    <ArrowLeft size={14} /> Prev
                  </button>
                  <span className="text-sm text-gray-400">Page {page + 1} of {totalPages}</span>
                  <button disabled={page >= totalPages - 1} onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} className="flex items-center gap-1.5 px-4 py-2 bg-bg-surface border border-white/10 rounded-xl text-xs font-bold text-gray-300 hover:text-white disabled:opacity-40 transition cursor-pointer">
                    Next <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CATEGORY LIST */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-bg-surface/50 border border-white/5 p-5 rounded-2xl">
                <h3 className="text-base font-bold text-white tracking-tight">Product Categories</h3>
                <button
                  onClick={() => { setIsEditingCategory(false); resetCategoryForm(); setShowCategoryModal(true); }}
                  className="flex items-center gap-1 px-4 py-2.5 bg-gradient-to-r from-brand-primary to-indigo-600 hover:opacity-95 text-white font-bold rounded-xl text-xs shadow-lg transition cursor-pointer"
                >
                  <Plus size={15} />
                  Add Category
                </button>
              </div>

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Category Name</th>
                      <th>Description</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {categories.map((c) => (
                      <tr key={c.id} className="text-gray-300">
                        <td className="font-extrabold text-white">#{c.id}</td>
                        <td className="font-semibold text-white py-4">{c.name}</td>
                        <td className="text-sm text-gray-400">{c.description || 'No description provided.'}</td>
                        <td className="text-right py-4 space-x-2">
                          <button
                            onClick={() => handleEditCategoryClick(c)}
                            className="p-2 bg-white/5 border border-white/10 hover:border-brand-primary hover:bg-brand-primary/10 text-gray-300 hover:text-white rounded-xl transition cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(c.id, c.name)}
                            className="p-2 bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500 text-gray-400 hover:text-white rounded-xl transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* MODAL 1: PRODUCT SUBMIT FORM */}
      {showProductModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass w-full max-w-lg p-8 rounded-3xl space-y-6 animate-fadeIn relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowProductModal(false)}
              className="absolute top-6 right-6 p-1 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg cursor-pointer"
            >
              <X size={16} />
            </button>

            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {isEditingProduct ? 'Modify Product Details' : 'Add Store Product'}
            </h2>

            <form onSubmit={handleProductSubmit(onProductSubmit)} className="space-y-4 text-sm text-gray-300">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Product Name*</label>
                <input
                  type="text"
                  className={`w-full px-4 py-2.5 bg-bg-surface border ${
                    productErrors.name ? 'border-rose-500' : 'border-white/10'
                  } focus:border-brand-primary rounded-xl outline-none text-white`}
                  {...registerProduct('name', { required: 'Product name is required' })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Price ($)*</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className={`w-full px-4 py-2.5 bg-bg-surface border ${
                      productErrors.price ? 'border-rose-500' : 'border-white/10'
                    } focus:border-brand-primary rounded-xl outline-none text-white`}
                    {...registerProduct('price', { required: 'Price is required' })}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Category*</label>
                  <select
                    className={`px-4 py-2.5 bg-bg-surface border ${
                      productErrors.categoryId ? 'border-rose-500' : 'border-white/10'
                    } focus:border-brand-primary rounded-xl outline-none text-gray-200 cursor-pointer`}
                    {...registerProduct('categoryId', { required: 'Category is required' })}
                  >
                    <option value="">-- Select --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 bg-bg-surface border border-white/10 focus:border-brand-primary rounded-xl outline-none text-white"
                  {...registerProduct('imageUrl')}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</label>
                <textarea
                  rows="3"
                  className="w-full px-4 py-2.5 bg-bg-surface border border-white/10 focus:border-brand-primary rounded-xl outline-none text-white resize-y"
                  {...registerProduct('description')}
                />
              </div>

              <div className="flex items-center gap-2 pt-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="featured"
                  className="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary bg-bg-surface border-white/10 cursor-pointer"
                  {...registerProduct('featured')}
                />
                <label htmlFor="featured" className="text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer">
                  Featured Showcase (Feature on landing page)
                </label>
              </div>

              <div className="flex gap-4 pt-4 border-t border-white/5">
                <button type="button" onClick={() => setShowProductModal(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-brand-primary to-indigo-600 hover:opacity-95 text-white font-bold rounded-xl shadow-lg transition cursor-pointer">
                  {isEditingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CATEGORY SUBMIT FORM */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass w-full max-w-md p-8 rounded-3xl space-y-6 animate-fadeIn relative">
            <button
              onClick={() => setShowCategoryModal(false)}
              className="absolute top-6 right-6 p-1 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg cursor-pointer"
            >
              <X size={16} />
            </button>

            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {isEditingCategory ? 'Modify Category' : 'Create Category'}
            </h2>

            <form onSubmit={handleCategorySubmit(onCategorySubmit)} className="space-y-4 text-sm text-gray-300">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Category Name*</label>
                <input
                  type="text"
                  className={`w-full px-4 py-2.5 bg-bg-surface border ${
                    categoryErrors.name ? 'border-rose-500' : 'border-white/10'
                  } focus:border-brand-primary rounded-xl outline-none text-white`}
                  {...registerCategory('name', { required: 'Category name is required' })}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 bg-bg-surface border border-white/10 focus:border-brand-primary rounded-xl outline-none text-white"
                  {...registerCategory('imageUrl')}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</label>
                <textarea
                  rows="3"
                  className="w-full px-4 py-2.5 bg-bg-surface border border-white/10 focus:border-brand-primary rounded-xl outline-none text-white resize-y"
                  {...registerCategory('description')}
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-white/5">
                <button type="button" onClick={() => setShowCategoryModal(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-brand-primary to-indigo-600 hover:opacity-95 text-white font-bold rounded-xl shadow-lg transition cursor-pointer">
                  {isEditingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
