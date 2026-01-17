import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // Primary: Mock login with hardcoded credentials
        const MOCK_EMAIL = process.env.MOCK_EMAIL || "admin@store.io";
        const MOCK_PASSWORD = process.env.MOCK_PASSWORD || "admin123";

        // Check hardcoded credentials first
        if (credentials.email === MOCK_EMAIL && credentials.password === MOCK_PASSWORD) {
          // Store mock user in database if not exists
          try {
            await fetch("http://localhost:4000/save-oauth-user", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: "Admin User",
                email: MOCK_EMAIL,
                provider: "mock",
              }),
            });
          } catch (error) {
            console.error("Error saving mock user:", error);
          }

          return {
            id: "mock-user-1",
            name: "Admin User",
            email: MOCK_EMAIL,
          };
        }

        // Fallback: Try database authentication
        try {
          console.log("Attempting login via backend:", "http://localhost:4000/login");
          const res = await fetch("http://localhost:4000/login", {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          });

          if (!res.ok) {
            const errorText = await res.text();
            console.error("Backend login failed:", res.status, errorText);
            throw new Error(`Backend Error: ${res.status}`);
          }

          const user = await res.json();

          // If no error and we have user data, return it
          if (user) {
            return user;
          }
          return null;
        } catch (e) {
          console.error("Authorize Error:", e.message);
          // If connection refused, it means backend is down
          if (e.message.includes("fetch failed") || e.message.includes("ECONNREFUSED")) {
            throw new Error("Backend server unreachable. Make sure 'node server/server.js' is running.");
          }
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Save Google OAuth users to database directly
      if (account?.provider === "google") {
        try {
          const { getDb } = await import("@/lib/db");
          const db = await getDb();

          const existingUser = await db.collection("users").findOne({ email: user.email });

          if (!existingUser) {
            await db.collection("users").insertOne({
              name: user.name,
              email: user.email,
              image: user.image,
              provider: "google",
              createdAt: new Date()
            });
            console.log("New Google user saved");
          }
        } catch (error) {
          console.error("Error saving Google user:", error);
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login
      return !!auth;
    },
  },
});
