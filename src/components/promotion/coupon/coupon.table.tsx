'use client'

import { sendRequest } from "@/utils/api";
import Icon, { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, MinusOutlined, PlusOutlined, ProfileOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Input, notification, Row, Select, Spin, Table } from "antd";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { use, useContext, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

import "../Pagination.scss"
import ModalCreateCoupon from "./coupon.create";
import ModalConfirmDelete from "@/components/modalConfirm/modalConfirm.delete";
import ModalConfirmHidden from "@/components/modalConfirm/modalConfirm.hidden";
import ModalConfirmActive from "@/components/modalConfirm/modalConfirm.active";
import { useRouter } from "next/navigation";
import { AdminContext } from "@/library/admin.context";

const CouponTable = (props: any) => {
    const [form] = Form.useForm()
    const { role, access_token, user, userCreateId } = props
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(true)
    const [totalPages, setTotalPages] = useState(1)
    const [dataSource, setDataSource] = useState<any>([])
    const [totalItems, setTotalItems] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [currentLimit, setCurrentLimit] = useState(5)
    const [isOpenCreateModal, setOpenCreateModal] = useState<boolean>(false)
    const [isOpenModalConfirmDelete, setOpenModalConfirmDelete] = useState<boolean>(false)
    const [isOpenModalConfirmHidden, setOpenModalConfirmHidden] = useState<boolean>(false)
    const [currentCoupon, setCurrentCoupon] = useState<any>("")
    const [isOpenModalConfirmActive, setOpenModalConfirmActive] = useState<boolean>(false)
    const [typeAction, setTypeAction] = useState<string>("NORMAL")
    const roleUsers = ["ADMINS", "ADMIN", "BUSINESSMAN"]

    const fetchCouponsPerPage = async (page: number, limit: number) => {
        const res = await sendRequest<IBackendRes<IUserPerPage>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/coupons?current=${page}&pageSize=${limit}&belongTo=${userCreateId}`,
            method: "GET",
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        })
        if (res?.data?.results) {
            const coupons = Array.isArray(res.data.results) ? res.data.results : [res.data.results];

            const formatData = coupons.map(item => {
                return ({
                    ...item,
                    activeIcon: item.status === "PUBLIC" ? <CheckOutlined style={{ fontSize: "16px", display: "flex", justifyContent: "center", color: "green" }} /> : <CloseOutlined style={{ fontSize: "16px", display: "flex", justifyContent: "center", color: "red" }} />
                })
            });
            setDataSource(formatData)
            setTotalPages(+res?.data?.totalPages)
            setTotalItems(+res?.data?.totalItems)
            setLoading(false)
        } else {
            notification.error({
                message: "Call APIs error",
                description: res?.message
            })
        }

    }

    useEffect(() => {
        fetchCouponsPerPage(+currentPage, +currentLimit)

    }, [currentPage])

    const handlePageClick = async (e: any) => {
        setCurrentPage(e.selected + 1)
    }


    const handleUnActiveCoupon = async (values: any) => {
        setCurrentCoupon(values)
        setOpenModalConfirmHidden(true)
    }

    const handleActiveCoupon = async (values: any) => {
        setCurrentCoupon(values)
        setOpenModalConfirmActive(true)
    }

    const handleConfirmDeleteCoupon = async (values: any) => {
        setCurrentCoupon(values)
        setOpenModalConfirmDelete(true)

    }

    const handleShowDetail = async (values: any) => {
        setCurrentCoupon(values)
        if(role === "ADMINS" || role === "ADMIN"){
            router.push(`/dashboard/promotion/coupon/${values._id}`)
        }else{
            router.push(`/business/promotion/coupon/${values._id}`)
        }

    }

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
        },
        {
            title: 'Name',
            dataIndex: 'nameCoupon',
            key: 'nameCoupon',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Discount',
            dataIndex: 'discount',
            key: 'discount',
        },
        {
            title: 'Scope',
            dataIndex: 'scope',
            key: 'scope',
        },
        {
            title: 'Status',
            dataIndex: 'activeIcon',
            key: 'activeIcon',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Create By',
            dataIndex: 'createdBy',
            key: 'createdBy',
        },
        {
            title: 'Action',
            dataIndex: '',
            key: '',
            render: (text: string, record: any) =>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 40, fontSize: 20 }}>
                    <ProfileOutlined  onClick={() => handleShowDetail(record)} />
                    <MinusOutlined onClick={() => handleUnActiveCoupon(record)} />
                    <PlusOutlined onClick={() => handleActiveCoupon(record)} />
                    <DeleteOutlined onClick={() => handleConfirmDeleteCoupon(record)} />
                </div>
        },
    ];

    const search = async (values: any) => {
        setLoading(true)
        setTypeAction("SEARCH")


        let {time, ...rest} = values
        let formatvalue = {                
            ...rest,
        }

        if(values?.time){
            dayjs.extend(utc);
            const convertStartedDate = dayjs(values.time[0].$d).utc().format();
            const convertEndedDate = dayjs(values.time[1].$d).utc().format();
            formatvalue = {
                ...rest,
                startedTime: convertStartedDate,
                endedTime: convertEndedDate
            }

        }
    
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/coupons/search?searchValue=${JSON.stringify(formatvalue)}&belongTo=${userCreateId}`,
            method: "GET",
            headers: {
                "Authorization": `Bearer ${access_token}`
            }

        })
        if (res?.data) {
            const coupon = Array.isArray(res.data.coupons) ? res.data.coupons : [res.data.coupons];

            const formatData = coupon.map((item : any) => {
                return ({
                    ...item,
                    activeIcon: item.status === "PUBLIC" ? <CheckOutlined style={{ fontSize: "16px", display: "flex", justifyContent: "center", color: "green" }} /> : <CloseOutlined style={{ fontSize: "16px", display: "flex", justifyContent: "center", color: "red" }} />
                })
            });
            notification.success({
                message: "Success",
                description: `Có ${formatData.length} kết quả ứng với giá trị tìm kiếm.`
            })
            setDataSource(formatData)
            setLoading(false)
        } else {
            setLoading(false)
            notification.error({
                message: "Call APIs error",
                description: res?.message
            })
        }
    }

    const handleRefresh = async()=>{
        setLoading(true)
        await fetchCouponsPerPage(+currentPage, +currentLimit)
        form.resetFields()
    }

    if (roleUsers.includes(role)) {

        return (!loading ?
            <div >
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                    alignContent: "center"
                }}>
                    <span>Manager Coupon</span>
                    <Button onClick={() => setOpenCreateModal(true)}>Create Coupon</Button>
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
                                    label="Name's coupon"
                                    name="nameCoupon"
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Pin code's coupon"
                                    name="_id"
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Scope"
                                    name="scope"
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Discount"
                                    name="discount"
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Range Time"
                                    name="time"
                                >
                                    <DatePicker.RangePicker
                                        placeholder={['From', 'To']}
                                        allowEmpty={[false, true]}
                                        onChange={(date, dateString) => {}}
                                        style={{width: "100%"}}
                                    />
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
                <Button  htmlType="submit" style={{marginBottom: 20}} onClick={()=>handleRefresh()}>Refresh</Button>

                <div style={{ height: "50vh", overflowY: "scroll" }}>
                    <Table
                        bordered
                        dataSource={dataSource}
                        columns={columns}
                        pagination={false}
                        rowKey="_id"
                    />
                    {totalPages && totalPages > 0 && typeAction !== "SEARCH" &&
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
                    <ModalCreateCoupon
                        isOpenModal={isOpenCreateModal}
                        setIsOpenModal={setOpenCreateModal}
                        access_token={access_token}
                        user = {user}
                    />
                    <ModalConfirmDelete
                        isOpenModalConfirmDelete={isOpenModalConfirmDelete}
                        setOpenModalConfirmDelete={setOpenModalConfirmDelete}
                        title={`Bạn chắc chắn muốn xóa coupon này vĩnh viễn ?`}
                        currentItem={currentCoupon}
                        access_token={access_token}
                        type="COUPON"
                    />
                    <ModalConfirmActive
                        isOpenModalConfirmActive={isOpenModalConfirmActive}
                        setOpenModalConfirmActive={setOpenModalConfirmActive}
                        title={`Bạn chắc chắn muốn kích hoạt coupon này?`}
                        currentItem={currentCoupon}
                        access_token={access_token}
                        type="COUPON"
                    />

                    <ModalConfirmHidden
                        isOpenModalConfirmHidden={isOpenModalConfirmHidden}
                        setOpenModalConfirmHidden={setOpenModalConfirmHidden}
                        title={`Bạn chắc chắn muốn hủy kích hoạt coupon này?`}
                        currentItem={currentCoupon}
                        access_token={access_token}
                        type="COUPON"
                    />

                </div>

            </div>
            :
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Spin />
            </div>
        )





    } else {
        <div> You must have permission to access this function.</div>
    }

}

export default CouponTable