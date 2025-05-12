import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// Extend the built-in session types
declare module "next-auth" {
   interface Session extends DefaultSession {
      user: {
         id: string;
      } & DefaultSession["user"];
   }
}

export const authOptions: NextAuthOptions = {
   providers: [
      GoogleProvider({
         clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
         clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
      }),
   ],
   secret: process.env.SECRET,
   pages: {
      signIn: "/auth/signin",
   },
   callbacks: {
      async signIn({ user }) {
         if (!user.email) {
            return false;
         }
         return true;
      },
      async session({ session, token }) {
         if (session.user) {
            session.user.id = token.sub as string;
         }
         return session;
      },
      async jwt({ token, user }) {
         if (user) {
            token.id = user.id;
         }
         return token;
      },
   },
};

export default NextAuth(authOptions); 