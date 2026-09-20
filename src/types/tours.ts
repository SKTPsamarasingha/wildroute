export type TourDifficulty = 'Easy' | 'Moderate' | 'Challenging' | 'Extreme';
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
}

export interface Tour {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  location: string;
  durationDays: number;
  difficulty: TourDifficulty;
  pricePerPerson: number;
  maxGroupSize: number;
  availableDates: string[];
  includedGear: string[];
  excludedItems?: string[];
  images: string[];
  featured?: boolean;
  rating?: number;
  reviewCount?: number;
  itinerary: ItineraryDay[];
}

export interface TourBooking {
  id: string;
  bookingNumber: string;
  tourId: string;
  tourTitle: string;
  userId?: string;
  selectedDate: string;
  guestsCount: number;
  pricePerPerson: number;
  totalAmount: number;
  leadGuest: {
    fullName: string;
    email: string;
    phone: string;
    emergencyContact?: string;
    specialRequirements?: string;
  };
  paymentMethod: 'card' | 'mintpay' | 'kokopay' | 'cod' | 'bank_transfer';
  paymentStatus: 'pending' | 'paid' | 'failed';
  bookingStatus: BookingStatus;
  createdAt: string;
}
