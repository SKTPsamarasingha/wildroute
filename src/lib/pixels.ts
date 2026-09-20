declare global {
  interface Window {
    fbq?: any;
    ttq?: any;
  }
}

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1234567890';
export const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || 'C1234567890';

// Trigger PageView across pixels
export const trackPageView = () => {
  if (typeof window !== 'undefined') {
    if (window.fbq) window.fbq('track', 'PageView');
    if (window.ttq) window.ttq.page();
  }
};

// Trigger AddToCart event
export const trackAddToCart = (productId: string, name: string, price: number, quantity: number = 1) => {
  if (typeof window !== 'undefined') {
    if (window.fbq) {
      window.fbq('track', 'AddToCart', {
        content_ids: [productId],
        content_name: name,
        value: price * quantity,
        currency: 'LKR',
      });
    }
    if (window.ttq) {
      window.ttq.track('AddToCart', {
        content_id: productId,
        content_name: name,
        value: price * quantity,
        currency: 'LKR',
        quantity,
      });
    }
  }
};

// Trigger InitiateCheckout event
export const trackInitiateCheckout = (totalValue: number, itemNum: number) => {
  if (typeof window !== 'undefined') {
    if (window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        value: totalValue,
        currency: 'LKR',
        num_items: itemNum,
      });
    }
    if (window.ttq) {
      window.ttq.track('InitiateCheckout', {
        value: totalValue,
        currency: 'LKR',
        quantity: itemNum,
      });
    }
  }
};

// Trigger Purchase / Order Complete event
export const trackPurchase = (orderId: string, totalValue: number, itemNum: number) => {
  if (typeof window !== 'undefined') {
    if (window.fbq) {
      window.fbq('track', 'Purchase', {
        content_type: 'product',
        value: totalValue,
        currency: 'LKR',
        order_id: orderId,
        num_items: itemNum,
      });
    }
    if (window.ttq) {
      window.ttq.track('CompletePayment', {
        content_id: orderId,
        value: totalValue,
        currency: 'LKR',
        quantity: itemNum,
      });
    }
  }
};
