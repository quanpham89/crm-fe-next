"use client"

import { AdminContext } from "@/library/admin.context"
import { sendRequest } from "@/utils/api"
import { CheckOutlined, CloseOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, notification, Spin, Table } from "antd"
import dayjs from "dayjs"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"

const VoucherDetail = (props: any) =>{
    const {id, role, access_token } = props
    const [dataVoucherItem, setDataVoucherItem] = useState<any>([])
    const [loading, setLoading] = useState<boolean> (true)
    const [currentVoucher, setCurrentVoucher] =  useState("")
    const [isOpenModalConfirmActive, setOpenModalConfirmActive] = useState(false)
    const [isOpenModalConfirmUnActive, setOpenModalConfirmUnActive] = useState(false)
    const roleUsers = ["ADMINS", "ADMIN", "BUSINESSMAN"]

    const router = useRouter()


    const fetchVoucherItem = async () => {
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/vouchers/get-voucher-by-id?_id=${id}`,
            method: "GET",
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        })
        if (res?.data) {
            setLoading(false)
            const result = res?.data[0].voucherItems
            const formatResult = result.map((item : any) =>{
                let startDate = dayjs(item.startedDate).format("DD-MM-YYYY")
                let endDate = dayjs(item.endedDate).format("DD-MM-YYYY") 
                return {
                    ...item,
                    startedDate: startDate,
                    endedDate: endDate
                }
            })
            setDataVoucherItem(formatResult)

            
        } else {
            notification.error({
                message: "Call APIs error",
                description: res?.message
            })
        }

    }

    useEffect(()=>{
        fetchVoucherItem()
    },[])




    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
            key: '_id',
        },
        {
            title: 'Belong To',
            dataIndex: 'nameVoucher',
            key: 'nameVoucher',
        },
        {
            title: 'Code Id',
            dataIndex: 'codeId',
            key: 'codeId',
        },
        {
            title: 'Customer Id - userUse',
            dataIndex: 'customerId',
            key: 'customerId',
        },
        {
            title: 'Item Id - itemUse',
            dataIndex: 'itemId',
            key: 'itemId',
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
    ];

    if (roleUsers.includes(role)) {

        return (!loading ?
                <>
                <Button onClick={()=> router.back()} style={{marginBottom: 20}}>Back</Button>

                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                    alignContent: "center"
                }}>
                    <span>Information Voucher</span>
                    <span>Total: {dataVoucherItem.length}</span>
                </div>
                
                <div style={{ height: "50vh", overflowY: "scroll" }}>
                    <Table
                        bordered
                        dataSource={dataVoucherItem}
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

export default VoucherDetail