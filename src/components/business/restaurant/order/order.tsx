'use client'
import { Avatar, Badge, Breadcrumb, Button, Checkbox, Descriptions, Form, Input, notification, Pagination, Select, Spin, Table } from "antd"
import { Children, use, useContext, useEffect, useState } from "react";
import { sendRequest } from "@/utils/api";
import { BusinessContext } from "@/library/business.context";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";


const Order = (props: any) => {
    const { user, data } = props
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [isOpenModalUpdateRestaurant, setIsOpenUpdateRestaurant] = useState(false)

    const [currentRestaurant, setCurrentRestaurant] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const [dataRestaurant, setDataRestaurant] = useState<any>([])
    const [form] = Form.useForm()
    const router = useRouter()
    useEffect(() => {
        const formatData = [
            {
                label: "Name",
                children: data?.restaurant?.restaurantName
            },
            {
                label: "Address",
                children: data?.restaurant?.address
            },
            {
                label: "Phone",
                children: data?.restaurant?.phone
            },
            {
                label: "Rating",
                children: data?.restaurant?.rating
            },

            {
                label: "Menu",
                children: data?.nameMenu
            },
            {
                label: "Product Type",
                children: data?.restaurant?.productType
            },
            {
                label: "Description Menu",
                children: data?.description
            },

        ]
        setDataRestaurant(formatData)
    }, [data])



    return (isLoading ?
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Spin />
        </div>
        :
        <>
            <Breadcrumb
                items={[
                    {
                        title: 'Home',
                    },
                    {
                        title: <a href="">Application Center</a>,
                    },
                    {
                        title: <a href="">Application List</a>,
                    },
                    {
                        title: 'An Application',
                    },
                ]}
            />
            <Badge count={5}>
                <Avatar shape="square" icon={<ShoppingCartOutlined />} />
            </Badge>
            
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
                fontSize: 20,
                fontWeight: 600
            }}>
                <span>Order</span>

            </div>

            <Descriptions items={dataRestaurant} bordered />
        </>
    )
}

export default Order;