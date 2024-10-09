"use client";

import { AdminContext } from "@/library/admin.context";
import { handleGetData, handleGetDataPerPage } from "@/utils/action";
import { sendRequest } from "@/utils/api";
import {
    BarsOutlined,
    CheckOutlined,
    CloseOutlined,
    DeleteOutlined,
    EditOutlined,
    MinusCircleOutlined,
    MinusOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import {
    Button,
    Col,
    Descriptions,
    Form,
    Input,
    InputNumber,
    notification,
    Row,
    Select,
    Space,
    Spin,
    Table,
    Upload,
} from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import "../Pagination.scss";

const MenuDetailCreate = (props: any) => {
    const {restaurantId, role, access_token} = props
    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };
    const handleCreateItem = (values: any) =>{
        console.log(values)
    }
    return (
        <Form
            name="verify"
            autoComplete="off"
            layout="vertical"
            onFinish={handleCreateItem}
        >
            <Form.List
                name="menuItem"
            >
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }) => (
                            <Space key={key} style={{ display: 'block', marginBottom: 16 }} >
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item valuePropName="fileList"  getValueFromEvent={normFile} name={[name, 'image']}>
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
                                        <MinusCircleOutlined onClick={() => remove(name)} style={{ cursor: 'pointer', fontSize: '24px' }} />
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
                                            rules={[{ required: true, message: 'Missing Description', }]}
                                        >
                                            <Input placeholder="Description" />
                                        </Form.Item>
                                    </Col>

                                </Row>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            name={[name, 'fixedPrice']}
                                            rules={[{ required: true, message: 'Missing fixed price', }]}
                                        >
                                            <InputNumber min={1000} placeholder="Fixed price" style={{ width: "100%" }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name={[name, 'sellingPrice']}
                                            rules={[{ required: true, message: 'Missing selling price', }]}
                                        >
                                            <InputNumber min={1000} placeholder="Selling price" style={{ width: "100%" }} />
                                        </Form.Item>
                                    </Col>
                                </Row>
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
    );
};

export default MenuDetailCreate;
