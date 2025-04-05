import { createSlice  } from '@reduxjs/toolkit';

const loadCartFromLocalStorage = () => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : { cartItems: [], totalQuantity: 0, totalPrice: 0 };
}

const initialState = loadCartFromLocalStorage();

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const { id, title, price, quantity, image } = action.payload;
            const existingItem = state.cartItems.find(item => item.id === id);
            if(existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.cartItems.push({ id, title, price, quantity, image })
            }
            state.totalQuantity += quantity;
            state.totalPrice += price * quantity;
            localStorage.setItem('cart', JSON.stringify(state));
        },
        removeFromCart: (state, action) => {
            const itemId = action.payload;
            const item = state.cartItems.find(item => item.id === itemId);
            if(item) {
                // state.cartItems = state.cartItems.filter(i => i.id !== itemId);
                state.totalQuantity -= item.quantity;
                state.totalPrice -= item.price * item.quantity;
            }
            state.cartItems = state.cartItems.filter(i => i.id !== itemId);
            localStorage.setItem('cart', JSON.stringify(state));
        },
        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.cartItems.find(item => item.id === id);
            if (item) {
                if (quantity > 0) {
                    state.totalQuantity += quantity - item.quantity;
                    state.totalPrice += (quantity - item.quantity) * item.price;
                    item.quantity = quantity;
                } else {
                    console.error("Quantity must be a positive integer.");
                }
            }
            localStorage.setItem('cart', JSON.stringify(state));
        },
        decreaseOne: (state, action) => {
            const itemId = action.payload;
            const item = state.cartItems.find(item => item.id === itemId);
            if(item) {
                if(item.quantity > 1) {
                    item.quantity -= 1;
                    state.totalQuantity -= 1;
                    state.totalPrice -= item.price;
                } else {
                    console.error("Quantity must be a positive integer.");
                }
            }
            localStorage.setItem('cart', JSON.stringify(state));
        },
        increaseOne: (state, action) => {
            const itemId = action.payload;
            const item = state.cartItems.find(item => item.id === itemId);
            if(item) {
                item.quantity += 1;
                state.totalQuantity += 1;
                state.totalPrice += item.price;
            }
            localStorage.setItem('cart', JSON.stringify(state));
        },
        clearCart: (state) => {
            state.cartItems = [];
            state.totalQuantity = 0;
            state.totalPrice = 0;
            localStorage.removeItem('cart');
        }
    }
})

export const { addToCart, removeFromCart, updateQuantity, decreaseOne, increaseOne, clearCart } = cartSlice.actions;
export default cartSlice.reducer;