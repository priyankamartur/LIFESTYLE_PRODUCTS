import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ArrowLeft, Save } from 'lucide-react';
import apiService from '../../services/apiService';

export default function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const loadInitData = async () => {
      try {
        const [catsRes, productRes] = await Promise.all([
          apiService.categories.getAll(),
          apiService.products.getById(id)
        ]);
        setCategories(catsRes.content || catsRes || []);
        
        // Pre-fill form values
        setValue('name', productRes.name);
        setValue('price', productRes.price);
        setValue('stockQuantity', productRes.stockQuantity ?? 100);
        setValue('categoryId', productRes.categoryId || '');
        setValue('imageUrl', productRes.imageUrl || '');
        setValue('description', productRes.description || '');
        setValue('featured', productRes.featured || false);
      } catch (err) {
        toast.error('Failed to load product details.');
        navigate('/admin/products');
      } finally {
        setLoading(false);
      }
    };
    loadInitData();
  }, [id, setValue, navigate]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const payload = {
        name: data.name,
        price: parseFloat(data.price),
        stockQuantity: parseInt(data.stockQuantity || 100, 10),
        description: data.description,
        categoryId: parseInt(data.categoryId),
        imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60',
        featured: data.featured
      };
      await apiService.admin.updateProduct(id, payload);
      toast.success('Product updated successfully!');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.message || 'Failed to update product.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-3 border-gray-700 border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-8 animate-fadeIn text-gray-100">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/products')}
          className="p-2.5 bg-gray-900 border border-gray-800 hover:bg-gray-850 hover:border-gray-700 text-gray-300 hover:text-white rounded-xl transition cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Edit Catalog Item</h1>
          <p className="text-gray-400 text-sm">Update product metadata and pricing</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Product Title
              </label>
              <input
                type="text"
                placeholder="Product Name"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl outline-none text-white text-sm transition focus:border-amber-500"
                disabled={submitting}
                {...register('name', { required: 'Product title is required' })}
              />
              {errors.name && (
                <span className="text-xs font-medium text-rose-500">{errors.name.message}</span>
              )}
            </div>

            {/* Price */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Retail Price (₹)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl outline-none text-white text-sm transition focus:border-amber-500"
                disabled={submitting}
                {...register('price', { required: 'Retail price is required', min: { value: 0.01, message: 'Price must be greater than 0' } })}
              />
              {errors.price && (
                <span className="text-xs font-medium text-rose-500">{errors.price.message}</span>
              )}
            </div>

            {/* Stock Quantity */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Stock Quantity
              </label>
              <input
                type="number"
                placeholder="100"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl outline-none text-white text-sm transition focus:border-amber-500"
                disabled={submitting}
                {...register('stockQuantity', { required: 'Stock quantity is required', min: { value: 0, message: 'Stock cannot be negative' } })}
              />
              {errors.stockQuantity && (
                <span className="text-xs font-medium text-rose-500">{errors.stockQuantity.message}</span>
              )}
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Category
              </label>
              <select
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl outline-none text-white text-sm transition focus:border-amber-500"
                disabled={submitting}
                {...register('categoryId', { required: 'Category is required' })}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <span className="text-xs font-medium text-rose-500">{errors.categoryId.message}</span>
              )}
            </div>

            {/* Image URL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Image URL
              </label>
              <input
                type="text"
                placeholder="https://..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl outline-none text-white text-sm transition focus:border-amber-500"
                disabled={submitting}
                {...register('imageUrl')}
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Product Description
            </label>
            <textarea
              rows="4"
              placeholder="Provide a detailed description..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl outline-none text-white text-sm transition focus:border-amber-500 resize-none"
              disabled={submitting}
              {...register('description')}
            />
          </div>

          {/* Featured */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featured"
              className="w-4 h-4 rounded bg-gray-800 border-gray-700 text-amber-500 focus:ring-amber-500"
              disabled={submitting}
              {...register('featured')}
            />
            <label htmlFor="featured" className="text-sm font-semibold text-gray-300 cursor-pointer">
              Feature this product on homepage catalog
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-750 text-gray-300 font-bold rounded-xl text-sm transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold rounded-xl text-sm transition cursor-pointer disabled:opacity-50"
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
