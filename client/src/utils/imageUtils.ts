// Image URL utility functions

// Get the base URL for the backend API
export const getBackendUrl = () => {
  return process.env.NODE_ENV === 'production' 
    ? 'https://your-production-domain.com' 
    : 'http://localhost:5000';
};

// Convert image URL to full URL
export const getImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) {
    return 'https://images.unsplash.com/photo-1565299624946-b28f40a9ae91?w=400';
  }
  
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it's a relative path starting with /uploads/, prepend backend URL
  if (imageUrl.startsWith('/uploads/')) {
    return `${getBackendUrl()}${imageUrl}`;
  }
  
  // Otherwise, treat it as a full URL or return default
  return imageUrl || 'https://images.unsplash.com/photo-1565299624946-b28f40a9ae91?w=400';
};

// Check if image URL is valid
export const isValidImageUrl = (url: string): boolean => {
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/uploads/');
};

// Handle image error with fallback
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
  const target = event.target as HTMLImageElement;
  target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a9ae91?w=400';
};
