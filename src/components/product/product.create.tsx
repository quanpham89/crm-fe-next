"use client"

import { sendRequest } from "@/utils/api"
import { useEffect } from "react"

const CreateProduct = (props : any) => {
    const {user} = props
    
    const fetchUserPerPage = async (page : number , limit : number) =>{
        const res = await sendRequest({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/profile`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${user?.access_token}`, 
            },
            
        })

    }

    useEffect(()=>{
        fetchUserPerPage(1, 1)
    },[])
    
    return (
        <div>
            Manage Product Page
        </div>
    )
}

export default CreateProduct;