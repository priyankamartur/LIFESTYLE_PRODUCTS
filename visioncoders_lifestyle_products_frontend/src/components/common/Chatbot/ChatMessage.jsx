import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Bot, User, ShoppingBag, ArrowRight, Check } from 'lucide-react';
import { CartContext } from '../../../context/CartContext';
import { getProductImg } from '../../../services/imageHelper';
import { toast } from 'react-toastify';

export default function ChatMessage({ message }) {
  const { isUser, text, products, timestamp } = message;
  const { addToCart } = useContext(CartContext);
  const [addedItems, setAddedItems] = React.useState({});

  const formattedTime = new Date(timestamp || Date.now()).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product.id, 1);
      setAddedItems((prev) => ({ ...prev, [product.id]: true }));
      toast.success(`Added ${product.name} to your cart!`);
      setTimeout(() => {
        setAddedItems((prev) => ({ ...prev, [product.id]: false }));
      }, 2000);
    } catch (err) {
      toast.error('Please log in to add items to your cart');
    }
  };

  // Helper to format text with simple line breaks and markdown bold
  const renderFormattedText = (rawText) => {
    if (!rawText) return null;
    const lines = rawText.split('\n');
    return lines.map((line, idx) => {
      // Bold replacement for **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      return (
        <span key={idx} className="block min-h-[1.2rem]">
          {formattedParts}
        </span>
      );
    });
  };

  return (
    <div className={`flex gap-3 my-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start animate-fade-in`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold shadow-md ${
          isUser
            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
            : 'bg-gradient-to-br from-amber-400 via-rose-500 to-purple-600 text-white ring-2 ring-purple-400/30'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4.5 h-4.5" />}
      </div>

      {/* Bubble Content */}
      <div className={`max-w-[85%] sm:max-w-[78%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
            isUser
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none'
              : 'bg-slate-800/90 border border-slate-700/60 text-slate-200 rounded-tl-none backdrop-blur-sm'
          }`}
        >
          {renderFormattedText(text)}
        </div>

        {/* Product Cards Grid if Bot returned recommendations */}
        {!isUser && products && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3 w-full">
            {products.map((product) => {
              const imgUrl = getProductImg(product.name, product.imageUrl);
              const isAdded = addedItems[product.id];

              return (
                <div
                  key={product.id}
                  className="bg-slate-900/90 border border-slate-700/80 rounded-xl overflow-hidden shadow-md flex flex-col hover:border-purple-500/50 transition-all duration-200 group"
                >
                  <div className="relative h-28 w-full overflow-hidden bg-slate-950">
                    <img
                      src={imgUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.categoryName && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium bg-slate-950/80 text-purple-300 rounded-full border border-purple-500/30 backdrop-blur-md">
                        {product.categoryName}
                      </span>
                    )}
                  </div>

                  <div className="p-2.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-100 line-clamp-1 group-hover:text-purple-300 transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-xs font-bold text-amber-400 mt-1">
                        ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                      </p>
                    </div>

                    <div className="flex gap-1.5 mt-2 pt-2 border-t border-slate-800">
                      <Link
                        to={`/products/${product.id}`}
                        className="flex-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
                      >
                        View <ArrowRight className="w-3 h-3" />
                      </Link>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`px-2 py-1 rounded-lg text-[11px] font-medium flex items-center justify-center gap-1 transition-all ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3 h-3" /> Added
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3 h-3" /> Add
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <span className="text-[10px] text-slate-500 mt-1 px-1">{formattedTime}</span>
      </div>
    </div>
  );
}
