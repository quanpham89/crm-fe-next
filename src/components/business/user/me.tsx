'use client'
import { handleGetDataUserById } from "@/utils/action"
import { Button, notification, Pagination, Spin, Table } from "antd"
import { useEffect, useState } from "react"


const MeInfor = (props: any) => {
    const{user} = props
    const [isLoading, setIsLoading] = useState(true)
    const getInforUser = async()=>{
        const response = await handleGetDataUserById(`api/v1/users/get-user-by-id?_id=${user._id}`, user.access_token)
        if(response){
            // console.log(response.data)
        }
    }
    
    useEffect(()=>{
        getInforUser()
    },[])
        
    if(user?.role === "BUSINESSMAN") {
        
        return (isLoading ?
            <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <Spin />
            </div>
            
            :
            <>
                


            </> 
        )
    }else{
        return <>Permission denied.</>
    }
}

export default MeInfor;