import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { InActiveAccount, InvalidEmailPasswordError } from "./utils/errorCustomize"
import { sendRequest } from "./utils/api"
import { IUser } from "./types/next-auth"

const getJwtExpireTime = (token?: string) => {
    if(!token) return 0
    try {
        const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
        const paddedBase64 = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, "=")
        const payload = JSON.parse(atob(paddedBase64))
        return payload.exp ? payload.exp * 1000 : 0
    } catch (error) {
        return 0
    }
}

const refreshAccessToken = async (token: any) => {
    try {
        const res = await sendRequest<IBackendRes<{
            access_token: string;
            refresh_token: string;
        }>>({
            method: "POST",
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/refresh-token`,
            body: {
                refreshToken: token.user?.refresh_token
            }
        })

        if(+res.statusCode !== 201 || !res.data?.access_token){
            throw new Error("Refresh token invalid")
        }


        return {
            ...token,
            user: {
                ...token.user,
                access_token: res.data.access_token,
                refresh_token: res.data.refresh_token,
                access_expire: getJwtExpireTime(res.data.access_token)
            },
            error: undefined
        }
    } catch (error) {
        return {
            ...token,
            error: "RefreshAccessTokenError"
        }
    }
}

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
                    refresh_token: res.data?.refresh_token,
                    access_expire: getJwtExpireTime(res.data?.access_token),
                    role: res.data?.user?.role,
                    accountType: res.data?.user?.accountType,
                    restaurantId: res.data?.user?.restaurantId,
                    isActive: res.data?.user?.isActive
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
    async jwt({token, user}){
        if(user){
            
            token.user = (user as IUser)
        }
        if(!token.user){
            return token
        }
        if(Date.now() < (((token.user as IUser)?.access_expire ?? 0) - 30 * 1000)){
            return token
        }
        return refreshAccessToken(token)
    },
    session ({session, token}){
        (session.user as IUser) = token.user
        session.access_token = (token.user as IUser)?.access_token
        session.refresh_token = (token.user as IUser)?.refresh_token
        session.access_expire = (token.user as IUser)?.access_expire
        session.error = token.error
        return session
    }

  }
})
