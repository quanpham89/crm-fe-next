'use server'
import { auth, signIn} from "@/auth";
import { sendRequest } from "./api";
import { revalidatePath, revalidateTag } from "next/cache";



export async function getAuthHeaders() {
  const session = await auth();

 return {
    "Authorization": `Bearer ${session?.access_token}`,
 }
}

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
export async function handleGetData(path:string,) {
    const cacheTag = "data-user"
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<IUserPerPage>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
        headers: {
            ...header
        },
       nextOption:{ cache: "force-cache",  next: { tags: [cacheTag] }  }
    })
    return res
    
}

export async function handleCreateShop(path:string, values: any) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<IUserPerPage>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "POST",
        headers: {
          ...header,
        },
        body: {
          ...values,
        },
    })
    revalidateTag("data-shop")
    return res
    
}

export async function handleCreateUser(path:string, values: any) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<IUserPerPage>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "POST",
        headers: {
          ...header,
        },
        body: {
          ...values,
        },
    })
    revalidateTag("data-user")
    return res
    
}

export async function handleUpdateUser(path:string, values: any) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<IUserPerPage>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "PATCH",
        headers: {
          ...header,
        },
        body: {
          ...values,
        },
    })
    revalidateTag("data-user")
    return res
    
}

export async function handleGetDataPerPage(path:string, cacheTag : string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<IUserPerPage>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
        headers: {
            ...header
        },
        nextOption:{ cache: "force-cache",  next: { tags: [cacheTag] }  }
    })
    return res
    
}

export async function handleGetFigure(path:string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
        headers: {
            ...header
        },
    })
    return res
    
}


export async function handleRemoveUserById(path:string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "DELETE",
        headers: {
            ...header
        }
    })
    return res
    
}

export async function handleGetUserPerPage(path:string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
        headers: {
            ...header
        }
    })
    return res
    
}

// menu

export async function handleGetDataMenu(path:string) {
    const header = await getAuthHeaders()
    const cacheTag = "menuItem"


    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
        headers: {
            ...header
        },
        nextOption:{
             cache: "force-cache",
             next: { tags: [cacheTag] } 
        }
    })
   
    return res
    
}

export async function handleCreateMenu(path: string, data: any, option: string) {
    const header = await getAuthHeaders()

  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
    method: "POST",
    body: data,
    headers: {
      ...header,
    },
  });


  
    revalidateTag(option)
 
  return res;
}

export async function handleActiveMenu(path:string, option: string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "PATCH",
        headers: {
            ...header
        }
    })
    revalidateTag(option)
    return res
    
}





export async function handleCreateMenuItem(path: string, data: any, option: string) {
    const header = await getAuthHeaders()

  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
    method: "POST",
    body: data,
    headers: {
      ...header,
    },
  });


  
    revalidateTag(option)
 
  return res;
}

export async function handleUpdateMenuById(path: string, data: any, option: string) {
    const header = await getAuthHeaders()

  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
    method: "PATCH",
    body: data,
    headers: {
      ...header,
    },
  });


  
    revalidateTag(option)
 
  return res;
}


export async function handleSoftDeleteMenu(path:string, data: any, option : any) {
    const header = await getAuthHeaders()
  
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "PATCH",
        headers: {
            ...header
        },
        body:{
            data
        },

    })
    revalidateTag(option)
   
    return res
    
}


export async function handleUpdateMenuItems(path: string, data: any, option: string, refreshPath?: string) {
    const header = await getAuthHeaders()

  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
    method: "POST",
    body: data,
    headers: {
      ...header,
    },
  });

    revalidateTag(option)
  
  return res;
}

export async function handleSoftDeleteDataMenu(path:string, data: any, option : any) {
    const header = await getAuthHeaders()
  
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "PATCH",
        headers: {
            ...header
        },
        body:{
            data
        },

    })
    revalidateTag(option)
   
    return res
    
}

export async function handleActiveItemDataMenu(path:string, data: any, option : any) {
    const header = await getAuthHeaders()
   
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "PATCH",
        headers: {
            ...header
        },
        body:{
            data
        },

    })
    revalidateTag(option)

    return res
    
}

export async function handleDeleteDataMenu(path:string, data: any, option: string) {
    const header = await getAuthHeaders()
  
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "DELETE",
        headers: {
            ...header
        },
        body:{
            data
        },

    })
    revalidateTag(option)
   
    return res
    
}

export async function handleRemoveMenu(path:string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "DELETE",
        headers: {
            ...header
        }
    })
    return res
    
}



// businessman
export async function handleGetDataUserById(path:string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
        headers: {
            ...header
        }
    })
    return res
    
}

export async function handleGetDataRestaurantById(path:string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
        headers: {
            ...header
        }
    })
    return res
    
}


export async function handleGetRestaurantPage(path:string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
        headers: {
            ...header
        }
    })
    return res
    
}




export async function handleGetDataOrderDetail(path:string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
        headers: {
            ...header
        }
    })
    return res
    
}

export async function changeStatusOrderDetailItem (path:string,data : any) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "POST",
        body:{
            ...data,
        },
        headers: {
            ...header
        }
    })
    return res
    
}

