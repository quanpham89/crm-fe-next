"use client"
import { Modal, Steps, Form, Button, Input, message, notification, DatePicker, Row, Col } from "antd"
import { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import { sendRequest } from "@/utils/api";
import { useHasMounted } from "@/utils/customHook";
import { Select } from 'antd';
import { useRouter } from "next/navigation";

const ModalCreateVoucher =  (props: any) => {
    const { isOpenModal, setIsOpenModal, access_token } = props
    const [form] = Form.useForm()
    const [dataUser, setDataUser] = useState([])
    const router = useRouter()


    
    const createVoucher =  async(values : any) =>{
        console.log(values)
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/vouchers`,
            method: "POST",
            body: {
              ...values
            },
            headers: {
                "Authorization" : `Bearer ${access_token}`
            }
        },)
        if(res?.data){
            notification.success({
                message: "Success",
                description: "Create voucher successfll."
            })
            window.location.reload()
        }else{
            notification.error({
                message: "Error",
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
                    onFinish={createVoucher}
                    >
                        <Row gutter={16}>
                            <Col span={8}>
                            <Form.Item
                            label="For"
                            name="forAge"
                            rules={[
                                {
                                    required: true,
                                    message: "for can't be blank!",
                                },
                            ]}
                        >
                            <Select
                                
                                options={[
                                    { value: 'ADULT', label: 'Adult' },
                                    { value: 'CHILD', label: 'Children' },
                                    { value: 'ALL', label: 'All' },
                                 ]}
                                />
                        </Form.Item>
                            </Col>
                            <Col span={8}>
                            <Form.Item
                            label="Type"
                            name="type"
                            rules={[
                                {
                                    required: true,
                                    message: "type can't be blank!",
                                },
                            ]}
                        >
                            <Select
                                options={[
                                    { value: 'GIFT', label: 'Gift' },
                                    { value: 'ACCOUNT', label: 'Account' },
                                 ]}
                                />
                        </Form.Item>
                            </Col>

                            <Col span={8}>
                            <Form.Item
                            label="Status"
                            name="status"
                            rules={[
                                {
                                    required: true,
                                    message: "for can't be blank!",
                                },
                            ]}
                        >
                            <Select
                                
                                options={[
                                    { value: 'PUBLIC', label: 'Public' },
                                    { value: 'HIDDEN', label: 'Hidden' },
                                 ]}
                                />
                        </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            label="Name's voucher"
                            name="nameVoucher"
                            rules={[
                                {
                                    required: true,
                                    message: "Name's voucher can't be blank!",
                                },
                            ]}
                        >
                            <Input  />
                        </Form.Item>

                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: "Description can't be blank!",
                                },
                            ]}
                        >
                            <Input  />
                        </Form.Item>

                        <Form.Item
                            label="Quantity"
                            name="amount"
                            rules={[
                                {
                                    required: true,
                                    message: "Quantity's voucher can't be blank!",
                                },
                            ]}
                            >
                            <Input  />
                        </Form.Item>
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

export default ModalCreateVoucher