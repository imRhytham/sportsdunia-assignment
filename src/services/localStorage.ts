interface PayoutData {
   category: string;
   rate: number;
}

interface AuthorData {
   name: string;
   articles: number;
   totalPayout: number;
}

const STORAGE_KEYS = {
   PAYOUT_DATA: "payout_data",
   AUTHOR_DATA: "author_data",
};

export const localStorageService = {
   // Payout Data Methods
   getPayoutData: (): PayoutData[] => {
      if (typeof window === "undefined") return [];
      const data = localStorage.getItem(STORAGE_KEYS.PAYOUT_DATA);
      return data ? JSON.parse(data) : [];
   },

   setPayoutData: (data: PayoutData[]) => {
      if (typeof window === "undefined") return;
      localStorage.setItem(STORAGE_KEYS.PAYOUT_DATA, JSON.stringify(data));
   },

   updatePayoutRate: (category: string, rate: number) => {
      const data = localStorageService.getPayoutData();
      const index = data.findIndex((item) => item.category === category);

      if (index !== -1) {
         data[index].rate = rate;
      } else {
         data.push({ category, rate });
      }

      localStorageService.setPayoutData(data);
   },

   // Author Data Methods
   getAuthorData: (): AuthorData[] => {
      if (typeof window === "undefined") return [];
      const data = localStorage.getItem(STORAGE_KEYS.AUTHOR_DATA);
      return data ? JSON.parse(data) : [];
   },

   setAuthorData: (data: AuthorData[]) => {
      if (typeof window === "undefined") return;
      localStorage.setItem(STORAGE_KEYS.AUTHOR_DATA, JSON.stringify(data));
   },

   updateAuthorStats: (author: string, articleCount: number, payout: number) => {
      const data = localStorageService.getAuthorData();
      const index = data.findIndex((item) => item.name === author);

      if (index !== -1) {
         data[index].articles = articleCount;
         data[index].totalPayout = payout;
      } else {
         data.push({ name: author, articles: articleCount, totalPayout: payout });
      }

      localStorageService.setAuthorData(data);
   },

   // Clear Methods
   clearPayoutData: () => {
      if (typeof window === "undefined") return;
      localStorage.removeItem(STORAGE_KEYS.PAYOUT_DATA);
   },

   clearAuthorData: () => {
      if (typeof window === "undefined") return;
      localStorage.removeItem(STORAGE_KEYS.AUTHOR_DATA);
   },

   clearAll: () => {
      localStorageService.clearPayoutData();
      localStorageService.clearAuthorData();
   },
}; 