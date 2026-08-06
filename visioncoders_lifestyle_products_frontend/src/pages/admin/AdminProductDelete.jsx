import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import apiService from '../../services/apiService';

export default function AdminProductDelete() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await apiService.products.getById(id);
        setProduct(res);
      } catch (err) {
        toast.error('Failed to load product details.');
        navigate('/admin/products');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id, navigate]);

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await apiService.admin.deleteProduct(id);
      toast.success('Product deleted successfully.');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.message || 'Failed to delete product.');
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
    <div className="max-w-xl mx-auto space-y-8 animate-fadeIn text-gray-100 py-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/products')}
          className="p-2.5 bg-gray-900 border border-gray-800 hover:bg-gray-850 hover:border-gray-700 text-gray-300 hover:text-white rounded-xl transition cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Archive Item</h1>
          <p className="text-gray-400 text-sm">Remove product from active sales lists</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-lg text-center space-y-6">
        <div className="w-16 h-16 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <AlertTriangle size={32} />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">Are you absolutely sure?</h2>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">
            You are about to delete <span className="text-white font-semibold">"{product?.name}"</span> from the catalog. This action cannot be undone.
          </p>
        </div>

        {/* Product Card Details */}
        {product && (
          <div className="flex items-center gap-4 bg-gray-950 border border-gray-800/80 p-4 rounded-2xl text-left">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-12 h-12 object-cover rounded-lg border border-gray-800"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60';
              }}
            />
            <div>
              <div className="text-sm font-semibold text-white">{product.name}</div>
              <div className="text-xs text-gray-500">Retail Price: ${parseFloat(product.price || 0).toFixed(2)}</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-center pt-4 border-t border-gray-800">
          <button
            type="button"
            disabled={submitting}
            onClick={() => navigate('/admin/products')}
            className="px-6 py-3.5 bg-gray-800 hover:bg-gray-750 text-gray-300 font-bold rounded-xl text-sm transition cursor-pointer"
          >
            No, Cancel
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={handleDelete}
            className="px-6 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-sm transition cursor-pointer"
          >
            {submitting ? 'Archiving...' : 'Yes, Delete Item'}
          </button>
        </div>
      </div>
    </div>
  );
}
