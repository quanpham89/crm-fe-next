"use client"
import { Modal, Steps, Form, Button, Input, message, notification, DatePicker, Row, Col, InputNumber } from "antd"
import { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import { sendRequest } from "@/utils/api";
import { useHasMounted } from "@/utils/customHook";
import { Select } from 'antd';
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';


const ModalCreateCoupon = (props: any) => {
    const { isOpenModal, setIsOpenModal, access_token, user } = props
    const [form] = Form.useForm()
    const router = useRouter()



    const createCoupon = async (values: any) => {
        dayjs.extend(utc);
        const convertedStarteDate = dayjs(values.rangeTime[0].$d).utc().format();
        const convertedEndedDate = dayjs(values.rangeTime[1].$d).utc().format();
        const {rangeTime, ...rest} = values
        const formatValue = {
            ...rest, 
            startedDate: convertedStarteDate,
            endedDate : convertedEndedDate,
            userCreateId: user?._id,
            createdBy: user.name ? user.name : user.email
        }

        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/coupons`,
            method: "POST",
            body: {
                ...formatValue
            },
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        },)
        if (res?.data) {
            notification.success({
                message: "Success",
                description: "Create coupon successfull."
            })
            window.location.reload()
        } else {
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
            <Modal title="Tạo Coupon"
                open={isOpenModal}
                onOk={() => setIsOpenModal(false)}
                onCancel={() => setIsOpenModal(false)}
                maskClosable={false}
                footer={null}
                forceRender={true}

            >
                <Form
                    name="verify"
                    autoComplete="off"
                    layout="vertical"
                    form={form}
                    onFinish={createCoupon}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Scope"
                                name="scope"
                                rules={[
                                    {
                                        required: true,
                                        message: "for can't be blank!",
                                    },
                                ]}
                            >
                                <Select

                                    options={[
                                        { value: 'FOOD', label: 'Food' },
                                        { value: 'DRINK', label: 'Drink' },
                                        { value: 'ALL', label: 'All' },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
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

                        <Col span={12}>
                            <Form.Item
                                label="Range Time"
                                name="rangeTime"
                                rules={[
                                    {
                                        required: true,
                                        message: "Range time can't be blank!",
                                    },
                                ]}
                            >

                                        <DatePicker.RangePicker

                                        placeholder={['From', 'To']}
                                        allowEmpty={[false, true]}
                                        onChange={(date, dateString) => {}}
                                    />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Discount"
                                name="discount"
                                rules={[
                                    {
                                        required: true,
                                        message: "Discount can't be blank!",
                                    },
                                ]}
                            >
                            <InputNumber min={1000} style={{width: "100%"}} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Name's coupon"
                        name="nameCoupon"
                        rules={[
                            {
                                required: true,
                                message: "Name's coupon can't be blank!",
                            },
                        ]}
                    >
                        <Input />
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
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Quantity"
                        name="amount"
                        rules={[
                            {
                                required: true,
                                message: "Quantity's coupon can't be blank!",
                            },
                        ]}
                    >
                        <InputNumber min={1} style={{width: "100%"}} max={15} />
                    </Form.Item>
                    <Form.Item style={{ display: "flex", justifyContent: "flex-end", marginTop: 20, marginBottom: 0 }}>
                        <Button type="primary" htmlType="submit">
                            CREATE
                        </Button>
                    </Form.Item>
                </Form>

            </Modal>

        </>

    )

}

export default ModalCreateCoupon