export async function handleSoftDeleteRestaurant(path:string, option: string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "DELETE",
        headers: {
            ...header
        }
    })
    revalidateTag(option)
    return res
    
}

export async function handleRemoveRestaurantById(path:string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "DELETE",
        headers: {
            ...header
        }
    })
    return res
    
}

export async function handleActiveRestaurant(path:string, option: string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "PATCH",
        headers: {
            ...header
        }
    })
    revalidateTag(option)
    return res
    
}





// customer
export async function handleGetDataUserCustomer(path:string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
        headers: {
            ...header
        }
    })
    return res
    
}

export async function handleGetAllRestaurantRender(path:string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
    })
    return res
    
} 

export async function handleGetAllVoucherRender(path:string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
    })
    return res
    
} 

export async function handleGetAllCouponRender(path:string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
    })
    return res
    
} 

export async function handleGetDataRestaurantRender(path:string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
    })
    return res
    
}

export async function handleGetDataMenuBelongToRender(path:string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
    })
    return res
    
}


export async function handleSoftDeleteCustomer(path:string, option: string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "DELETE",
        headers: {
            ...header
        }
    })
    revalidateTag(option)
    return res
    
}



// voucher
export async function handleGetListVoucher(path:string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
    })
    return res
    
}

export async function handleGetVoucherPerUserId(path:string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
        headers: {
            ...header
        }
    })
    return res
    
}

export async function handleGetVoucherPerPage(path:string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
        headers: {
            ...header
        }
    })
    return res
    
}

export async function handleGetVoucherById(path:string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
        headers: {
            ...header
        }
    })
    return res
    
}

export async function handleSearchVoucher(path:string, data: any) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
        headers: {
            ...header
        },
        body: {
            ...data
        }
    })
    return res
    
}


export async function handleRemoveVoucherById(path:string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "DELETE",
        headers: {
            ...header
        }
    })
    return res
    
}

export async function handleSoftDeleteVoucher(path:string, option: string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "DELETE",
        headers: {
            ...header
        }
    })
    revalidateTag(option)
    return res
    
}


export async function handleActiveVoucher(path:string, option: string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "PATCH",
        headers: {
            ...header
        }
    })
    revalidateTag(option)
    return res
    
}

// coupon
export async function handleGetListCoupon(path:string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
    })
    return res
    
}

export async function handleSoftDeleteCoupon(path:string, option: string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "DELETE",
        headers: {
            ...header
        }
    })
    revalidateTag(option)
    return res
    
}


export async function handleActiveCoupon(path:string, option: string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "PATCH",
        headers: {
            ...header
        }
    })
    revalidateTag(option)
    return res
    
}

export async function handleSearchCoupon(path:string, data: any) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
        headers: {
            ...header
        },
        body: {
            ...data
        }
    })
    return res
    
}


export async function handleGetCouponPerUserId(path:string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
        headers: {
            ...header
        }
    })
    return res
    
}


export async function handleRemoveCouponById(path:string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "DELETE",
        headers: {
            ...header
        }
    })
    return res
    
}

export async function handleGetCouponById(path:string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
        headers: {
            ...header
        }
    })
    return res
    
}

export async function handleGetCouponPerPage(path:string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
        headers: {
            ...header
        }
    })
    return res
    
}

export async function handleAddPromotionForCustomer(path:string, data : any) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "POST",
        body:{
            ...data
        },
    })
    return res
    
}


export async function handlePostDataBillOfCustomer(path:string, data : any) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "POST",
        body:{
            ...data
        },
        headers: {
            ...header
        }
    })
    return res
    
}


export async function handleGetOrderById(path:string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
        headers: {
            ...header
        }
    })
    return res
    
}


export async function handleCancelOrder(path:string, option : any) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "PATCH",
       
        headers: {
            ...header
        }
    })
    revalidateTag(option)
    return res
}

export async function handleCloseOrder(path:string, data : any) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "PATCH",
        body:{
            ...data
        },
        headers: {
            ...header
        }
    })
    return res
}


export async function handleReceiveOrder(path:string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "PATCH",
        headers: {
            ...header
        }
    })
    return res
}

export async function handleSendError(path:string, data:any) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "POST",
        body:{
            ...data
        },
    })
    return res
}

export async function handleGetErrorForAdmin(path:string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
        headers: {
            ...header
        },
        nextOption: {
            next: {
                next: { tags: ["data-error"] },
            }
        }
        
    })
    return res
}


export async function handleChangeStatusError(path:string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "PATCH",
        headers: {
            ...header
        },
    })
    revalidateTag("data-error")
    return res
}


export async function handlePostDataFeedback(path:string, data: any) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "POST",
        body:{
            ...data
        },
        headers: {
            ...header
        }
    })
    return res
}

export async function handlePatchDataFeedback(path:string, data: any) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "PATCH",
        body:{
            ...data
        },
        headers: {
            ...header
        }
    })
    return res
}


export async function handleGetDataFeedback(path:string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
        headers: {
            ...header
        }
    })
    return res
}


export async function handleGetDataFeedbackById(path:string) {
    const header = await getAuthHeaders()
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
        method: "GET",
        headers: {
            ...header
        }
    })
    return res
}
