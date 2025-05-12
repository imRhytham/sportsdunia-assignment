import { showNotification } from '@mantine/notifications';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PayoutRate {
   author: string;
   rate: number;
}

interface PayoutState {
   rates: PayoutRate[];
}

// Load initial state from localStorage
const loadState = (): PayoutState => {
   if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('payoutRates');
      return savedState ? JSON.parse(savedState) : { rates: [] };
   }
   return { rates: [] };
};

const initialState: PayoutState = loadState();

const payoutSlice = createSlice({
   name: 'payout',
   initialState,
   reducers: {
      setPayoutRate: (state, action: PayloadAction<PayoutRate>) => {
         const index = state.rates.findIndex(rate => rate.author === action.payload.author);
         if (index !== -1) {
            state.rates[index] = action.payload;
         } else {
            state.rates.push(action.payload);
         }
         // Save to localStorage
         localStorage.setItem('payoutRates', JSON.stringify(state));
         showNotification({
            title: 'Payout rate updated',
            message: 'Payout rate updated successfully',
            color: 'green',
         });
      },
      removePayoutRate: (state, action: PayloadAction<string>) => {
         state.rates = state.rates.filter(rate => rate.author !== action.payload);
         // Save to localStorage
         localStorage.setItem('payoutRates', JSON.stringify(state));
         showNotification({
            title: 'Payout rate removed',
            message: 'Payout rate removed successfully',
            color: 'red',
         });
      },
   },
});

export const { setPayoutRate, removePayoutRate } = payoutSlice.actions;
export default payoutSlice.reducer; 