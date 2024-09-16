import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { InActiveAccount, InvalidEmailPasswordError } from "./utils/errorCustomize"
import { sendRequest } from "./utils/api"
import { access } from "fs"
import { IUser } from "./types/next-auth"

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
            const res = await sendRequest<IBackendRes<ILogin>>({
                method: "POST",
                url: "http://localhost:8080/api/v1/auth/login",
                body: {
                    ...credentials
                }                
            })

            if(!res.statusCode ){
                console.log("res", res)
                return {
                    _id: res.data?.user?._id,
                    name: res.data?.user?.name,
                    email: res.data?.user?.email,
                    access_token: res.data?.access_token,
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