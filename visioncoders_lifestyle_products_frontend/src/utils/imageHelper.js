// Image Helper to replace broken placeholder URLs with stunning high-resolution Unsplash photos.

const fallbackImages = {
  categories: {
    'apparel': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=60',
    'footwear': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=60',
    'accessories': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60',
    'home decor': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=60',
    'default': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=60'
  },
  products: {
    'denim jacket': 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=60',
    'cotton t-shirt': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=60',
    'running shoes': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60',
    'sneakers': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=60',
    'wallet': 'https://images.unsplash.com/photo-1627124765135-56c33fc36eab?w=600&auto=format&fit=crop&q=60',
    'watch': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60',
    'lamp': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=60',
    'rug': 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=600&auto=format&fit=crop&q=60',
    'default': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60'
  },
  banners: [
    'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1600&auto=format&fit=crop&q=80'
  ]
};

export const getCategoryImg = (name) => {
  if (!name) return fallbackImages.categories.default;
  const key = name.toLowerCase();
  for (const k of Object.keys(fallbackImages.categories)) {
    if (key.includes(k)) return fallbackImages.categories[k];
  }
  return fallbackImages.categories.default;
};

export const getProductImg = (name, dbUrl) => {
  if (dbUrl && !dbUrl.includes('example.com')) return dbUrl;
  
  if (!name) return fallbackImages.products.default;
  const key = name.toLowerCase();
  for (const k of Object.keys(fallbackImages.products)) {
    if (key.includes(k)) return fallbackImages.products[k];
  }
  return fallbackImages.products.default;
};

export const getBannerImg = (index) => {
  return fallbackImages.banners[index % fallbackImages.banners.length];
};
