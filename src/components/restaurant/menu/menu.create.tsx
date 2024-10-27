"use client"
import { Modal, Steps, Form, Button, Input, message, notification, DatePicker, Row, Col, Space, Upload, InputNumber } from "antd"
import { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import { sendRequest } from "@/utils/api";
import { useHasMounted } from "@/utils/customHook";
import { Select } from 'antd';
import { useRouter } from "next/navigation";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const ModalCreateMenu = (props: any) => {
    const { isOpenModal, setIsOpenModal, access_token, author, setLoading} = props

    const [form] = Form.useForm()
    const [dataUser, setDataUser] = useState([])
    const router = useRouter()
    // useEffect(()=>{
    //     form.setFieldValue("_id", currentMenu._id)
    //     form.setFieldValue("email", currentMenu.email)
    //     form.setFieldValue("phone", currentMenu.phone)
    //     form.setFieldValue("name", currentMenu.name)
    //     form.setFieldValue("address", currentMenu.address)
    //     form.setFieldValue("accountType", currentMenu.accountType)
    //     form.setFieldValue("role", currentMenu.role)
    //     form.setFieldValue("sex", currentMenu.sex)




    // }, [currentMenu])

    const createMenus = async (values: any) => {
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menus`,
            method: "POST",
            body: {
                ...values,
                ...author
            },
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        },)
        
        // setLoading(true)
        if (res?.data) {
            notification.success({
                message: "Thành công",
                description: "Tạo thành công."
            })
            setLoading(false)
            setIsOpenModal(false)
            form.resetFields()
            window.location.reload()
        } else {
            notification.error({
                message: "Thất bại",
                description: res.message
            })
        }
    }
    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const hasMounted = useHasMounted();
    if (!hasMounted) return <></>;
    return (
        <>
            <Modal title="Create Menu"
                open={isOpenModal}
                onOk={() => setIsOpenModal(false)}
                onCancel={() => setIsOpenModal(false)}
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
                    onFinish={createMenus}
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
                    <Form.Item
                        label="Description's menu"
                        name="description"
                        rules={[
                            {
                                required: true,
                                message: "Description's menu can't be blank!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <label>Item</label>
                    <Form.List
                        name="menuItem"
                        

                    >
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} style={{ display: 'block', marginBottom: 16 }} >
                                        <Row gutter={16}>
                                            <Col span={12}>
                                            <Form.Item valuePropName="fileList" getValueFromEvent={normFile} name={[name, 'image']}>
                                            <Upload
                                                listType="picture-card"
                                                accept="image/png, image/jpeg"
                                                maxCount={1}
                                                showUploadList={{
                                                    showPreviewIcon: false
                                                }}>
                                                <button style={{ border: 0, background: 'none' }} type="button">
                                                    <PlusOutlined />
                                                    <div style={{ marginTop: 8 }}>Upload</div>
                                                </button>
                                            </Upload>
                                        </Form.Item>
                                            </Col>
                                            <Col span={11}></Col>
                                            <Col span={1}>
                                                <MinusCircleOutlined onClick={() => remove(name)}   style={{ cursor: 'pointer', fontSize: '24px' }}/>
                                            </Col>
                                        </Row>
                                        
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Form.Item
                                                    name={[name, 'nameItemMenu']}
                                                    rules={[{ required: true, message: 'Missing name' }]}
                                                >
                                                    <Input placeholder="Name" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    name={[name, 'description']}
                                                    rules={[{ required: true, message: 'Missing Description',}]}
                                                >
                                                    <Input placeholder="Description" />
                                                </Form.Item>
                                            </Col>

                                        </Row>
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Form.Item
                                                    name={[name, 'fixedPrice']}
                                                    rules={[{ required: true, message: 'Missing fixed price',  }]}
                                                >
                                                    <InputNumber min={1000} placeholder="Fixed price"  style={{width: "100%"}}/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    name={[name, 'sellingPrice']}
                                                    rules={[{ required: true, message: 'Missing selling price',  }]}
                                                >
                                                    <InputNumber min={1000}  placeholder="Selling price"  style={{width: "100%"}} />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Form.Item
                                                    name={[name, 'quantity']}
                                                    rules={[{ required: true, message: 'Số lượng không được để trống',  }]}
                                                >
                                                    <InputNumber max={1000} min = {1} placeholder="Số lượng"  style={{width: "100%"}}/>
                                                </Form.Item>








                                        {/* <Form.Item
                                            name={[name, 'image']}
                                        >
                                            <Input placeholder="Url Image" />
                                        </Form.Item> */}
                                        
                                    </Space>
                                ))}

                                {fields.length < 3 && (
                                    <Form.Item>
                                        <Button
                                            type="dashed"
                                            onClick={() => add()}
                                            block
                                            icon={<PlusOutlined />}
                                        >
                                            Add item
                                        </Button>
                                    </Form.Item>
                                )}
                            </>
                        )}
                    </Form.List>




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

export default ModalCreateMenu