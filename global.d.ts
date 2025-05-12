declare global {
   namespace NodeJS {
      interface ProcessEnv {
         NEXT_PUBLIC_APP_URL: string;
         NEXT_PUBLIC_DOMAINS: string;
         NEXT_PUBLIC_GOOGLE_CLIENT_ID: string;
         NEXT_PUBLIC_GOOGLE_CLIENT_SECRET: string;
         NEXT_PUBLIC_NEWS_API_URL: string;
         NEXT_PUBLIC_NEWS_API_KEY: string;
         SECRET: string;
      }
   }
}

export { };
