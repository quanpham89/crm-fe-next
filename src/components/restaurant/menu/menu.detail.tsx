"use client"

import { AdminContext } from "@/library/admin.context"
import { handleGetData, handleGetDataPerPage } from "@/utils/action"
import { sendRequest } from "@/utils/api"
import { BarsOutlined, CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, MinusCircleOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Col, Descriptions, Form, Input, InputNumber, notification, Row, Space, Spin, Table, Tabs, Upload } from "antd"
import { usePathname, useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import "../Pagination.scss"
import { SizeType } from "antd/es/config-provider/SizeContext"
import MenuDetailUpdate from "./menu.detail.update"
import MenuDetailCreate from "./menu.detail.create"
import MenuDetailDelete from "./menu.detail.delete"

const MenuDetail = (props: any) => {
    const { role, menuInfo, menuItems, user, access_token, restaurantId } = props
    const author = {
        userCreateId: menuInfo.userCreateId,
        createdBy: menuInfo.createdBy,
        restaurantId: menuInfo.restaurantId
    }
    const [isLoading, setLoading] = useState(false)
    const { roleUsers, roleUser, setRoleUser } = useContext(AdminContext)!;
    useEffect(()=>{
        setRoleUser(role)
    },[])
    const formatItems = [
        {
            key: "1",
            label: "Menu",
            children: menuInfo.nameMenu
        },
        {
            key: "2",
            label: "Status",
            children: menuInfo.status
        },
        {
            key: "4",
            label: "Create by",
            children: menuInfo.createdBy
        },
        {
            key: "3",
            label: "Description",
            children: menuInfo.description
        },

    ]


    const [size, setSize] = useState<SizeType>('small');

   

    if (roleUsers.includes(roleUser)) {

        return(isLoading ?
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Spin />
            </div>
            :
            <>
            <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20
                }}>
                    <span>Detail menu</span>
                </div>
                <div style={{ border: "1px solid #d9d9d9", padding: 15, borderRadius: 8, margin: 20, }}>
                    <Descriptions title="Menu" items={formatItems} />
                </div>
                <Tabs
                defaultActiveKey="1"
                size={size}
                style={{ marginBottom: 32 }}
                items={[
                    {
                        label: "Update",
                        key: "1",
                        children: (
                            <MenuDetailUpdate
                                role= {role}
                                menuInfo = {menuInfo}
                                menuItems = {menuItems}
                                user = {user}
                                access_token = {access_token}
                            />
                        ),
                    },
                    {
                        label: "Create",
                        key: "2",
                        children: (
                            <MenuDetailCreate
                                restaurantId= {restaurantId}
                                role= {role}
                                access_token = {access_token}
                                author= {author}
                                menuInfo = {menuInfo}
                            />
                        ),
                    },
                    {
                        label: "Delete",
                        key: "3",
                        children: (
                            <MenuDetailDelete
                                role= {role}
                                access_token = {access_token}
                                menuInfo = {menuInfo}
                            />
                        ),
                    },
                ]}
            />

            </>

        )
    } else {
        return <>Bạn không có quyền truy cập vào chức năng này.</>
    }
}



export default MenuDetail