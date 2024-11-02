"use client"
import { Modal, Steps, Form, Button, Input, message, notification, DatePicker } from "antd"
import { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import { sendRequest } from "@/utils/api";
import { useHasMounted } from "@/utils/customHook";
import { Select } from 'antd';
import { useRouter } from "next/navigation";

const ModalCreateRestaurant =  (props: any) => {
    const { isOpenModal, setIsOpenModal, user, role, access_token } = props
    const [form] = Form.useForm()
    const [dataUser, setDataUser] = useState([])
    const router = useRouter()
    if(user ){
        form.setFieldValue("userId", user._id)
    }
    

    const fetchUserId = async() =>{
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/get-all-users`,
            method: "GET",
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
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
        fetchUserId();
    },[isOpenModal])
    
    const createRestaurants =  async(values : any) =>{
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/restaurants`,
            method: "POST",
            headers: {
                "Authorization": `Bearer ${access_token}`
            },
            body: {
              ...values
            },
        },)
        if(res?.data){
            notification.success({
                message: "Tạo shop thành công.",
            })
            window.location.reload()
        }else{
            notification.error({
                message: "Đã xảy ra vấn đề, vui lòng thử lại sau.",
                description: res.message
            })
        }
    }
    const hasMounted = useHasMounted();
    if (!hasMounted) return <></>;
    return (
        <>
            <Modal title="Create Restaurant"
                open={isOpenModal}
                onOk={() => setIsOpenModal(false)}
                onCancel={() => setIsOpenModal(false)}
                maskClosable={false}
                footer={null}
                forceRender={true}

            >
                <Form
                    name = "verify" 
                    autoComplete="off"
                    layout="vertical"
                    form = {form}
                    onFinish={createRestaurants}
                    >
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
                        {role === "ADMIN" || role === "ADMINS" ?
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
                        <Select style={{ width: 140 }}
                                options={dataUser}
                        />
                    </Form.Item>
                    :
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
                        }

                        
                        <Form.Item style={{display: "flex", justifyContent: "flex-end", marginTop: 20, marginBottom: 0}}>
                            <Button type="primary" htmlType="submit">
                                CREATE
                            </Button>
                        </Form.Item>
                </Form>
                    
            </Modal>

        </>

    )

}

export default ModalCreateRestaurant