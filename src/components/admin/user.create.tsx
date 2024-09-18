"use client"
import { Modal, Steps, Form, Button, Input, message, notification, DatePicker } from "antd"
import { CheckCircleOutlined, LoadingOutlined, SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import { sendRequest } from "@/utils/api";
import { useHasMounted } from "@/utils/customHook";
import { Select, Space } from 'antd';
import dayjs from "dayjs";

const ModalCreateUser = (props: any) => {
    const { isOpenModal, setIsOpenModal } = props
    const [form] = Form.useForm()
    const [dataCreateUser, setDataCreateUser]= useState({})

    const createUser =  (values : any) =>{
        let dateString = values.birthday.$d;
        let formatdate =  dayjs(dateString).format('DD/MM/YYYY');
       
        values.birthday = formatdate

        console.log(values)



        
        
    }
    const hasMounted = useHasMounted();
    if (!hasMounted) return <></>;
    return (
        <>
            <Modal title="Kích hoạt tài khoản của bạn"
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
                        onFinish={createUser}
                        >
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
                                rules={[
                                    {
                                        required: true,
                                        message: 'Mật khẩu không được để trống!',
                                    },
                                ]}
                            >
                                <Input.Password  />
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
                                    style={{ width: 100 }}
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
                                    style={{ width: 120 }}
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
                                    style={{ width: 80 }}
                                    options={[
                                        { value: 'MALE', label: 'Nam' },
                                        { value: 'FEMALE', label: 'Nữ' },
                                    
                                    ]}
                                    />
                            </Form.Item>

                            <Form.Item
                                label="Ngày sinh"
                                name="birthday"
                            >
                                <DatePicker
                                    format={{
                                        format: 'YYYY-MM-DD',
                                        type: 'mask',
                                    }}
                                    />
                            </Form.Item>

                            
                            </div>

                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Tạo người dùng
                                </Button>
                            </Form.Item>

                        </Form>
            </Modal>

        </>

    )

}

export default ModalCreateUser