import { ItemReview } from '../types';

export const INITIAL_ITEM_REVIEWS: Record<string, ItemReview[]> = {
  'sharbati_phulka_5': [
    {
      id: 'rev_sp1',
      itemId: 'sharbati_phulka_5',
      userName: 'Meera Sharma',
      rating: 5,
      comment: 'Super soft, warm, and puffed on live tawa! Exactly like homemade mom’s rotis.',
      date: '12 Oct 2026',
      verifiedBuyer: true,
    },
    {
      id: 'rev_sp2',
      itemId: 'sharbati_phulka_5',
      userName: 'Rahul Kulkarni',
      rating: 5,
      comment: 'Stayed soft even 4 hours later in my office tiffinbox. Excellent quality MP Sharbati wheat.',
      date: '10 Oct 2026',
      verifiedBuyer: true,
    },
    {
      id: 'rev_sp3',
      itemId: 'sharbati_phulka_5',
      userName: 'Anish Verma',
      rating: 4,
      comment: 'Piping hot delivery and zero oil/ghee as requested. Perfect for healthy daily meals.',
      date: '08 Oct 2026',
      verifiedBuyer: true,
    },
  ],
  'desi_ghee_phulka_5': [
    {
      id: 'rev_gp1',
      itemId: 'desi_ghee_phulka_5',
      userName: 'Priya Mehta',
      rating: 5,
      comment: 'The authentic A2 Gir Cow Vedic Ghee fragrance is incredible! So soft and melt-in-mouth.',
      date: '13 Oct 2026',
      verifiedBuyer: true,
    },
    {
      id: 'rev_gp2',
      itemId: 'desi_ghee_phulka_5',
      userName: 'Siddharth Patel',
      rating: 5,
      comment: 'Generous ghee brushing and super tender texture. Ordering on daily subscription now!',
      date: '11 Oct 2026',
      verifiedBuyer: true,
    },
  ],
  'jeera_rice_350': [
    {
      id: 'rev_jr1',
      itemId: 'jeera_rice_350',
      userName: 'Vikram Joshi',
      rating: 5,
      comment: 'Fragrant basmati rice tempered with roasted cumin & pure ghee. Pairs amazingly with dal!',
      date: '14 Oct 2026',
      verifiedBuyer: true,
    },
    {
      id: 'rev_jr2',
      itemId: 'jeera_rice_350',
      userName: 'Sneha Roy',
      rating: 5,
      comment: 'Generous 350ml quantity, perfectly separated fluffy long grains.',
      date: '09 Oct 2026',
      verifiedBuyer: true,
    },
  ],
  'dal_khichdi_400': [
    {
      id: 'rev_dk1',
      itemId: 'dal_khichdi_400',
      userName: 'Amit Deshmukh',
      rating: 5,
      comment: 'Ultimate homestyle comfort food! The garlic ghee tadka makes it top tier.',
      date: '13 Oct 2026',
      verifiedBuyer: true,
    },
    {
      id: 'rev_dk2',
      itemId: 'dal_khichdi_400',
      userName: 'Neha Gupta',
      rating: 5,
      comment: 'So easy on the stomach when feeling tired. Tastes just like home.',
      date: '11 Oct 2026',
      verifiedBuyer: true,
    },
  ],
  'palak_khichdi_400': [
    {
      id: 'rev_pk1',
      itemId: 'palak_khichdi_400',
      userName: 'Dr. Kavita Menon',
      rating: 5,
      comment: 'Rich in fresh spinach puree and mild spices. Very healthy and nutritious option!',
      date: '12 Oct 2026',
      verifiedBuyer: true,
    },
  ],
  'palak_garlic_khichdi_400': [
    {
      id: 'rev_pgk1',
      itemId: 'palak_garlic_khichdi_400',
      userName: 'Rohan Naik',
      rating: 5,
      comment: 'The double lasooni garlic sizzle in cow ghee gives such rich flavor! Must try.',
      date: '14 Oct 2026',
      verifiedBuyer: true,
    },
  ],
  'high_protein_multigrain_5': [
    {
      id: 'rev_mg1',
      itemId: 'high_protein_multigrain_5',
      userName: 'Karan Shah',
      rating: 5,
      comment: 'Great fitness option with 18g protein per pack. Tastes rustic and hearty!',
      date: '10 Oct 2026',
      verifiedBuyer: true,
    },
  ],
  'steamed_basmati_rice_350': [
    {
      id: 'rev_sbr1',
      itemId: 'steamed_basmati_rice_350',
      userName: 'Pooja Iyer',
      rating: 4,
      comment: 'Fluffy steamed rice, clean and non-sticky. Perfect companion for gravy sabzi.',
      date: '08 Oct 2026',
      verifiedBuyer: true,
    },
  ],
  'vaghareli_khichdi_400': [
    {
      id: 'rev_vk1',
      itemId: 'vaghareli_khichdi_400',
      userName: 'Jignesh Patel',
      rating: 5,
      comment: 'Authentic Kathiyawadi vaghar with mustard seeds, curry leaves, and veggies. Super tasty!',
      date: '11 Oct 2026',
      verifiedBuyer: true,
    },
  ],
};

// Fallback seed generator for any item without custom reviews
export const getInitialReviewsForItem = (itemId: string): ItemReview[] => {
  if (INITIAL_ITEM_REVIEWS[itemId]) {
    return INITIAL_ITEM_REVIEWS[itemId];
  }
  return [
    {
      id: `rev_gen1_${itemId}`,
      itemId,
      userName: 'Fresh Foodie',
      rating: 5,
      comment: 'Prepared fresh to order with pure ingredients. Highly satisfied!',
      date: '10 Oct 2026',
      verifiedBuyer: true,
    },
    {
      id: `rev_gen2_${itemId}`,
      itemId,
      userName: 'Regular Subscriber',
      rating: 5,
      comment: 'Authentic homestyle preparation. Warm, hygienic, and full of flavor.',
      date: '05 Oct 2026',
      verifiedBuyer: true,
    },
  ];
};
