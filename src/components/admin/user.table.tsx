'use client'
import { Button, notification, Pagination, Table } from "antd"
import ModalCreateUser from "./user.create";
import { useEffect, useState } from "react";
import { sendRequest } from "@/utils/api";
import ReactPaginate from "react-paginate";
import "./User.scss"
import { EditOutlined } from "@ant-design/icons";
import ModalUpdateUser from "./user.update";

const UserTable = () => {
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [isOpenModalUpdateUser, setIsOpenUpdateUser] = useState(false)
    const [dataSource, setDataSource] = useState<any>([]);
    const [currentPage, setCurrentPage] = useState(2)
    const [currentLimit, setCurrentLimit] = useState(3)
    const [totalPages, setTotalPages] = useState<number>(1) 
    const [currentUser, setCurrentUser] = useState({})

    const fetchUserPerPage = async (page : number , limit : number) =>{
        const res = await sendRequest<IBackendRes<IUserPerPage>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users?current=${page}&pageSize=${limit}`,
            method: "GET",
            
        })
        if(res?.data?.results){            
            setDataSource(res?.data?.results)
            setTotalPages(+res?.data?.totalPages)
        }else{
            notification.error({
                message: "Call APIs error",
                description: res?.message
            })
        }

    }

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
            dataIndex: 'isActive',
            key: 'isActive',
        },
        {
            title: 'Update',
            dataIndex: '',
            key: '',
            render: (text : string, record: any) => <EditOutlined style={{fontSize: "16px", display: "flex", justifyContent: "center"}} onClick={()=>handleEditUser(record)}/>,
        },
        
    ];

    return (
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
            />
            <ModalUpdateUser
                isOpenModalUpdateUser = {isOpenModalUpdateUser}
                setIsOpenUpdateUser = {setIsOpenUpdateUser}
                currentUser = {currentUser}
            />
        </>
    )
}

export default UserTable;