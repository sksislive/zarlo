import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  product: string; // product ID
  name: string;
  price: number;
  image: string;
  qty: number;
  shippingCharges: number;
}

interface CartState {
  cartItems: CartItem[];
  shippingAddress: any;
  paymentMethod: string;
}

const initialState: CartState = {
  cartItems: [],
  shippingAddress: {},
  paymentMethod: 'Razorpay',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.product === item.product);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.product === existItem.product ? item : x
        );
      } else {
        state.cartItems.push(item);
      }
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.cartItems = state.cartItems.filter((x) => x.product !== action.payload);
    },
    saveShippingAddress(state, action: PayloadAction<any>) {
      state.shippingAddress = action.payload;
    },
    savePaymentMethod(state, action: PayloadAction<string>) {
      state.paymentMethod = action.payload;
    },
    updateQty(state, action: PayloadAction<{ product: string; qty: number }>) {
      const item = state.cartItems.find((x) => x.product === action.payload.product);
      if (item) {
        item.qty = action.payload.qty;
      }
    },
    clearCart(state) {
      state.cartItems = [];
    }
  },
});

export const { addToCart, removeFromCart, saveShippingAddress, savePaymentMethod, updateQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
