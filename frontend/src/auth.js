import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// Auth.js (NextAuth v5) configuration.
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  trustHost: true,
  pages: {
    error: "/auth/error",
  },
});
