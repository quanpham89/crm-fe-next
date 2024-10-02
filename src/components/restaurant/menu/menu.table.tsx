"use client"

import { AdminContext } from "@/library/admin.context"
import { handleGetData } from "@/utils/action"
import { sendRequest } from "@/utils/api"
import { BarsOutlined, CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, MinusOutlined } from "@ant-design/icons"
import { Button, notification, Spin, Table } from "antd"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import ReactPaginate from "react-paginate"


const MenuTable = (props : any) =>{
    const {role, access_token} = props
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [isOpenModalUpdateRestaurant, setIsOpenUpdateRestaurant] = useState(false)
    const [dataSource, setDataSource] = useState<any>([]);
    const [currentPage, setCurrentPage] = useState(1)
    const [currentLimit, setCurrentLimit] = useState(3)
    const [totalPages, setTotalPages] = useState<number>(1) 
    const [currentRestaurant, setCurrentRestaurant] = useState({})
    const [isLoading, setLoading] = useState(true)
    const [isOpenModalConfirmDelete, setOpenModalConfirmDelete] = useState<boolean>(false)
    const [isOpenModalConfirmHidden, setOpenModalConfirmHidden] = useState<boolean>(false)
    const { roleUsers, roleUser, setRoleUser } = useContext(AdminContext)!;
    setRoleUser(role)
    const router = useRouter()



    const fetchRestaurantPerPage = async (page : number , limit : number) =>{
        const res = await handleGetData(`api/v1/menus?current=${currentPage}&pageSize=${limit}`, access_token )
        if(res?.data?.results){    
            const menus = Array.isArray(res.data.results) ? res.data.results : [res.data.results];

            const formatData = menus.map(item =>{ 
                const {user, ...rest} = item
                return ({
                ...rest,
                userId: item?.user?._id,
                email: item?.user?.email,
                name: item?.user?.name,
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
        fetchRestaurantPerPage(currentPage, currentLimit)
    },[currentPage])

    const handlePageClick =  async(e : any) =>{
        setCurrentPage(e.selected + 1)
    }

    const handleEditRestaurant =  async (record : any) =>{
        setIsOpenUpdateRestaurant(true)
        setCurrentRestaurant(record)
    }

    const handleUnActiveRestaurant = async(record : any) =>{
        setOpenModalConfirmHidden(true)
        setCurrentRestaurant(record)
    }
    

    const handleConfirmDeleteRestaurant = async (record : any) =>{
        setOpenModalConfirmDelete(true)
        setCurrentRestaurant(record)
    }

    const handleOpenCreateMenu = (record : any) =>{
        setCurrentRestaurant(record)
        console.log(record)
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
            dataIndex: 'menuName',
            key: 'menuName',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Rating ?/10',
            dataIndex: 'rating',
            key: 'rating',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Product',
            dataIndex: 'productType',
            key: 'productType',
        },
        {
            title: 'Menu',
            dataIndex: 'menu-name',
            key: 'menu-name',
        },
        {
            title: 'Owner',
            dataIndex: 'name',
            key: 'name',
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
                    <EditOutlined  onClick={()=>handleEditRestaurant(record)}/>
                    <BarsOutlined  onClick={()=>handleOpenCreateMenu(record)}/>
                    <MinusOutlined onClick={()=>handleUnActiveRestaurant(record)}/>
                    <DeleteOutlined onClick={()=>handleConfirmDeleteRestaurant(record)}/>
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
                    <span>Manager Restaurants</span>
                    <Button onClick={() => setIsOpenModal(true)}>Create Restaurant</Button>
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
                {/* <ModalCreateRestaurant
                    isOpenModal = {isOpenModal}
                    setIsOpenModal = {setIsOpenModal}
                />
                <ModalUpdateRestaurant
                    isOpenModalUpdateRestaurant = {isOpenModalUpdateRestaurant}
                    setIsOpenUpdateRestaurant = {setIsOpenUpdateRestaurant}
                    currentRestaurant = {currentRestaurant}
                    access_token = {access_token}
                />
                <ModalConfirmDelete 
                isOpenModalConfirmDelete = {isOpenModalConfirmDelete} 
                setOpenModalConfirmDelete= {setOpenModalConfirmDelete} 
                title = {`Bạn chắc chắn muốn xóa tài khoản bán hàng này vĩnh viễn ?`} 
                currentItem= {currentRestaurant} 
                access_token = {access_token}
                type="RESTAURANTS"
                />
                <ModalConfirmHidden
                isOpenModalConfirmHidden = {isOpenModalConfirmHidden} 
                setOpenModalConfirmHidden= {setOpenModalConfirmHidden} 
                title = {`Bạn chắc chắn muốn ẩn tài khoản bán hàng này?`} 
                currentItem= {currentRestaurant} 
                access_token = {access_token}
                type="RESTAURANTS"
                /> */}
            </> 
        )
    }else{
        return <>Bạn không có quyền truy cập vào chức năng này.</>
    }
}

export default MenuTable