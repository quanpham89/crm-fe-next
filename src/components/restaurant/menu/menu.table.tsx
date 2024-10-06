"use client"

import { AdminContext } from "@/library/admin.context"
import { handleGetData, handleGetDataPerPage } from "@/utils/action"
import { sendRequest } from "@/utils/api"
import { BarsOutlined, CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, MinusOutlined } from "@ant-design/icons"
import { Button, notification, Spin, Table } from "antd"
import { usePathname, useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import "../Pagination.scss"

import ReactPaginate from "react-paginate"
import ModalCreateMenu from "./menu.create"
import ModalConfirmDelete from "@/components/modalConfirm/modalConfirm.delete"
import ModalConfirmHidden from "@/components/modalConfirm/modalConfirm.hidden"
import ModalUpdateMenu from "./menu.update"


const MenuTable = (props : any) =>{
    const {role, access_token, dataRestaurant, user} = props
    const author = {
        userCreateId : user._id,
        createdBy: user.name,
        restaurantId: dataRestaurant[0]._id
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
    const { roleUsers, roleUser, setRoleUser } = useContext(AdminContext)!;
    setRoleUser(role)
    const router = useRouter()
    const pathName = usePathname()



    const fetchMenuPerPage = async (page : number , limit : number) =>{
        const res = await handleGetDataPerPage(`api/v1/menus?current=${currentPage}&pageSize=${limit}`, access_token, { next: { tags: "dataMenu" } })
        if(res?.data?.results){    
            const menus = Array.isArray(res.data.results) ? res.data.results : [res.data.results];

            const formatData = menus.map(item =>{ 
                const {user, ...rest} = item
                return ({
                ...rest,

                activeIcon: item.status ? <CheckOutlined style={{fontSize: "16px", display: "flex", justifyContent: "center", color: "green"}}/> : <CloseOutlined style={{fontSize: "16px", display: "flex", justifyContent: "center", color: "red"}}/>
            })});
            setDataSource(formatData)
            setTotalPages(+res?.data?.totalPages)
            setLoading(false)
        }else{
            notification.error({
                message: "Call APIs error",
                description: res?.message
            })
        }

    }

    useEffect(()=>{
        fetchMenuPerPage(currentPage, currentLimit)
    },[currentPage])

    const handlePageClick =  async(e : any) =>{
        setCurrentPage(e.selected + 1)
    }

    const handleEditMenu =  async (record : any) =>{
        const menuId = record._id
        setCurrentMenu(record)
        router.push(`${pathName}/detailMenu/${menuId}`);

    }

    const handleUnActiveMenu = async(record : any) =>{
        setOpenModalConfirmHidden(true)
        setCurrentMenu(record)
    }
    

    const handleConfirmDeleteMenu = async (record : any) =>{
        setOpenModalConfirmDelete(true)
        setCurrentMenu(record)
    }

    const handleOpenCreateMenu = (record : any) =>{
        setCurrentMenu(record)
        router.push(`/dashboard/menu/${record._id}/menu`);


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
            title: 'Action',
            dataIndex: '',
            key: '',
            render: (text : string, record: any) =>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: 40, fontSize: 20}}>
                    <EditOutlined  onClick={()=>handleEditMenu(record)}/>
                    <MinusOutlined onClick={()=>handleUnActiveMenu(record)}/>
                    <DeleteOutlined onClick={()=>handleConfirmDeleteMenu(record)}/>
                </div>
        },
        
    ];
    if(roleUsers.includes(roleUser)) {
        
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
                    <Button onClick={() => setIsOpenModal(true)}>Create Menu</Button>
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
                {totalPages && totalPages > 0 &&
                    <div className="footer">
                        <ReactPaginate
                            nextLabel=">"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={3}
                            marginPagesDisplayed={2}
                            pageCount={totalPages}
                            previousLabel="<"
                            pageClassName="page-item"
                            pageLinkClassName="page-link"
                            previousClassName="page-item"
                            previousLinkClassName="page-link"
                            nextClassName="page-item"
                            nextLinkClassName="page-link"
                            breakLabel="..."
                            breakClassName="page-item"
                            breakLinkClassName="page-link"
                            containerClassName="pagination"
                            activeClassName="active"
                            renderOnZeroPageCount={null}
                        />
                    </div>
                    }
                <ModalCreateMenu
                    isOpenModal = {isOpenModal}
                    setIsOpenModal = {setIsOpenModal}
                    access_token = {access_token}
                    // retaurantId = {pathName}
                    author = {author}
                    setLoading= {setLoading}


                />
                {/* <ModalUpdateMenu
                    isOpenModalUpdateMenu = {isOpenModalUpdateMenu}
                    setIsOpenUpdateMenu = {setIsOpenUpdateMenu}
                    currentMenu = {currentMenu}
                    access_token = {access_token}
                /> */}
                <ModalConfirmDelete 
                isOpenModalConfirmDelete = {isOpenModalConfirmDelete} 
                setOpenModalConfirmDelete= {setOpenModalConfirmDelete} 
                title = {`Bạn chắc chắn muốn xóa tài khoản bán hàng này vĩnh viễn ?`} 
                currentItem= {currentMenu} 
                access_token = {access_token}
                type="RESTAURANTS"
                />
                <ModalConfirmHidden
                isOpenModalConfirmHidden = {isOpenModalConfirmHidden} 
                setOpenModalConfirmHidden= {setOpenModalConfirmHidden} 
                title = {`Bạn chắc chắn muốn ẩn tài khoản bán hàng này?`} 
                currentItem= {currentMenu} 
                access_token = {access_token}
                type="RESTAURANTS"
                /> 
            </> 
        )
    }else{
        return <>Bạn không có quyền truy cập vào chức năng này.</>
    }
}

export default MenuTable