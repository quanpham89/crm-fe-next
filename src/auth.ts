import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
        // You can specify which fields should be submitted, by adding keys to the `credentials` object.
        // e.g. domain, username, password, 2FA token, etc.
        credentials: {
          email: {},
          password: {},
        },
        authorize: async (credentials) => {
            let user = null
                // back end service
            user = {
                _id: "123",
                username: "123",
                email: "admin@gmail.com",
                isVerify: true,
                type: "123",
                role: "1",
            }
            if (!user) {
                // No user found, so this is their first attempt to login
                // meaning this is also the place you could do registration
                throw new Error("User not found.")
            }
    
            // return user object with their profile data
            return user
        },
      }),
  ],
  pages: {
    signIn : "/auth/login"
  }
})