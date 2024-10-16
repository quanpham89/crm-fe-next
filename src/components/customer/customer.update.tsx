"use client"
import { Modal, Steps, Form, Button, Input, message, notification, DatePicker } from "antd"
import { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import { sendRequest } from "@/utils/api";
import { useHasMounted } from "@/utils/customHook";
import { Select, Space } from 'antd';
import { useRouter } from "next/navigation";

const ModalUpdateCustomer =  (props: any) => {
    const {access_token} = props
    const { isOpenModalUpdateCustomer, setIsOpenUpdateCustomer, currentCustomer } = props
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
                message: "Success",
                description: "Update user successfull."
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
        form.setFieldValue("_id", currentCustomer._id)
        form.setFieldValue("email", currentCustomer.email)
        form.setFieldValue("phone", currentCustomer.phone)
        form.setFieldValue("name", currentCustomer.name)
        form.setFieldValue("address", currentCustomer.address)
        form.setFieldValue("accountType", currentCustomer.accountType)
        form.setFieldValue("role", currentCustomer.role)
        form.setFieldValue("sex", currentCustomer.sex)



        
    }, [currentCustomer])
    const hasMounted = useHasMounted();
    if (!hasMounted) return <></>;
    return (
        <>
            <Modal title="Update user"
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
                                    message: "Email can't be blank!",
                                },
                            ]}
                        >
                            <Input  disabled/>
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
                            label="Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Name can't be blank!",
                                },
                            ]}
                        >
                            <Input  />
                        </Form.Item>

                        <Form.Item
                            label="Address"
                            name="address">
                            <Input  />
                        </Form.Item>

                        <div style={{display: "flex", justifyContent: "space-between"}}>
                        

                        <Form.Item
                            label="Sex"
                            name="sex"
                        >
                            <Select
                                style={{ width: 140 }}
                                options={[
                                    { value: 'MALE', label: 'Male' },
                                    { value: 'FEMALE', label: 'Female' },
                                    { value: 'OTHER', label: 'Other' },
                                ]}
                                />
                        </Form.Item>
                        </div>
                        <Form.Item style={{display: "flex", justifyContent: "flex-end"}}>
                            <Button type="primary" htmlType="submit">
                                Update user
                            </Button>
                        </Form.Item>
                </Form>
                    
            </Modal>

        </>

    )

}

export default ModalUpdateCustomer