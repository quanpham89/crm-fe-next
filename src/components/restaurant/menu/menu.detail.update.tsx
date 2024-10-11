"use client"

import { AdminContext } from "@/library/admin.context"
import { handleGetData, handleGetDataPerPage } from "@/utils/action"
import { sendRequest } from "@/utils/api"
import { BarsOutlined, CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, MinusCircleOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Col, Descriptions, Form, Input, InputNumber, notification, Row, Space, Spin, Table, Upload } from "antd"
import { usePathname, useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import "../Pagination.scss"

const MenuDetailUpdate = (props: any) => {
    const { role, menuItems, user, access_token } = props
    
    const [isLoading, setLoading] = useState(false)
    const { roleUsers, roleUser, setRoleUser } = useContext(AdminContext)!;
    setRoleUser(role)
    const router = useRouter()
    const pathName = usePathname()
    const [form] = Form.useForm()
    

    const [idItemChange, setIdItemChange] = useState<any>([])


    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

  

    const formatValueMenuItem = menuItems.map((item: any) => {
        return {
            nameItemMenu: item.nameItemMenu,
            description: item.description,
            fixedPrice: item.fixedPrice,
            sellingPrice: item.sellingPrice,
            _id: item._id,
            image: [{
                deleteUrl: item.deleteUrl,
                url: item.image
            }]
        }
    }
    )


    const initialValues = {
        menuItem: formatValueMenuItem
    };

    const valuechange = ( changedValues: any, allValues : any)=>{
        for (const key in changedValues.menuItem) {
            if(changedValues.menuItem[key]){
                setIdItemChange((value:any)=>[...value, menuItems[key]._id])
            }
        }
   
    }

    const handleMenuChange = async (values: any) => {
        const uniqueIdItemsFilter = idItemChange.filter((item:any, index:any) => idItemChange.indexOf(item) === index);
        const filteredMenuItemChange = values.menuItem.filter((item: any) => uniqueIdItemsFilter.includes(item._id));
        if(filteredMenuItemChange && filteredMenuItemChange.length>0){
            const response = await sendRequest<IBackendRes<any>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menu-items/update-menu-item`,
                method: "POST",
                body:{
                    ...filteredMenuItemChange
                },
                headers: {
                    "Authorization": `Bearer ${access_token}`
                },
                    
            })
            if(response && response.statusCode === 201){
                notification.success({
                    message: "Update Item Success"
                })

            }
        }

    }

    if (roleUsers.includes(roleUser)) {

        return (isLoading ?
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Spin />
            </div>
            :
            <>
                <div className="list-item-menu" style={{ border: "1px solid #d9d9d9", padding: 15, borderRadius: 8, margin: 20, height: "61vh",  }}>
                    <Form
                        name="verify"
                        autoComplete="off"
                        layout="vertical"
                        form={form}
                        onFinish={handleMenuChange}
                        initialValues={initialValues}
                        onValuesChange= {(changedValues, allValues)=>valuechange(changedValues, allValues)}
                    >
                        <div style={{padding: "10px", height: "56vh", overflow: "scroll" }}>
                            <Form.List
                                name="menuItem"
                            >
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Space key={key} style={{ display: 'block', marginBottom: 16 }} >
                                                <Form.Item
                                                            name={[name, '_id']}
                                                            rules={[{ required: true, message: 'Missing _id' }]}
                                                            hidden
                                                        >
                                                            <Input disabled/>
                                                        </Form.Item>
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
                                                    <Col span={1}></Col>
                                                </Row>

                                                <Row gutter={16}>
                                                    <Col span={12}>
                                                        <Form.Item
                                                            name={[name, 'nameItemMenu']}
                                                            rules={[{ required: true, message: 'Missing name' }]}
                                                        >
                                                            <Input placeholder="Name"/>
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
                                    </>
                                )}
                            </Form.List>

                        
                        
                        
                        </div>
                        <Form.Item style={{display: "flex", justifyContent: "flex-end", marginBottom: 0 }}>
                            <Button type="primary" htmlType="submit">
                                Change
                            </Button>
                        </Form.Item>


                    </Form>



                </div>

            </>
        )
    } else {
        return <>Bạn không có quyền truy cập vào chức năng này.</>
    }
}



export default MenuDetailUpdate