"use client"
import { Modal, Steps, Form, Button, Input, message, notification, DatePicker, Row, Col, Space, Upload, InputNumber } from "antd"
import { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import { sendRequest } from "@/utils/api";
import { useHasMounted } from "@/utils/customHook";
import { Select } from 'antd';
import { useRouter } from "next/navigation";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const ModalChooseMenu = (props: any) => {
    const { isOpenModalChooseMenu, setIsOpenChooseMenu, access_token, author, setLoading} = props

    const [form] = Form.useForm()
    const [dataUser, setDataUser] = useState([])
    const router = useRouter()

    const openMenu = async()=>{
        
    }
   


    const hasMounted = useHasMounted();
    if (!hasMounted) return <></>;
    return (
        <>
            <Modal title="Update Menu"
                open={isOpenModalChooseMenu}
                onOk={() => setIsOpenChooseMenu(false)}
                onCancel={() => setIsOpenChooseMenu(false)}
                maskClosable={false}
                footer={null}
                forceRender={true}
                width={"70%"}
            >
                <Form
                    name="verify"
                    autoComplete="off"
                    layout="vertical"
                    form={form}
                    onFinish={openMenu}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Name's Menu"
                                name="nameMenu"
                                rules={[
                                    {
                                        required: true,
                                        message: "Name's menu can't be blank!",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Status"
                                name="status"
                                rules={[
                                    {
                                        required: true,
                                        message: "Status can't be blank!",
                                    },
                                ]}
                            >
                                <Select
                                    style={{ width: "100%" }}
                                    options={[
                                        { value: 'HIDDEN', label: 'Hidden' },
                                        { value: 'PUBLIC', label: 'Public' },
                                    ]}
                                />
                            </Form.Item>

                        </Col>
                    </Row>
                  
                    <label>Choose the menu</label>
                </Form>

            </Modal>

        </>

    )

}

export default ModalChooseMenu