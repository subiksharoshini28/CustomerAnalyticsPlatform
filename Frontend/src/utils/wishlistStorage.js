const getWishlistKey = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return 'wishlist_guest';
    const payload = JSON.parse(atob(token.split('.')[1]));
    return `wishlist_${payload.nameid || payload.sub || 'user'}`;
  } catch {
    return 'wishlist_guest';
  }
};

export const getWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem(getWishlistKey())) || [];
  } catch {
    return [];
  }
};

export const setWishlist = (items) => {
  localStorage.setItem(getWishlistKey(), JSON.stringify(items));
};
