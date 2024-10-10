"use client"

import { AdminContext } from "@/library/admin.context"
import { handleDeleteDataMenu, handleGetData, handleGetDataMenu, handleGetDataPerPage } from "@/utils/action"
import { sendRequest } from "@/utils/api"
import { BarsOutlined, CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, MinusCircleOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Col, Descriptions, Form, Input, InputNumber, notification, Row, Space, Spin, Table, TableColumnsType, Upload, Image  } from "antd"
import { usePathname, useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import "../Pagination.scss"
import { TableRowSelection } from "antd/es/table/interface"

interface DataType {
    key: React.Key;
    name: string;
    age: number;
    address: string;
    image: any
}
const MenuDetailDelete = (props: any) => {
    const {menuInfo, role, access_token} = props
    const [dataSource, setDataSource] = useState<any>([])
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [isLoading, setIsLoading] = useState(true)
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
    });
    
    const getMenuItem = async() =>{
        const response = await handleGetDataMenu(`api/v1/menus/get-menu-by-id?_id=${menuInfo.menuId}`, access_token,  { next: { tags: "menuItem" } })
        console.log(response.data)
        if (response){
            const formatData = response?.data[0]?.menuItem.map((item : any, index : number)=>{
                return {
                    key: item._id,
                    nameItemMenu : item.nameItemMenu,
                    image : <Image alt = "image" width={60} src={`${item.image}`}/>,
                    sellingPrice : item.sellingPrice,
                    fixedPrice : item.fixedPrice,
                    description : item.description
                }
            })
            setDataSource(formatData)
            setIsLoading(false)
        }else{
            setTimeout(()=>{
                setIsLoading(false)
                notification.error({
                    message: "Call API error"
                })
            }, 1000)
        }
    }
    useEffect(()=>{
        getMenuItem()
    }, [pagination])
      
    const columns: TableColumnsType<DataType> = [
        {
          title: 'Name',
          dataIndex: 'nameItemMenu',
        },
        {
            title: 'Image',
            dataIndex: 'image',
        },
        {
          title: 'Selling Price',
          dataIndex: 'sellingPrice',
        },
        {
          title: 'Fixed Price',
          dataIndex: 'fixedPrice',
        },
        {
            title: 'Description',
            dataIndex: 'description',
        }
    ];
      
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection: TableRowSelection<DataType> = {
        selectedRowKeys,
        onChange: onSelectChange,
        selections: [
        Table.SELECTION_NONE,
        ],
    };

   

    const handleTableChange = (pagination: any) => {
        setPagination({
            current: pagination.current,
            pageSize: pagination.pageSize,
        });
    };

    const handleDeleteMenuItem = async () =>{
        let itemDelete = [...selectedRowKeys]
        if(itemDelete.length > 0){
            const response = await handleDeleteDataMenu(`api/v1/menus/get-menu-by-id?_id=${menuInfo.menuId}`, itemDelete,  access_token, "menuItem")
        }else{
            notification.error({
                message: "Please choose at least 1 item to delete."
            })

        }
    }

    return ( !isLoading ? 
    <>
            <Table  
            columns={columns} 
            dataSource={dataSource}  
            rowSelection={rowSelection}
            pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: dataSource.length,
                onChange: (page, pageSize) => handleTableChange({ current: page, pageSize }),
            }}
            />
            <div style ={{display: "flex", justifyContent: "flex-end"}}>
                <Button onClick={handleDeleteMenuItem}>Delete</Button>
            </div>
    </> : 
    <div style={{display: "flex", justifyContent:"center", alignItems: "center"}}>
        <Spin/>
    </div>
    )
  
}



export default MenuDetailDelete