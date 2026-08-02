export interface Frame {
  id: string;
  title: string;
  material: 'Wood' | 'Metal' | 'Acrylic';
  color: 'White' | 'Black' | 'Gold' | 'Walnut';
  style: 'Modern' | 'Ornate' | 'Minimalist';
  availableSizes: string[];
  priceRange: string;
  thumbnailId: string;
  images: string[];
  description: string;
  isSoldOut?: boolean; // <-- Add this line
}
export const FRAMES_DATA: Frame[] = [
  {
    id: 'f1',
    title: 'White Picture Frame (12x10)',
    material: 'Wood',
    color: 'White',
    style: 'Minimalist',
    availableSizes: ['12x10"'],
    priceRange: '₹350 - ₹600',
    thumbnailId: 'White_Frame_12x10_cppmjn',
    images: [
      'White_Frame_12x10_cppmjn', // Main graphic view
      'WF2_duk3t0',               // Front view in packaging
      'WF1_ljaliu',               // Back view with hooks
      'WF3_nuibca',               // Side profile view
    ],
    description: 'Sleek white picture frame with clean lines, wall-mounting hardware, and bold border.',
  },
];
