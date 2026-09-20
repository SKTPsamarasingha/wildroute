import { Order, OrderStatus } from "@/types/ecommerce";
import { TourBooking, BookingStatus } from "@/types/tours";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { trackPurchase } from "@/lib/pixels";

const removeUndefinedValues = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(removeUndefinedValues);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, nestedValue]) => nestedValue !== undefined)
        .map(([key, nestedValue]) => [key, removeUndefinedValues(nestedValue)]),
    );
  }

  return value;
};

export const createOrder = async (
  orderData: Omit<Order, "id" | "orderNumber" | "createdAt">,
): Promise<Order> => {
  const id = `ord-${Date.now()}`;
  const orderNumber = `WR-${Math.floor(10000 + Math.random() * 90000)}`;
  const fullOrder: Order = {
    ...orderData,
    id,
    orderNumber,
    createdAt: new Date().toISOString(),
  };

  try {
    const docRef = doc(db, "orders", id);
    const cleanedOrder = removeUndefinedValues(fullOrder);
    await setDoc(docRef, cleanedOrder);
  } catch (err) {
    console.error(
      "❌ [Firestore Order Error]: Failed to save order to database.",
      err,
    );
    throw err;
  }

  trackPurchase(id, fullOrder.total, fullOrder.items.length);
  return fullOrder;
};

export const getOrders = async (
  userId?: string,
  userEmail?: string,
): Promise<Order[]> => {
  try {
    const colRef = collection(db, "orders");
    let q = colRef;

    if (userId) {
      // Query orders for specific logged in user
      const qUser = query(colRef, where("userId", "==", userId));
      const snap = await getDocs(qUser);
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order);
      }
    }

    if (userEmail) {
      const qEmail = query(colRef, where("customer.email", "==", userEmail));
      const snapEmail = await getDocs(qEmail);
      if (!snapEmail.empty) {
        return snapEmail.docs.map((d) => ({ id: d.id, ...d.data() }) as Order);
      }
    }

    // Otherwise fetch all orders (for Admin/Staff)
    const snapAll = await getDocs(colRef);
    if (!snapAll.empty) {
      return snapAll.docs.map((d) => ({ id: d.id, ...d.data() }) as Order);
    }
  } catch (err) {
    console.error("⚠️ [Firestore Orders Fetch Error]:", err);
  }
  return [];
};

export const getOrderById = async (id: string): Promise<Order | null> => {
  try {
    const snap = await getDoc(doc(db, "orders", id));
    if (snap.exists()) return { id: snap.id, ...snap.data() } as Order;
  } catch (err) {
    console.error("⚠️ [Firestore Order Lookup Error]:", err);
  }
  return null;
};

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus,
  notes?: string,
): Promise<void> => {
  try {
    const docRef = doc(db, "orders", orderId);
    await updateDoc(docRef, {
      orderStatus: status,
      fulfillmentNotes: notes || "",
    });
  } catch (err) {
    console.error("❌ [Firestore Order Status Error]:", err);
    throw err;
  }
};

export const createTourBooking = async (
  bookingData: Omit<TourBooking, "id" | "bookingNumber" | "createdAt">,
): Promise<TourBooking> => {
  const id = `tb-${Date.now()}`;
  const bookingNumber = `TB-${Math.floor(10000 + Math.random() * 90000)}`;
  const fullBooking: TourBooking = {
    ...bookingData,
    id,
    bookingNumber,
    createdAt: new Date().toISOString(),
  };

  try {
    const docRef = doc(db, "bookings", id);
    const cleanedBooking = Object.fromEntries(
      Object.entries(fullBooking).filter(([_, v]) => v !== undefined),
    );
    await setDoc(docRef, cleanedBooking);
  } catch (err) {
    console.error(
      "❌ [Firestore Booking Error]: Failed to save booking to database.",
      err,
    );
    throw err;
  }

  return fullBooking;
};

export const getTourBookings = async (
  userId?: string,
  userEmail?: string,
): Promise<TourBooking[]> => {
  try {
    const colRef = collection(db, "bookings");

    if (userId) {
      const qUser = query(colRef, where("userId", "==", userId));
      const snap = await getDocs(qUser);
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as TourBooking);
      }
    }

    if (userEmail) {
      const qEmail = query(colRef, where("leadGuest.email", "==", userEmail));
      const snapEmail = await getDocs(qEmail);
      if (!snapEmail.empty) {
        return snapEmail.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as TourBooking,
        );
      }
    }

    const snapAll = await getDocs(colRef);
    if (!snapAll.empty) {
      return snapAll.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as TourBooking,
      );
    }
  } catch (err) {
    console.error("⚠️ [Firestore Bookings Fetch Error]:", err);
  }
  return [];
};

export const updateBookingStatus = async (
  bookingId: string,
  status: BookingStatus,
): Promise<void> => {
  try {
    const docRef = doc(db, "bookings", bookingId);
    await updateDoc(docRef, { bookingStatus: status });
  } catch (err) {
    console.error("❌ [Firestore Booking Status Error]:", err);
    throw err;
  }
};
