'use server'
import { signIn} from "@/auth";
import { sendRequest } from "./api";
import { revalidateTag } from "next/cache";

export async function authenticate(username: string, password: string) {
    try {
        const r = await signIn("credentials", {
            username: username,
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

// admin
export async function handleGetData(path:string, access_token: string,) {
    const res = await sendRequest<IBackendRes<IUserPerPage>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
        headers: {
            "Authorization": `Bearer ${access_token}`
        }
    })
    return res
    
}

export async function handleGetDataPerPage(path:string, access_token: string, nextOptions : any) {
    const res = await sendRequest<IBackendRes<IUserPerPage>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
        headers: {
            "Authorization": `Bearer ${access_token}`
        },
        nextOption:{
            ...nextOptions
        }
    })
    return res
    
}

export async function handleGetFigure(path:string, access_token: string) {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
        headers: {
            "Authorization": `Bearer ${access_token}`
        },
    })
    return res
    
}

export async function handleGetDataMenu(path:string, access_token: string) {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
        headers: {
            "Authorization": `Bearer ${access_token}`
        },
        nextOption:{
             next: { tags: ["menuItem"] } 
        }
    })
    return res
    
}

export async function handleSoftDeleteDataMenu(path:string, data: any, access_token: string, option : any) {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${access_token}`
        },
        body:{
            data
        },

    })
    revalidateTag(option)
    return res
    
}

export async function handleActiveItemDataMenu(path:string, data: any, access_token: string, option : any) {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${access_token}`
        },
        body:{
            data
        },

    })
    revalidateTag(option)
    return res
    
}

export async function handleDeleteDataMenu(path:string, data: any, access_token: string, option: string) {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${access_token}`
        },
        body:{
            data
        },

    })
    revalidateTag(option)
    return res
    
}

// businessman
export async function handleGetDataUserById(path:string, access_token: string) {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
        headers: {
            "Authorization": `Bearer ${access_token}`
        }
    })
    return res
    
}

export async function handleGetDataRestaurantById(path:string, access_token: string) {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
        headers: {
            "Authorization": `Bearer ${access_token}`
        }
    })
    return res
    
}

export async function handleGetDataOrderDetail(path:string, access_token: string) {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
        headers: {
            "Authorization": `Bearer ${access_token}`
        }
    })
    return res
    
}

export async function changeStatusOrderDetailItem (path:string,data : any, access_token: string) {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "POST",
        body:{
            ...data,
        },
        headers: {
            "Authorization": `Bearer ${access_token}`
        }
    })
    return res
    
}




// customer
export async function handleGetDataUserCustomer(path:string, access_token: string) {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
        headers: {
            "Authorization": `Bearer ${access_token}`
        }
    })
    return res
    
}

export async function handleGetAllRestaurantRender(path:string) {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
    })
    return res
    
} 

export async function handleGetAllVoucherRender(path:string) {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
    })
    return res
    
} 

export async function handleGetAllCouponRender(path:string) {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
    })
    return res
    
} 

export async function handleGetDataRestaurantRender(path:string) {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
    })
    return res
    
}

export async function handleGetDataMenuBelongToRender(path:string) {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
    })
    return res
    
}

export async function handleGetListVoucher(path:string) {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
    })
    return res
    
}

export async function handleGetListCoupon(path:string) {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
    })
    return res
    
}

export async function handleGetVoucherPerUserId(path:string, access_token: string) {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
        headers: {
            "Authorization": `Bearer ${access_token}`
        }
    })
    return res
    
}

export async function handleGetCouponPerUserId(path:string, access_token: string) {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
        headers: {
            "Authorization": `Bearer ${access_token}`
        }
    })
    return res
    
}

export async function handleAddPromotionForCustomer(path:string, data : any) {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "POST",
        body:{
            ...data
        },
    })
    return res
    
}


export async function handlePostDataBillOfCustomer(path:string, data : any, access_token: string) {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "POST",
        body:{
            ...data
        },
        headers: {
            "Authorization": `Bearer ${access_token}`
        }
    })
    return res
    
}


export async function handleGetOrderById(path:string, access_token: string) {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
        headers: {
            "Authorization": `Bearer ${access_token}`
        }
    })
    return res
    
}


export async function handleCloseOrder(path:string, data : any, access_token: string) {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "PATCH",
        body:{
            ...data
        },
        headers: {
            "Authorization": `Bearer ${access_token}`
        }
    })
    return res
}


export async function handleReceiveOrder(path:string,access_token: string) {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${access_token}`
        }
    })
    return res
}


