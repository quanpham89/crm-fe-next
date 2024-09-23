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
    const { isOpenModalUpdateRestaurant, setIsOpenUpdateRestaurant, currentRestaurant } = props
    const [form] = Form.useForm()
    const router = useRouter()

    const updateUser =  async(values : any) =>{

        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/update`,
            method: "PATCH",
            body: {
                ...values
            },
        },)
        console.log(res)
        if(res?.data){
            notification.success({
                message: "Thành công",
                description: "Cập nhập người dùng thành công."
            })
            // router.push("/dashboard/user")
            window.location.reload()
        }else{
            notification.error({
                message: "Thất bại",
                description: res.message
            })
        }
    }
    useEffect(()=>{
        form.setFieldValue("_id", currentRestaurant._id)
        form.setFieldValue("email", currentRestaurant.email)
        form.setFieldValue("phone", currentRestaurant.phone)
        form.setFieldValue("name", currentRestaurant.name)
        form.setFieldValue("address", currentRestaurant.address)
        form.setFieldValue("accountType", currentRestaurant.accountType)
        form.setFieldValue("role", currentRestaurant.role)
        form.setFieldValue("sex", currentRestaurant.sex)



        
    }, [currentRestaurant])
    const hasMounted = useHasMounted();
    if (!hasMounted) return <></>;
    return (
        <>
            <Modal title="Tạo mới người dùng"
                open={isOpenModalUpdateRestaurant}
                onOk={() => setIsOpenUpdateRestaurant(false)}
                onCancel={() => setIsOpenUpdateRestaurant(false)}
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
                                    message: 'Id không được để trống!',
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
                                    message: 'Email không được để trống!',
                                },
                            ]}
                        >
                            <Input  />
                        </Form.Item>

                        <Form.Item
                            label="Số điện thoại"
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: 'Số điện thoại không được để trống!',
                                },
                            ]}
                        >
                            <Input  />
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            
                        >
                            <Input.Password  disabled/>
                        </Form.Item>

                        <Form.Item
                            label="Tên"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Tên không được để trống!',
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
                            label="Loại tài khoản"
                            name="accountType"
                        >
                            <Select
                                style={{ width: 140 }}
                                options={[
                                    { value: 'FREE', label: 'Miễn phí' },
                                    { value: 'PREMIUM', label: 'Cao cấp' },
                                    { value: 'BUSINESS', label: 'Kinh Doanh' },
                                ]}
                                />
                        </Form.Item>

                        <Form.Item
                            label="Phân quyền"
                            name="role"
                        >
                            <Select
                                style={{ width: 140 }}
                                options={[
                                    { value: 'ADMIN', label: 'Quản trị viên' },
                                    { value: 'USER', label: 'Người dùng' },
                                
                                ]}
                                />
                        </Form.Item>

                        <Form.Item
                            label="Giới tính"
                            name="sex"
                        >
                            <Select
                                style={{ width: 140 }}
                                options={[
                                    { value: 'MALE', label: 'Nam' },
                                    { value: 'FEMALE', label: 'Nữ' },
                                
                                ]}
                                />
                        </Form.Item>
                        </div>
                        <Form.Item style={{display: "flex", justifyContent: "flex-end"}}>
                            <Button type="primary" htmlType="submit">
                                Cập nhập người dùng
                            </Button>
                        </Form.Item>
                </Form>
                    
            </Modal>

        </>

    )

}

export default ModalUpdateRestaurant