'use client'
import { Button, notification, Pagination, Spin, Table } from "antd"
import ModalCreateUser from "./user.create";
import { useContext, useEffect, useState } from "react";
import { sendRequest } from "@/utils/api";
import ReactPaginate from "react-paginate";
import "./User.scss"
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, MinusOutlined } from "@ant-design/icons";
import ModalUpdateUser from "./user.update";
import { auth } from "@/auth";
import ModalConfirmDelete from "@/components/modalConfirm/modalConfirm.delete";
import ModalConfirmHidden from "../modalConfirm/modalConfirm.hidden";
import { AdminContext } from "@/library/admin.context";

const UserTable = (props: any) => {
    const {role, access_token} = props
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [isOpenModalUpdateUser, setIsOpenUpdateUser] = useState(false)
    const [dataSource, setDataSource] = useState<any>([]);
    const [currentPage, setCurrentPage] = useState(1)
    const [currentLimit, setCurrentLimit] = useState(3)
    const [totalPages, setTotalPages] = useState<number>(1) 
    const [currentUser, setCurrentUser] = useState({})
    const [isLoading, setLoading] = useState(true)
    const [isOpenModalConfirmDelete, setOpenModalConfirmDelete] = useState<boolean>(false)
    const [isOpenModalConfirmHidden, setOpenModalConfirmHidden] = useState<boolean>(false)
    const { roleUsers, roleUser, setRoleUser } = useContext(AdminContext)!;
    setRoleUser(role)

    const fetchUserPerPage = async (page : number , limit : number) =>{
        const res = await sendRequest<IBackendRes<IUserPerPage>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users?current=${page}&pageSize=${limit}`,
            method: "GET",
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
            
        })
        if(res?.data?.results){          
            const users = Array.isArray(res.data.results) ? res.data.results : [res.data.results];

            const formatDataUser = users.map(item => ({
                ...item,
                activeIcon: item.isActive ? <CheckOutlined style={{fontSize: "16px", display: "flex", justifyContent: "center", color: "green"}}/> : <CloseOutlined style={{fontSize: "16px", display: "flex", justifyContent: "center", color: "red"}}/>
            }));
            setDataSource(formatDataUser);
            setTotalPages(+res?.data?.totalPages)
            setLoading(false)
        }else{
            notification.error({
                message: "Call APIs error",
                description: res?.message
            })
        }

    }
    <CheckOutlined />

    useEffect(()=>{
        fetchUserPerPage(currentPage, currentLimit)
    },[currentPage])

    const handlePageClick =  async(e : any) =>{
        setCurrentPage(e.selected + 1)
    }

    const handleEditUser =  async (record : any) =>{
        setIsOpenUpdateUser(true)
        setCurrentUser(record)
    }

    const handleUnActiveUser = async (record : any) =>{
        setOpenModalConfirmHidden(true)
        setCurrentUser(record)
        
    }

    const handleConfirmDeleteUser = (record: any) =>{
        console.log(record)
        setOpenModalConfirmDelete(true)
        setCurrentUser(record)
    }

    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
            key: '_id',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Sex',
            dataIndex: 'sex',
            key: 'sex',
        },
        {
            title: 'Status',
            dataIndex: 'activeIcon',
            key: 'activeIcon',
        },
        {
            title: 'Aaction',
            dataIndex: '',
            key: '',
            render: (text : string, record: any) =>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: 40, fontSize: 20}}>
                    <EditOutlined  onClick={()=>handleEditUser(record)}/>
                    <MinusOutlined onClick={()=>handleUnActiveUser(record)}/>
                    <DeleteOutlined onClick={()=>handleConfirmDeleteUser(record)}/>
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
                    <span>Manager Users</span>
                    <Button onClick={() => setIsOpenModal(true)}>Create User</Button>
                </div>
                <div style={{height: "50vh", overflowY: "scroll"}}>
                    <Table
                        bordered
                        dataSource={dataSource}
                        columns={columns}
                        pagination = {false}
                        rowKey= "_id"
                    />
    
                </div>
                {totalPages && totalPages > 0 &&
                    <div className="user-footer">
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
                <ModalCreateUser
                    isOpenModal = {isOpenModal}
                    setIsOpenModal = {setIsOpenModal}
                    access_token = {access_token}
                />
                
                <ModalUpdateUser
                    isOpenModalUpdateUser = {isOpenModalUpdateUser}
                    setIsOpenUpdateUser = {setIsOpenUpdateUser}
                    access_token = {access_token}
                    currentUser = {currentUser}
                />
                <ModalConfirmDelete 
                isOpenModalConfirmDelete = {isOpenModalConfirmDelete} 
                setOpenModalConfirmDelete= {setOpenModalConfirmDelete} 
                title = {`Bạn chắc chắn muốn xóa người dùng này vĩnh viễn ?`} 
                currentItem= {currentUser} 
                access_token = {access_token}
                type="USER"
                />
                 <ModalConfirmHidden
                isOpenModalConfirmHidden = {isOpenModalConfirmHidden} 
                setOpenModalConfirmHidden= {setOpenModalConfirmHidden} 
                title = {`Bạn chắc chắn muốn ẩn hủy kích hoạt người dùng này?`} 
                currentItem= {currentUser} 
                access_token = {access_token}
                type="USER"
                />


            </> 
        )
    }else{
        return <>Permission denied.</>
    }
}

export default UserTable;