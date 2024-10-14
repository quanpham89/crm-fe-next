"use client"
import { Modal, Steps, Form, Button, Input, message, notification, DatePicker } from "antd"
import { CheckCircleOutlined, LoadingOutlined, SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import { sendRequest } from "@/utils/api";
import { useHasMounted } from "@/utils/customHook";
import { Select, Space } from 'antd';
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { auth } from "@/auth";

const ModalUpdateRestaurant =  (props: any) => {
    const {access_token} = props
    const { isOpenModalUpdateRestaurant, setIsOpenUpdateRestaurant, currentRestaurant } = props
    const [form] = Form.useForm()
    const [dataUser, setDataUser] = useState([])

    const router = useRouter()

    useEffect(()=>{
        fetchUserId();
    },[])

    const fetchUserId = async() =>{
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/get-all-users`,
            method: "GET",
        })
        if(res?.data){
            const formatdata = res?.data.map((item : any) =>{
                return {
                    value: item._id,
                    label: item.name
                }
            })
            setDataUser(formatdata)
           
        }

    }

    useEffect(()=>{
        form.setFieldValue("_id", currentRestaurant._id)
        form.setFieldValue("phone", currentRestaurant.phone)
        form.setFieldValue("restaurantName", currentRestaurant.restaurantName)
        form.setFieldValue("address", currentRestaurant.address)
        form.setFieldValue("description", currentRestaurant.description)
        form.setFieldValue("productType", currentRestaurant.productType)
        form.setFieldValue("userId", currentRestaurant.userId)

        
    }, [currentRestaurant])

    const updateRestaurant =  async(values : any) =>{
        console.log(values)

        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/restaurants/update`,
            method: "PATCH",
            body: {
                ...values
            },
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        },)
        if(res?.data){
            notification.success({
                message: "Thành công",
                description: "Cập nhập người dùng thành công."
            })
            window.location.reload()
        }else{
            notification.error({
                message: "Thất bại",
                description: res.message
            })
        }
    }
    const hasMounted = useHasMounted();
    if (!hasMounted) return <></>;
    return (
        <>
            <Modal title="Update restaurant"
                open={isOpenModalUpdateRestaurant}
                onOk={() => setIsOpenUpdateRestaurant(false)}
                onCancel={() => setIsOpenUpdateRestaurant(false)}
                maskClosable={false}
                footer={null}
                forceRender={true}

            >
                <Form
                    name = "verify" 
                    autoComplete="off"
                    layout="vertical"
                    form = {form}
                    onFinish={updateRestaurant}
                    >
                        <Form.Item
                            label="Id"
                            name="_id"
                            hidden
                            rules={[
                                {
                                    required: true,
                                    message: '_id không được để trống!',
                                },
                            ]}
                        >
                            <Input  disabled/>
                        </Form.Item>
                        <Form.Item
                            label="Name's restaurant"
                            name="restaurantName"
                            rules={[
                                {
                                    required: true,
                                    message: "Name's restaurant can't be blank!",
                                },
                            ]}
                        >
                            <Input  />
                        </Form.Item>

                        <Form.Item
                            label="Phone number"
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: "Phone number can't be blank!",
                                },
                            ]}
                        >
                            <Input  />
                        </Form.Item>

                        <Form.Item
                            label="Address's restaurant"
                            name="address"
                            rules={[
                                {
                                    required: true,
                                    message: "Address's restaurant can't be blank!",
                                },
                            ]}
                            >
                            <Input  />
                        </Form.Item>

                        <Form.Item
                            label="Description's restaurant"
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: "Description's restaurant can't be blank!",
                                },
                            ]}
                            >
                            <Input  />
                        </Form.Item>

                        <Form.Item
                            label="Product's type"
                            name="productType"
                            rules={[
                                {
                                    required: true,
                                    message: "Product's type can't be blank!",
                                },
                            ]}
                        >
                            <Select
                                
                                options={[
                                    { value: 'FOOD', label: 'Đồ ăn' },
                                    { value: 'DRINK', label: 'Đồ uống' },
                                    { value: 'FASTFOOD', label: 'Đồ ăn nhanh' },
                                    { value: 'FASTFOOD + DRINK', label: 'Đồ ăn nhanh + Đồ uống' },
                                 ]}
                                />
                        </Form.Item>

                        <Form.Item
                            label="Owner"
                            name="userId"
                            rules={[
                                {
                                    required: true,
                                    message: "Owner can't be blank!",
                                },
                            ]}
                        >
                            <Select
                                
                                options={dataUser}
                                />
                        </Form.Item>

                        
                        <Form.Item style={{display: "flex", justifyContent: "flex-end", marginTop: 20, marginBottom: 0}}>
                            <Button type="primary" htmlType="submit">
                                UPDATE
                            </Button>
                        </Form.Item>
                </Form>
                    
            </Modal>

        </>

    )

}

export default ModalUpdateRestaurant