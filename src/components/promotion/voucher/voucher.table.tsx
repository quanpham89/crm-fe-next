'use client'

import { Button, Col, Form, Input, Row, Select, Table } from "antd";

const VoucherTable = (props: any) => {
    const [form] = Form.useForm()

    const dataSource = [
        {
            key: '1',
            name: 'Mike',
            age: 32,
            address: '10 Downing Street',
        },
        {
            key: '2',
            name: 'John',
            age: 42,
            address: '10 Downing Street',
        },
    ];

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
    ];

    const search = () => {

    }


    return (
        <div >
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
                alignContent: "center"
            }}>
                <span>Manager Voucher</span>
                <Button onClick={() => console.log(31212)}>Create Voucher</Button>
            </div>

            <div>
                <Form
                    name="search"
                    autoComplete="off"
                    layout="vertical"
                    form={form}
                    onFinish={search}
                    
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Name's voucher"
                                name="restaurantName"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Pin code's voucher"
                                name="_id"
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                       
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Type"
                                name="type"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="For"
                                name="for"
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        
                    </Row>

                    <Form.Item style={{ display: "flex", justifyContent: "flex-end", marginTop: 20, marginBottom: 20 }}>
                        <Button type="primary" htmlType="submit">
                            Search
                        </Button>
                    </Form.Item>
                </Form>

            </div>

            <div style={{ minHeight: "50vh" }}>
                <Table
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false}
                    rowKey="_id"
                />

            </div>

        </div>
    )
}

export default VoucherTable