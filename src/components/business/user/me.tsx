'use client'
import { handleGetDataUserById } from "@/utils/action"
import { Button, Descriptions, notification, Pagination, Spin, Table } from "antd"
import { useEffect, useState } from "react"
import BusinessCard from "../dashboard/businessCard"


const MeInfor = (props: any) => {
    const{user} = props
    const [isLoading, setIsLoading] = useState(true)
    const [items,setItems] = useState<any>([])

    const getInforUser = async()=>{
        const response = await handleGetDataUserById(`api/v1/users/get-user-by-id?_id=${user._id}`, user.access_token)
        if(response && response.data){
            setIsLoading(false)
            const data = response?.data
            const formatvalue = [
                {
                  key: '1',
                  label: 'Họ và tên: ',
                  children: data?.name,
                },
                {
                  key: '2',
                  label:"Email",
                  children: data?.email,
                },
                {
                  key: '3',
                  label: 'Giới tính',
                  children: data?.sex === "MALE" ? "Nam " : "Nữ",
                },
                {
                  key: '4',
                  label: 'Loại tài khoản',
                  children: data?.role === "BUSINESSMAN" ? "Người kinh doanh" : "Khách hàng" ,
                },
                {
                  key: '5',
                  label: 'Trạng thái',
                  children: data?.isActive ? "Hoạt động" : "vô hiệu hóa",
                },
                {
                    key: '6',
                    label: 'Loại tài khoản',
                    children: data?.accountType === "FREE" && "Miễn phí",
                },
              ];

            setItems(formatvalue)
        }
    }
    
    useEffect(()=>{
        getInforUser()
    },[])
        
        return (isLoading ?
            <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <Spin />
            </div>
            :
            <>
            <Descriptions bordered title="Thông tin người dùng" layout="horizontal" items={items} />
            <BusinessCard role = {user?.role}/>


                


            </> 
        )
}

export default MeInfor;