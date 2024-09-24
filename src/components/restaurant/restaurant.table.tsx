'use client'
import { Button, notification, Pagination, Spin, Table } from "antd"
import { useEffect, useState } from "react";
import { sendRequest } from "@/utils/api";
import ReactPaginate from "react-paginate";
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, MinusOutlined } from "@ant-design/icons";
import { auth } from "@/auth";
import ModalUpdateRestaurant from "./restaurant.update";
import ModalCreateRestaurant from "./restaurant.create";
import "./Restaurant.scss"
import ModalConfirmDelete from "../modalConfirm/modalConfirm.delete";

const RestaurantTable = (props: any) => {
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


    

    const fetchRestaurantPerPage = async (page : number , limit : number) =>{
        const res = await sendRequest<IBackendRes<IUserPerPage>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/restaurants?current=${page}&pageSize=${limit}`,
            method: "GET",
            
        })
        if(res?.data?.results){    
            const restaurants = Array.isArray(res.data.results) ? res.data.results : [res.data.results];

            const formatData = restaurants.map(item =>{ 
                const {user, ...rest} = item
                return ({
                ...rest,
                userId: item?.user?._id,
                email: item?.user?.email,
                name: item?.user?.name,
                activeIcon: item.isShow ? <CheckOutlined style={{fontSize: "16px", display: "flex", justifyContent: "center", color: "green"}}/> : <CloseOutlined style={{fontSize: "16px", display: "flex", justifyContent: "center", color: "red"}}/>
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
        if(!record.isShow){
            notification.success({
                message: "Ẩn tài khoản bán hàng",
                description: "Tài khoản hiện đang không kích hoạt."
            })
            return
        }
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/restaurants/soft-delete?_id=${record._id}`,
            method: "PATCH",
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
        if(res?.data){          
            notification.success({
                message: "Hủy kích hoạt tài khoản thành công.",
                description: res?.message
            })
            window.location.reload()
        }else{
            notification.error({
                message: "Call APIs error",
                description: res?.message
            })
        }
    }
    

    const handleConfirmDeleteRestaurant = async (record : any) =>{
        setOpenModalConfirmDelete(true)
        setCurrentRestaurant(record)
    }


    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
            key: '_id',
        },
        {
            title: "Name's restaurant",
            dataIndex: 'restaurantName',
            key: 'restaurantName',
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
            title: 'Aaction',
            dataIndex: '',
            key: '',
            render: (text : string, record: any) =>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: 40, fontSize: 20}}>
                    <EditOutlined  onClick={()=>handleEditRestaurant(record)}/>
                    <MinusOutlined onClick={()=>handleUnActiveRestaurant(record)}/>
                    <DeleteOutlined onClick={()=>handleConfirmDeleteRestaurant(record)}/>
                </div>

            
        },
        
    ];
    if(role === "ADMIN") {
        
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
                <div style={{minHeight: "50vh"}}>
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
                <ModalCreateRestaurant
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
                currentRestaurant= {currentRestaurant} 
                access_token = {access_token}
                type="RESTAURANTS"
                />
            </> 
        )
    }else{
        return <>Bạn không có quyền truy cập vào chức năng này.</>
    }
}

export default RestaurantTable;