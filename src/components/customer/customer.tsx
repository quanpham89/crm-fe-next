'use client'

import { Button, Descriptions, notification } from "antd"
import { useEffect, useState } from "react"
import ModalConfirmDelete from "../modalConfirm/modalConfirm.delete"
import ModalConfirmActive from "../modalConfirm/modalConfirm.active"
import ModalConfirmHidden from "../modalConfirm/modalConfirm.hidden"
import ModalUpdateCustomer from "./customer.update"
import { handleGetDataUserCustomer } from "@/utils/action"


const Customer = (props: any) => {
    const {user} = props
    const [isOpenModalConfirmHidden,setIsOpenModalConfirmHidden] = useState(false)
    const [currentCustomerUser, setCurrentCustomerUser] = useState<any>({})
    const [isOpenModalUpdateCustomer, setIsOpenUpdateCustomer] = useState(false)
    const getDataUser  = async () =>{
      const response = await handleGetDataUserCustomer(`api/v1/customers/get-customer-by-id?_id=${user?._id}`,user?.access_token);
      if(response && response.data){
        setCurrentCustomerUser(response.data)
      }else{
        notification.error({message: "Có lỗi xãy ra vui lòng thử lại sau."})
      }
    }
    useEffect(()=>{
      getDataUser()
    },[])


    const items = [
        {
          key: '1',
          label: 'Họ và tên: ',
          children: currentCustomerUser?.user?.name,
        },
        {
          key: '2',
          label:"Email",
          children: currentCustomerUser?.user?.email,
        },
        {
          key: '3',
          label: 'Giới tính',
          children: currentCustomerUser?.user?.sex === "MALE" ? "Nam " : "Nữ",
        },
        {
          key: '4',
          label: 'Loại tài khoản',
          children: currentCustomerUser?.user?.role === "BUSINESSMAN" ? "Người kinh doanh" : "Khách hàng" ,
        },
        {
          key: '5',
          label: 'Trạng thái',
          children: currentCustomerUser?.user?.isActive ? "Hoạt động" : "vô hiệu hóa",
        },
        {
            key: '6',
            label: 'Loại tài khoản',
            children: currentCustomerUser?.user?.accountType === "FREE" && "Miễn phí",
        },
      ];
    return (
        <>
        
        <Descriptions title="Thông tin người dùng" layout="horizontal" items={items} />
        <div style={{ display: "flex", gap: 15, marginTop: 20, justifyContent: "flex-end"}}>
            <Button onClick={()=> setIsOpenModalConfirmHidden(true)}>Vô hiêu hóa tài khoản</Button>
            <Button onClick={()=>setIsOpenUpdateCustomer(true)}>Cập nhập thông tin</Button>
        </div>
        <ModalConfirmHidden
            isOpenModalConfirmHidden={isOpenModalConfirmHidden}
            setOpenModalConfirmHidden={setIsOpenModalConfirmHidden}
            title={`Bạn chắc chắn muốn vô hiệu hóa tài khoản của bạn này?`}
            currentItem={currentCustomerUser}
            access_token={user?.access_token}
            type="CUSTOMER"
        />
        <ModalUpdateCustomer
            isOpenModalUpdateCustomer = {isOpenModalUpdateCustomer}
            setIsOpenUpdateCustomer = {setIsOpenUpdateCustomer}
            currentCustomer = {currentCustomerUser?.user}
            access_token = {user?.access_token}
        />
        </>
)
}

export default Customer;