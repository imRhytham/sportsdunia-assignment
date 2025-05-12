import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AnalyticsData {
   pageViews: number;
   uniqueVisitors: number;
   bounceRate: number;
   averageTimeOnSite: number;
}

interface AnalyticsState {
   data: AnalyticsData | null;
   loading: boolean;
   error: string | null;
   timeRange: 'day' | 'week' | 'month' | 'year';
}

const initialState: AnalyticsState = {
   data: null,
   loading: false,
   error: null,
   timeRange: 'week',
};

const analyticsSlice = createSlice({
   name: 'analytics',
   initialState,
   reducers: {
      setAnalyticsData: (state, action: PayloadAction<AnalyticsData>) => {
         state.data = action.payload;
         state.loading = false;
         state.error = null;
      },
      setLoading: (state, action: PayloadAction<boolean>) => {
         state.loading = action.payload;
      },
      setError: (state, action: PayloadAction<string>) => {
         state.error = action.payload;
         state.loading = false;
      },
      setTimeRange: (state, action: PayloadAction<'day' | 'week' | 'month' | 'year'>) => {
         state.timeRange = action.payload;
      },
   },
});

export const { setAnalyticsData, setLoading, setError, setTimeRange } = analyticsSlice.actions;
export default analyticsSlice.reducer; 