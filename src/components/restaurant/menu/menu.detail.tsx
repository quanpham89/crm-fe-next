"use client"

import { AdminContext } from "@/library/admin.context"
import { handleGetData, handleGetDataPerPage } from "@/utils/action"
import { sendRequest } from "@/utils/api"
import { BarsOutlined, CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, MinusCircleOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Col, Descriptions, Form, Input, InputNumber, notification, Row, Space, Spin, Table, Upload } from "antd"
import { usePathname, useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import "../Pagination.scss"

const MenuDetail = (props: any) => {
    const { role, menuInfo, menuItems, user } = props
    const author = {
        userCreateId: menuInfo.userCreateId,
        createdBy: menuInfo.createdBy,
        restaurantId: menuInfo.restaurantId
    }
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [isOpenModalUpdateMenu, setIsOpenUpdateMenu] = useState(false)
    const [dataSource, setDataSource] = useState<any>([]);
    const [currentLimit, setCurrentLimit] = useState(3)
    const [totalPages, setTotalPages] = useState<number>(1)
    const [currentMenu, setCurrentMenu] = useState({})
    const [isLoading, setLoading] = useState(false)
    const [isOpenModalConfirmDelete, setOpenModalConfirmDelete] = useState<boolean>(false)
    const [isOpenModalConfirmHidden, setOpenModalConfirmHidden] = useState<boolean>(false)
    const { roleUsers, roleUser, setRoleUser } = useContext(AdminContext)!;
    setRoleUser(role)
    const router = useRouter()
    const pathName = usePathname()
    const [form] = Form.useForm()
    const formatItems  = [
        {
        key : "1",
        label: "Menu",
        children: menuInfo.nameMenu
        },
        {
            key : "2",
            label: "Status",
            children: menuInfo.status
        },
        {
            key : "4",
            label: "Create by",
            children: menuInfo.createdBy
        },
        {
            key : "3",
            label: "Description",
            children: menuInfo.description
        },
            
    ]

    
    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const handleMenuChange = (values : any) => {

    }

    console.log(menuItems)
    const formatValueMenuItem = menuItems.map((item:any)=>{
        return {
                nameItemMenu: item.nameItemMenu,
                description: item.description,
                fixedPrice: item.fixedPrice,
                sellingPrice: item.sellingPrice,
                image: [{
                    deleteUrl: item.deleteUrl,
                    url: item.image
                    }]
            }}
        )

    const initialValues = {
        menuItem: formatValueMenuItem
      };



    if (roleUsers.includes(roleUser)) {

        return (isLoading ?
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Spin />
            </div>
            :
            <>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20
                }}>
                    <span>Detail menu</span>
                </div>
                <div style={{ border: "1px solid #d9d9d9", padding: 15, borderRadius: 8, margin: 20,}}>  
                    <Descriptions title="Menu" items={formatItems} />
                </div>
                <div className="list-item-menu" style={{ border: "1px solid #d9d9d9", padding: 15, borderRadius: 8, margin: 20, height: "50vh" , overflow: "scroll"}}>
                <Form
                    name="verify"
                    autoComplete="off"
                    layout="vertical"
                    form={form}
                    onFinish={handleMenuChange}
                    initialValues={initialValues}
                    
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







                                        {/* <Form.Item
                                            name={[name, 'image']}
                                        >
                                            <Input placeholder="Url Image" />
                                        </Form.Item> */}
                                        
                                    </Space>
                                ))}

                                {fields.length < 10 && (
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

                </Form>



                </div>

            </>
        )
    } else {
        return <>Bạn không có quyền truy cập vào chức năng này.</>
    }
}



export default MenuDetail