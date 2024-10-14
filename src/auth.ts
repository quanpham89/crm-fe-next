import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { InActiveAccount, InvalidEmailPasswordError } from "./utils/errorCustomize"
import { sendRequest } from "./utils/api"
import { access } from "fs"
import { IUser } from "./types/next-auth"
import passage from "next-auth/providers/passage"
import { cookies } from "next/headers"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
        // You can specify which fields should be submitted, by adding keys to the `credentials` object.
        // e.g. domain, username, password, 2FA token, etc.
        credentials: {
          username: {},
          password: {},
        },
        authorize: async (credentials) => {
            const res = await sendRequest<IBackendRes<ILogin>>({
                method: "POST",
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`,
                body: {
                    username: credentials.username,
                    password: credentials.password
                }                
            })

            if(res.statusCode === 201){
                return {
                    _id: res.data?.user?._id,
                    name: res.data?.user?.name,
                    email: res.data?.user?.email,
                    access_token: res.data?.access_token,
                    role: res.data?.user?.role,
                    accountType: res.data?.user?.accountType,
                    restaurantId: res.data?.user?.restaurantId
                }    
            }
            // sai mat khau 401
            else if(+res.statusCode === 401 ){
                throw new InvalidEmailPasswordError()
            }else if (+res.statusCode === 400){
                throw new InActiveAccount()
            }else{
                throw new Error ("Internal server error.")
            }
            
    
            // return user object with their profile data
        },
      }),
  ],
  pages: {
    signIn : "/auth/login"
  },
  callbacks: {
    jwt({token, user}){
        if(user){
            
            token.user = (user as IUser)
        }
        return token
    },
    session ({session, token}){
        (session.user as IUser) = token.user
        return session
    }

  }
})