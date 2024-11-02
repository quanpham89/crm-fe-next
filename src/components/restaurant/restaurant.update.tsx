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

    const { isOpenModalUpdateRestaurant, setIsOpenUpdateRestaurant, currentRestaurant, setCurrentRestaurant } = props
    const [form] = Form.useForm()

    const router = useRouter()

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
                message: "Cập nhập thông tin shop thanhg công.",
            })
            window.location.reload()
            notification.error({
                message: "Có lỗi xảy ra, vui lòng thử lại sau.",
                description: res.message
            })
        }
    }
    const handleCloseModal = ()=>{
        setIsOpenUpdateRestaurant(false)
        form.resetFields()
        setCurrentRestaurant({})
        

    }
    const hasMounted = useHasMounted();
    if (!hasMounted) return <></>;
    return (
        <>
            <Modal title="Cập nhập shop"
                open={isOpenModalUpdateRestaurant}
                onOk={handleCloseModal }
                onCancel={handleCloseModal}
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
                            hidden
                            rules={[
                                {
                                    required: true,
                                    message: "Owner can't be blank!",
                                },
                            ]}
                        >
                            <Input disabled/>

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