"use client"

import { AdminContext } from "@/library/admin.context"
import { handleGetData, handleGetDataPerPage } from "@/utils/action"
import { sendRequest } from "@/utils/api"
import { BarsOutlined, CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, MinusOutlined, PlusOutlined, UnorderedListOutlined } from "@ant-design/icons"
import { Button, Descriptions, notification, Spin, Table, Tabs } from "antd"
import { usePathname, useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"


import ModalConfirmDelete from "@/components/modalConfirm/modalConfirm.delete"
import ModalConfirmHidden from "@/components/modalConfirm/modalConfirm.hidden"
import ModalConfirmActive from "@/components/modalConfirm/modalConfirm.active"
import ModalChooseMenu from "@/components/restaurant/menu/menu.choose"
import ModalCreateMenu from "@/components/restaurant/menu/menu.create"
import MenuDetailUpdate from "@/components/restaurant/menu/menu.detail.update"
import MenuDetailCreate from "@/components/restaurant/menu/menu.detail.create"
import MenuDetailDelete from "@/components/restaurant/menu/menu.detail.delete"
import ModalMenuUpdate from "@/components/restaurant/menu/menu.update"
import dayjs from "dayjs"


const MenuRestaurant = (props : any) =>{
    const {role, access_token, dataRestaurant, menu} = props
    const author = {
        userCreateId : dataRestaurant?.user._id,
        createdBy: dataRestaurant?.user.name,
        restaurantId: dataRestaurant._id
    }


    const [isOpenModal, setIsOpenModal] = useState(false)
    const [isOpenModalUpdateMenu, setIsOpenUpdateMenu] = useState(false)
    const [dataSource, setDataSource] = useState<any>([]);
    const [currentPage, setCurrentPage] = useState(1)
    const [currentLimit, setCurrentLimit] = useState(3)
    const [totalPages, setTotalPages] = useState<number>(1) 
    const [currentMenu, setCurrentMenu] = useState({})
    const [isLoading, setLoading] = useState(true)
    const [isOpenModalConfirmDelete, setOpenModalConfirmDelete] = useState<boolean>(false)
    const [isOpenModalConfirmHidden, setOpenModalConfirmHidden] = useState<boolean>(false)
    const [isOpenModalConfirmActive, setOpenModalConfirmActive] = useState<boolean>(false)

    const router = useRouter()
    const pathName = usePathname()



    useEffect(()=>{
        setLoading(false)
        const formatData = menu.map((item: any) =>{ 
            const {user, ...rest} = item
            return ({
            ...rest,
            createdAt: dayjs(item.createdAt).format("DD-MM-YYYY"),
            activeIcon: item.status==="PUBLIC" ? <CheckOutlined style={{fontSize: "16px", display: "flex", justifyContent: "center", color: "green"}}/> : <CloseOutlined style={{fontSize: "16px", display: "flex", justifyContent: "center", color: "red"}}/>
        })});
        setDataSource(formatData)
    },[])


    const handleEditMenu =  async (record : any) =>{
        setIsOpenUpdateMenu(true)
        setCurrentMenu(record)

    }

    const handleUnActiveMenu = async(record : any) =>{
        setOpenModalConfirmHidden(true)
        setCurrentMenu(record)
    }

    const handleActiveMenu = (record : any)=>{
        setOpenModalConfirmActive(true)
        setCurrentMenu(record)
    }
    

    const handleConfirmDeleteMenu = async (record : any) =>{
        setOpenModalConfirmDelete(true)
        setCurrentMenu(record)
    }

    const HandleDetailMenu = (record : any) =>{
        router.push(`${pathName}/${record._id}`)
    }

    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
            key: '_id',
        },
        {
            title: "Name's menu",
            dataIndex: 'nameMenu',
            key: 'nameMenu',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'status',
            dataIndex: 'activeIcon',
            key: 'activeIcon',
        },
        {
            title: 'Create At',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: 'Action',
            dataIndex: '',
            key: '',
            render: (text : string, record: any) =>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: 40, fontSize: 20}}>
                    <EditOutlined  onClick={()=>handleEditMenu(record)}/>
                    <UnorderedListOutlined onClick={()=>HandleDetailMenu(record)}/>
                    <MinusOutlined onClick={()=>handleUnActiveMenu(record)}/>         
                    <PlusOutlined onClick={() => handleActiveMenu(record)} />
                    <DeleteOutlined onClick={()=>handleConfirmDeleteMenu(record)}/>
                </div>
        },
        
    ];
    if(role === "BUSINESSMAN") {
        
        return (isLoading ?
            <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
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
                    <span>Manage Menu</span>
                    {menu.length < 5 && <Button onClick={() => setIsOpenModal(true)}>Create Menu</Button>}
                </div>
                <div className="table" >
                    <Table
                        bordered
                        dataSource={dataSource}
                        columns={columns}
                        pagination = {false}
                        rowKey= "_id"
                    />
    
                </div>
                <ModalCreateMenu
                    isOpenModal = {isOpenModal}
                    setIsOpenModal = {setIsOpenModal}
                    access_token = {access_token}
                    author = {author}
                    setLoading= {setLoading}


                />
                <ModalMenuUpdate
                    isOpenModal = {isOpenModalUpdateMenu}
                    setIsOpenModal = {setIsOpenUpdateMenu}
                    access_token = {access_token}
                    currentMenu={currentMenu}
                />
                <ModalConfirmDelete 
                    isOpenModalConfirmDelete = {isOpenModalConfirmDelete} 
                    setOpenModalConfirmDelete= {setOpenModalConfirmDelete} 
                    title = {`Bạn chắc chắn muốn menu này vĩnh viễn ?`} 
                    currentItem= {currentMenu} 
                    access_token = {access_token}
                    type="MENU"
                />
                <ModalConfirmHidden
                    isOpenModalConfirmHidden = {isOpenModalConfirmHidden} 
                    setOpenModalConfirmHidden= {setOpenModalConfirmHidden} 
                    title = {`Bạn chắc chắn muốn ẩn menu này?`} 
                    currentItem= {currentMenu} 
                    access_token = {access_token}
                    type="MENU"
                /> 
                <ModalConfirmActive
                    isOpenModalConfirmActive = {isOpenModalConfirmActive} 
                    setOpenModalConfirmActive= {setOpenModalConfirmActive} 
                    title = {`Bạn chắc chắn hiển thị menu này?`} 
                    currentItem= {currentMenu} 
                    access_token = {access_token}
                    type="MENU"
                />
            </> 
        )
    }else{
        return <>Bạn không có quyền truy cập vào chức năng này.</>
    }
}

export default MenuRestaurant