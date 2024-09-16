'use server'
import { signIn} from "@/auth";

export async function authenticate(email: string, password: string) {
    try {
        const r = await signIn("credentials", {
            username: email,
            password: password,
            // callbackUrl: "/",
            redirect: false,
        })
        return r
    } catch (error) {
        switch((error as any).name){
            case "InvalidEmailPasswordError": 
                return {
                    error: (error as any).type,
                    code: 1
                }
            case "InActiveAccount": 
                return {
                    error: (error as any).type,
                    code: 2
                }
            default: 
            return {
                error: "Internal server error !",
                code: 0
            }

        }
        
       
    }
}
