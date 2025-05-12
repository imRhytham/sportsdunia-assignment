import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { localStorageService } from "@/services/localStorage";
import axios from "axios";
import { showNotification } from "@mantine/notifications";

interface NewsArticle {
   article_id: string;
   title: string;
   link: string;
   keywords: string[];
   creator?: string[];
   description: string;
   content: string;
   pubDate: string;
   pubDateTZ: string;
   image_url: string;
   video_url?: string;
   source_id: string;
   source_name: string;
   source_priority: number;
   source_url: string;
   source_icon: string;
   language: string;
   country: string[];
   category: string[];
   sentiment: string;
   sentiment_stats: string;
   ai_tag: string;
   ai_region: string;
   ai_org: string;
   duplicate: boolean;
}

interface NewsApiResponse {
   status: string;
   totalResults: number;
   results: NewsArticle[];
   nextPage: string;
   authorStats: Record<string, AuthorStats>;
}

interface NewsState {
   articles: NewsArticle[];
   filteredArticles: NewsArticle[];
   loading: boolean;
   error: string | null;
   filters: {
      searchQuery: string;
      author: string;
      category: string;
   };
   authorStats: Record<string, AuthorStats>;
}

interface AuthorStats {
   count: number;
   payout: number;
}

const initialState: NewsState = {
   articles: [],
   filteredArticles: [],
   loading: false,
   error: null,
   filters: {
      searchQuery: '',
      author: '',
      category: '',
   },
   authorStats: {},
};

export const fetchNews = createAsyncThunk<NewsApiResponse, string | undefined>(
   "news/fetchNews",
   async (searchQuery?: string) => {
      try {
         const response = await axios.get<NewsApiResponse>(
            `${process.env.NEXT_PUBLIC_NEWS_API_URL}`,
            {
               params: {
                  apikey: process.env.NEXT_PUBLIC_NEWS_API_KEY,
                  language: "en",
                  country: "in",
                  ...(searchQuery && { q: searchQuery }),
               }
            })
         const data = response.data;

         // Calculate author stats
         const authorStats = data.results.reduce((acc: Record<string, AuthorStats>, article: NewsArticle) => {
            (article.creator || []).forEach((author: string) => {
               if (!acc[author]) {
                  acc[author] = { count: 0, payout: 0 };
               }
               acc[author].count++;

               // Calculate payout based on category rates
               const payoutData = localStorageService.getPayoutData();
               const categoryRate = payoutData.find(p => p.category === article.category[0])?.rate || 0;
               acc[author].payout += categoryRate;
            });
            return acc;
         }, {});

         // Update localStorage with author stats
         Object.entries(authorStats).forEach(([author, stats]) => {
            const authorStats = stats as AuthorStats;
            localStorageService.updateAuthorStats(author, authorStats.count, authorStats.payout);
         });

         return { ...data, authorStats };
      } catch (error) {
         console.error("Error fetching news:", error);
         showNotification({
            title: 'Error fetching news',
            message: 'Failed to fetch news',
            color: 'red',
         });
         throw error;
      }
   }
);

const newsSlice = createSlice({
   name: "news",
   initialState,
   reducers: {
      setArticles: (state, action) => {
         state.articles = action.payload;
         state.filteredArticles = action.payload;
      },
      setFilters: (state, action) => {
         const newFilters = { ...state.filters, ...action.payload };
         state.filters = newFilters;

         // If search query changed, don't filter here - it will trigger a new fetch
         if (action.payload.searchQuery !== undefined) {
            return;
         }

         // Apply other filters on client side
         const { category, author } = newFilters;
         state.filteredArticles = state.articles.filter((article) => {
            const matchesCategory = category
               ? article.category.includes(category)
               : true;

            const matchesAuthor = author
               ? article.creator?.includes(author)
               : true;

            return matchesCategory && matchesAuthor;
         });
      },
      resetFilters: (state) => {
         state.filters = initialState.filters;
         state.filteredArticles = state.articles;

      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(fetchNews.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(fetchNews.fulfilled, (state, action) => {
            state.loading = false;
            state.articles = action.payload.results;
            state.authorStats = action.payload.authorStats;

            // Apply current filters (except search) to new data
            const { category, author } = state.filters;
            state.filteredArticles = action.payload.results.filter((article) => {
               const matchesCategory = category
                  ? article.category.includes(category)
                  : true;

               const matchesAuthor = author
                  ? article.creator?.includes(author)
                  : true;

               return matchesCategory && matchesAuthor;
            });
         })
         .addCase(fetchNews.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "Failed to fetch news";
         });
   },
});

export const { setArticles, setFilters, resetFilters } = newsSlice.actions;
export default newsSlice.reducer; 