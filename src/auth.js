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
          return {
            id: "mock-user-1",
            name: "Admin User",
            email: MOCK_EMAIL,
          };
        }

        // Fallback: Try database authentication
        try {
          const { getDb } = await import("@/lib/db");
          const bcrypt = (await import("bcryptjs")).default;

          const db = await getDb();
          const user = await db.collection("users").findOne({ email: credentials.email });

          if (!user) {
            throw new Error("Invalid credentials");
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            throw new Error("Invalid credentials");
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email
          };

        } catch (e) {
          console.error("Auth Error:", e.message);
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
