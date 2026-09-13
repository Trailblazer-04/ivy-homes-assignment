export const propertyImages = [
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85'
];

export const propertyCaptions = [
  'Light that lingers.',
  'Room for the everyday.',
  'A quieter kind of luxury.',
  'Made for your next chapter.',
  'Details worth coming home to.'
];

export function getPropertyImage(listingId = '') {
  const hash = [...listingId].reduce((total, character) => total + character.charCodeAt(0), 0);
  return propertyImages[hash % propertyImages.length];
}
