import { handlers } from "@/auth" // Referring to the auth.ts we just created
export const { GET, POST } = handlers 
secret:process.env.NEXT_AUTH_SECRET
