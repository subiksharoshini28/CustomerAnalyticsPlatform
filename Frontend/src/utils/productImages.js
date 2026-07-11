const PLACEHOLDER = '/images/product-placeholder.svg';

const productImageMap = {
  1: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
  2: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
  3: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
  4: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
  5: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=400&fit=crop',
  6: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop',
  7: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
  8: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop',
  9: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
  10: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=400&h=400&fit=crop',
  11: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop',
  12: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=400&fit=crop',
  13: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop',
  14: 'https://images.unsplash.com/photo-1534073737927-85f1ebff1f5d?w=400&h=400&fit=crop',
  15: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop',
  16: 'https://images.unsplash.com/photo-1697649272441-be6e4a563e9b?w=400&h=400&fit=crop',
  17: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
  18: 'https://images.unsplash.com/photo-1654600870472-7c4afe2f70e1?w=400&h=400&fit=crop',
  19: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=400&fit=crop',
  20: 'https://images.unsplash.com/photo-1550851405-a82adf80b299?w=400&h=400&fit=crop',
  21: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop',
  22: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
  23: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&h=400&fit=crop',
  24: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=400&h=400&fit=crop',
};

export function getProductImage(productId, backendUrl) {
  return productImageMap[productId] || backendUrl || PLACEHOLDER;
}

export function handleImageError(e, productId) {
  e.currentTarget.onerror = null;
  e.currentTarget.src = PLACEHOLDER;
}

export default productImageMap;
