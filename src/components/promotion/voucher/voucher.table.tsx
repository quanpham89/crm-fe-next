'use client'

import { sendRequest } from "@/utils/api";
import Icon, { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, MinusOutlined, PlusOutlined, ProfileOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Input, notification, Row, Select, Spin, Table } from "antd";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { use, useContext, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

import "../Pagination.scss"
import ModalCreateVoucher from "./voucher.create";
import ModalConfirmDelete from "@/components/modalConfirm/modalConfirm.delete";
import ModalConfirmHidden from "@/components/modalConfirm/modalConfirm.hidden";
import ModalConfirmActive from "@/components/modalConfirm/modalConfirm.active";
import { useRouter } from "next/navigation";
import { AdminContext } from "@/library/admin.context";

const VoucherTable = (props: any) => {
    const [form] = Form.useForm()
    const { role, access_token, user } = props
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
    const [currentVoucher, setCurrentVoucher] = useState<any>("")
    const [isOpenModalConfirmActive, setOpenModalConfirmActive] = useState<boolean>(false)
    const [typeAction, setTypeAction] = useState<string>("NORMAL")
    const { roleUsers, roleUser, setRoleUser } = useContext(AdminContext)!;
    setRoleUser(role)

    const fetchVouchersPerPage = async (page: number, limit: number) => {
        const res = await sendRequest<IBackendRes<IUserPerPage>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/vouchers?current=${page}&pageSize=${limit}`,
            method: "GET",
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        })
        if (res?.data?.results) {
            const vouchers = Array.isArray(res.data.results) ? res.data.results : [res.data.results];

            const formatData = vouchers.map(item => {
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
        fetchVouchersPerPage(+currentPage, +currentLimit)

    }, [currentPage])

    const handlePageClick = async (e: any) => {
        setCurrentPage(e.selected + 1)
    }


    const handleUnActiveVoucher = async (values: any) => {
        setCurrentVoucher(values)
        setOpenModalConfirmHidden(true)
    }

    const handleActiveVoucher = async (values: any) => {
        setCurrentVoucher(values)
        setOpenModalConfirmActive(true)
    }

    const handleConfirmDeleteVoucher = async (values: any) => {
        setCurrentVoucher(values)
        setOpenModalConfirmDelete(true)

    }

    const handleShowDetail = async (values: any) => {
        setCurrentVoucher(values)
        router.push(`/dashboard/promotion/voucher/${values._id}`)

    }

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
        },
        {
            title: 'Name',
            dataIndex: 'nameVoucher',
            key: 'nameVoucher',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'For',
            dataIndex: 'forAge',
            key: 'forAge',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
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
            title: 'Percentage',
            dataIndex: 'percentage',
            key: 'percentage',
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
                    <MinusOutlined onClick={() => handleUnActiveVoucher(record)} />
                    <PlusOutlined onClick={() => handleActiveVoucher(record)} />
                    <DeleteOutlined onClick={() => handleConfirmDeleteVoucher(record)} />
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
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/vouchers/search?searchValue=${JSON.stringify(formatvalue)}`,
            method: "GET",
            headers: {
                "Authorization": `Bearer ${access_token}`
            }

        })
        if (res?.data) {
            const voucher = Array.isArray(res.data.vouchers) ? res.data.vouchers : [res.data.vouchers];

            const formatData = voucher.map((item : any) => {
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
        await fetchVouchersPerPage(+currentPage, +currentLimit)
        form.resetFields()
    }

    if (roleUsers.includes(roleUser)) {

        return (!loading ?
            <div >
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                    alignContent: "center"
                }}>
                    <span>Manager Voucher</span>
                    <Button onClick={() => setOpenCreateModal(true)}>Create Voucher</Button>
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
                                    label="Name's voucher"
                                    name="nameVoucher"
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Pin code's voucher"
                                    name="_id"
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Type"
                                    name="type"
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="For"
                                    name="forAge"
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
                    <ModalCreateVoucher
                        isOpenModal={isOpenCreateModal}
                        setIsOpenModal={setOpenCreateModal}
                        access_token={access_token}
                        user = {user}
                    />
                    <ModalConfirmDelete
                        isOpenModalConfirmDelete={isOpenModalConfirmDelete}
                        setOpenModalConfirmDelete={setOpenModalConfirmDelete}
                        title={`Bạn chắc chắn muốn xóa voucher này vĩnh viễn ?`}
                        currentItem={currentVoucher}
                        access_token={access_token}
                        type="VOUCHER"
                    />
                    <ModalConfirmActive
                        isOpenModalConfirmActive={isOpenModalConfirmActive}
                        setOpenModalConfirmActive={setOpenModalConfirmActive}
                        title={`Bạn chắc chắn muốn kích hoạt voucher này?`}
                        currentItem={currentVoucher}
                        access_token={access_token}
                        type="VOUCHER"
                    />

                    <ModalConfirmHidden
                        isOpenModalConfirmHidden={isOpenModalConfirmHidden}
                        setOpenModalConfirmHidden={setOpenModalConfirmHidden}
                        title={`Bạn chắc chắn muốn hủy kích hoạt voucher này?`}
                        currentItem={currentVoucher}
                        access_token={access_token}
                        type="VOUCHER"
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

export default VoucherTable