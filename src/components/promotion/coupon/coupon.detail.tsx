"use client"

import { AdminContext } from "@/library/admin.context"
import { sendRequest } from "@/utils/api"
import { CheckOutlined, CloseOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, notification, Spin, Table } from "antd"
import dayjs from "dayjs"
import { useContext, useEffect, useState } from "react"

const CouponDetail = (props: any) =>{
    const {id, role, access_token } = props
    const [dataCouponItem, setDataCouponItem] = useState<any>([])
    const [loading, setLoading] = useState<boolean> (true)
    const [currentCoupon, setCurrentCoupon] =  useState("")
    const [isOpenModalConfirmActive, setOpenModalConfirmActive] = useState(false)
    const [isOpenModalConfirmUnActive, setOpenModalConfirmUnActive] = useState(false)
    const { roleUsers, roleUser, setRoleUser } = useContext(AdminContext)!;
    setRoleUser(role)


    const fetchCouponItem = async () => {
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/coupons/get-coupon-by-id?_id=${id}`,
            method: "GET",
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        })
        if (res?.data) {
            setLoading(false)
            const result = res?.data[0].couponItems
            const formatResult = result.map((item : any) =>{
                let startDate = dayjs(item.startedDate).format("DD-MM-YYYY")
                let endDate = dayjs(item.endedDate).format("DD-MM-YYYY") 
                return {
                    ...item,
                    startedDate: startDate,
                    endedDate: endDate
                }
            })
            setDataCouponItem(formatResult)

            
        } else {
            notification.error({
                message: "Call APIs error",
                description: res?.message
            })
        }

    }

    useEffect(()=>{
        fetchCouponItem()
    },[])

    const handleUnActiveCoupon = async (values: any) => {
        setCurrentCoupon(values)
        setOpenModalConfirmUnActive(true)
    }

    const handleActiveCoupon = async (values: any) => {
        setCurrentCoupon(values)
        setOpenModalConfirmActive(true)
    }


    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
            key: '_id',
        },
        {
            title: 'Belong To',
            dataIndex: 'nameCoupon',
            key: 'nameCoupon',
        },
        {
            title: 'Code Id',
            dataIndex: 'codeId',
            key: 'codeId',
        },
        {
            title: 'Item Id - itemUse',
            dataIndex: 'itemId',
            key: 'itemId',
        },
        {
            title: 'Customer Id - userUse',
            dataIndex: 'customerId',
            key: 'customerId',
        },

        {
            title: 'Start Date',
            dataIndex: 'startedDate',
            key: 'startedDate',
        },
        {
            title: 'End Date',
            dataIndex: 'endedDate',
            key: 'endedDate',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Use time',
            dataIndex: 'usedTime',
            key: 'useTime',
        },
        {
            title: 'Action',
            dataIndex: '',
            key: '',
            render: (text: string, record: any) =>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 40, fontSize: 20 }}>
                    <MinusOutlined onClick={() => handleUnActiveCoupon(record)} />
                    <PlusOutlined onClick={() => handleActiveCoupon(record)} />
                </div>


        },
    ];

    if (roleUsers.includes(roleUser)) {

        return (!loading ?
                <>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                    alignContent: "center"
                }}>
                    <span>Information Coupon</span>
                    <span>Total: {dataCouponItem.length}</span>
                </div>
                
                <div style={{height: "50vh", overflowY: "scroll" }}>
                    <Table
                        bordered
                        dataSource={dataCouponItem}
                        columns={columns}
                        pagination={false}
                        rowKey="_id"
                    />
                    
                    

                </div>
                </>


            :
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Spin />
            </div>
        )





    } else {
        <div> You must have permission to access this function.</div>
    }
    
}

export default CouponDetail