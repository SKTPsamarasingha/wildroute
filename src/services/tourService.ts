import { Tour } from '@/types/tours';
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const INITIAL_TOURS: Tour[] = [
  {
    id: 'tour-knuckles-01',
    title: 'Knuckles Cloud Forest Peak Expedition',
    slug: 'knuckles-cloud-forest-expedition',
    tagline: 'Immerse into UNESCO World Heritage cloud forests, pristine waterfalls, and misty peaks.',
    description: 'A thrilling 3-day guided wilderness trek through the core conservation zone of the Knuckles Mountain Range. Hike along ridge lines, camp under starry mountain skies, and explore hidden cloud forest waterfalls with expert wilderness guides.',
    location: 'Knuckles Conservation Forest, Matale / Kandy',
    durationDays: 3,
    difficulty: 'Challenging',
    pricePerPerson: 42500,
    maxGroupSize: 12,
    availableDates: ['2026-10-05', '2026-10-19', '2026-11-02'],
    includedGear: [
      '3-Season Expedition Tent & Sleeping Pad',
      'All Gourmet Trail Meals & Pure Springs Water',
      'Wilderness First-Responder Support',
      'Forest Department Permits & Entrance Fees',
    ],
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    ],
    featured: true,
    rating: 4.95,
    reviewCount: 48,
    itinerary: [
      {
        day: 1,
        title: 'Basecamp Trek & Dean’s World’s End',
        description: 'Ascend through tea estates into misty pine ridges. Pitch camp near river stream.',
        activities: ['Ascend 800m elevation', 'Sunset photography', 'Campfire dinner'],
      },
    ],
  },
];

export const getTours = async (): Promise<Tour[]> => {
  try {
    const colRef = collection(db, 'tours');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Tour));
    }
  } catch (err) {
    console.error('⚠️ [Firestore Tour Fetch Error]:', err);
  }
  return INITIAL_TOURS;
};

export const getTourById = async (id: string): Promise<Tour | null> => {
  try {
    const docRef = doc(db, 'tours', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as Tour;
    }
  } catch (err) {
    console.error('⚠️ [Firestore Tour Lookup Error]:', err);
  }
  return INITIAL_TOURS.find((t) => t.id === id) || null;
};

export const saveTour = async (tourData: Partial<Tour>): Promise<Tour> => {
  const newId = tourData.id || `tour-${Date.now()}`;
  const fullTour: Tour = {
    id: newId,
    title: tourData.title || 'New Guided Expedition',
    slug: tourData.slug || 'new-expedition',
    tagline: tourData.tagline || 'Experience the wild like never before.',
    description: tourData.description || '',
    location: tourData.location || 'Sri Lanka Central Highlands',
    durationDays: tourData.durationDays || 2,
    difficulty: tourData.difficulty || 'Moderate',
    pricePerPerson: tourData.pricePerPerson || 25000,
    maxGroupSize: tourData.maxGroupSize || 12,
    availableDates: tourData.availableDates || ['2026-10-15', '2026-10-30'],
    includedGear: tourData.includedGear || ['Tents & Sleeping Bags', 'All Meals', 'First Aid'],
    images: tourData.images || ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'],
    featured: tourData.featured || false,
    rating: tourData.rating || 5.0,
    reviewCount: tourData.reviewCount || 1,
    itinerary: tourData.itinerary || [
      { day: 1, title: 'Basecamp Arrival', description: 'Trek to basecamp', activities: ['Hiking', 'Camping'] },
    ],
  };

  try {
    const docRef = doc(db, 'tours', newId);
    const cleanedTour = Object.fromEntries(
      Object.entries(fullTour).filter(([_, v]) => v !== undefined)
    );
    await setDoc(docRef, cleanedTour, { merge: true });
  } catch (err) {
    console.error('❌ [Firestore Tour Save Error]:', err);
    throw err;
  }

  return fullTour;
};

export const deleteTour = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'tours', id));
  } catch (err) {
    console.error('❌ [Firestore Tour Delete Error]:', err);
    throw err;
  }
};
