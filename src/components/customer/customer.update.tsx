"use client"
import { Modal, Steps, Form, Button, Input, message, notification, DatePicker } from "antd"
import { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import { sendRequest } from "@/utils/api";
import { useHasMounted } from "@/utils/customHook";
import { Select, Space } from 'antd';
import { useRouter } from "next/navigation";

const ModalUpdateCustomer =  (props: any) => {
    const { isOpenModalUpdateCustomer, setIsOpenUpdateCustomer, currentCustomer, access_token} = props
    const [form] = Form.useForm()
    const router = useRouter()

    const updateUser =  async(values : any) =>{

        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/update`,
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
                message: "Cập nhập người dùng thành công.",
            })
            window.location.reload()
        }else{
            notification.error({
                message: "Error",
                description: res.message
            })
        }
    }
    useEffect(()=>{
        form.setFieldValue("_id", currentCustomer?._id)
        form.setFieldValue("email", currentCustomer?.email)
        form.setFieldValue("phone", currentCustomer?.phone)
        form.setFieldValue("name", currentCustomer?.name)
        form.setFieldValue("address", currentCustomer?.address)
        form.setFieldValue("accountType", currentCustomer?.accountType)
        form.setFieldValue("role", currentCustomer?.role)
        form.setFieldValue("sex", currentCustomer?.sex)



        
    }, [currentCustomer])
    const hasMounted = useHasMounted();
    if (!hasMounted) return <></>;
    return (
        <>
            <Modal title="Cập nhập người dùng"
                open={isOpenModalUpdateCustomer}
                onOk={() => setIsOpenUpdateCustomer(false)}
                onCancel={() => setIsOpenUpdateCustomer(false)}
                maskClosable={false}
                footer={null}
                forceRender={true}

            >
                <Form
                    name = "update" 
                    autoComplete="off"
                    layout="vertical"
                    form = {form}
                    onFinish={updateUser}
                    >
                        <Form.Item
                            label="Id"
                            name="_id"
                            hidden
                            rules={[
                                {
                                    required: true,
                                    message: "Id can't be blank!",
                                },
                            ]}
                        >
                            <Input  disabled/>
                        </Form.Item>
                        <Form.Item
                        
                            label="Email"
                            name="email"
                            
                            rules={[
                                {
                                    required: true,
                                    message: "Email không được để trống!",
                                },
                            ]}
                        >
                            <Input  disabled/>
                        </Form.Item>

                        <Form.Item
                            label="Số điện thoại"
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: "Số điện thoại không được để trống!",
                                },
                            ]}
                        >
                            <Input  />
                        </Form.Item>


                        <Form.Item
                            label="Tên"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Tên không được để trống!",
                                },
                            ]}
                        >
                            <Input  />
                        </Form.Item>

                        <Form.Item
                            label="Địa chỉ"
                            name="address">
                            <Input  />
                        </Form.Item>

                        <div style={{display: "flex", justifyContent: "space-between"}}>
                        
                        <Form.Item
                            label="Giới tính"
                            name="sex"
                            style={{ width: "100%" }}

                        >
                            <Select
                                style={{ width: "100%" }}
                                options={[
                                    { value: 'MALE', label: 'Nam' },
                                    { value: 'FEMALE', label: 'Nữ' },
                                    { value: 'OTHER', label: 'Khác' },
                                ]}
                                />
                        </Form.Item>
                        </div>
                        <Form.Item style={{display: "flex", justifyContent: "flex-end"}}>
                            <Button htmlType="submit">
                                Cập nhập người dùng
                            </Button>
                        </Form.Item>
                </Form>
                    
            </Modal>

        </>

    )

}

export default ModalUpdateCustomer