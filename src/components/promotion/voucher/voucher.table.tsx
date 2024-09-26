'use client'

import { sendRequest } from "@/utils/api";
import { CheckOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Input, notification, Row, Select, Table } from "antd";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useEffect, useState } from "react";




const VoucherTable = (props: any) => {
    const [form] = Form.useForm()
    const {role, access_token} = props
    const [loading, setLoading] = useState(true)
    const [totalPage, setTotalPages] = useState(1)
    const [dataSource, setDataSource] = useState<any>([])
    const [totalItems, setTotalItems] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [currentLimit, setCurrentLimit] = useState(3)


    const fetchVouchersPerPage = async (page : number , limit : number) =>{
        const res = await sendRequest<IBackendRes<IUserPerPage>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/vouchers?current=${page}&pageSize=${limit}`,
            method: "GET",
            headers: {
                "Authorization" : `Bearer ${access_token}`
            }
            
        })
        if(res?.data?.results){    
            const vouchers = Array.isArray(res.data.results) ? res.data.results : [res.data.results];
            console.log(vouchers)

            const formatData = vouchers.map(item =>{ 
                return ({
                ...item,
                activeIcon: item.status ? <CheckOutlined style={{fontSize: "16px", display: "flex", justifyContent: "center", color: "green"}}/> : <CloseOutlined style={{fontSize: "16px", display: "flex", justifyContent: "center", color: "red"}}/>
            })});
            setDataSource(formatData)
            setTotalPages(+res?.data?.totalPages)
            setTotalItems(+res?.data?.totalItems)
            setLoading(false)
        }else{
            notification.error({
                message: "Call APIs error",
                description: res?.message
            })
        }

    }

    useEffect(()=>{
        fetchVouchersPerPage(+currentPage, +currentLimit)

    }, [currentPage])

    // const dataSource = [
    //     {
    //         key: '1',
    //         name: 'Mike',
    //         age: 32,
    //         address: '10 Downing Street',
    //     },
    //     {
    //         key: '2',
    //         name: 'John',
    //         age: 42,
    //         address: '10 Downing Street',
    //     },
    // ];

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
    ];

    const search = (values: any) => {
        console.log(values.time[0].$d)
        console.log(values.time[1].$d)

        dayjs.extend(utc);

        const convertedLocalDate = dayjs(values.time[0].$d).utc().format();
        console.log(convertedLocalDate)        
      

    }


    return (role ==="ADMIN" ?
        <div >
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
                alignContent: "center"
            }}>
                <span>Manager Voucher</span>
                <Button onClick={() => console.log(31212)}>Create Voucher</Button>
            </div>

            <div>
                <Form
                    name="search"
                    autoComplete="off"
                    layout="vertical"
                    form={form}
                    onFinish={search}

                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Name's voucher"
                                name="nameVoucher"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Pin code's voucher"
                                name="_id"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Type"
                                name="type"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="For"
                                name="forAge"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Range Time"
                                name="time"
                            >
                                <DatePicker.RangePicker
                                    placeholder={['From', 'To']}
                                    allowEmpty={[false, true]}
                                    onChange={(date, dateString) => {
                                        console.log(date, dateString);
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>


                    <Form.Item style={{ display: "flex", justifyContent: "flex-end", marginTop: 20, marginBottom: 20 }}>
                        <Button type="primary" htmlType="submit">
                            Search
                        </Button>
                    </Form.Item>
                </Form>

            </div>

            <div style={{ minHeight: "50vh" }}>
                <Table
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false}
                    rowKey="_id"
                />

            </div>

        </div>
        :
        <div> You must have permission to access this function.</div>
    )
}

export default VoucherTable