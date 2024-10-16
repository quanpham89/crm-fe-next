'use client'

import { Button, Descriptions } from "antd"
import { useEffect, useState } from "react"
import ModalConfirmDelete from "../modalConfirm/modalConfirm.delete"
import ModalConfirmActive from "../modalConfirm/modalConfirm.active"
import ModalConfirmHidden from "../modalConfirm/modalConfirm.hidden"
import ModalUpdateCustomer from "./customer.update"


const Customer = (props: any) => {
    const {dataUser, user} = props
    const [isOpenModalConfirmHidden,setIsOpenModalConfirmHidden] = useState(false)
    const [currentCustomer, setCurrentCustomer] = useState({})
    const [isOpenModalUpdateCustomer, setIsOpenUpdateCustomer] = useState(false)
    useEffect(()=>{
        setCurrentCustomer(dataUser)
    },[dataUser])


    const items = [
        {
          key: '1',
          label: 'Name',
          children: dataUser?.user.name,
        },
        {
          key: '2',
          label:"Email",
          children: dataUser?.user.email,
        },
        {
          key: '3',
          label: 'Sex',
          children: dataUser?.user.sex,
        },
        {
          key: '4',
          label: 'Role',
          children: dataUser?.user.role,
        },
        {
          key: '5',
          label: 'Status',
          children: dataUser?.user.isActive ? "ACTIVE" : "DISABLE",
        },
        {
            key: '6',
            label: 'Account Type',
            children: dataUser?.user.accountType,
        },
      ];
    return (
        <>
        <Descriptions title="User Info" layout="horizontal" items={items} />
        <div style={{ display: "flex", gap: 15, marginTop: 20, justifyContent: "flex-end"}}>
            <Button onClick={()=> setIsOpenModalConfirmHidden(true)}>Disable</Button>
            <Button onClick={()=>setIsOpenUpdateCustomer(true)}>Update</Button>
        </div>
        <ModalConfirmHidden
            isOpenModalConfirmHidden={isOpenModalConfirmHidden}
            setOpenModalConfirmHidden={setIsOpenModalConfirmHidden}
            title={`Bạn chắc chắn vô hiệu hóa tài khoản này?`}
            currentItem={currentCustomer}
            access_token={user?.access_token}
            type="CUSTOMER"
        />
        <ModalUpdateCustomer
            isOpenModalUpdateCustomer = {isOpenModalUpdateCustomer}
            setIsOpenUpdateCustomer = {setIsOpenUpdateCustomer}
            currentCustomer = {dataUser.user}
        />
        </>
)
}

export default Customer;