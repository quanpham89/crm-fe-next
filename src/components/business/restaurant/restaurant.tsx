'use client'
import { Button, Checkbox, Descriptions, Form, Input, notification, Pagination, Select, Spin, Table } from "antd"
import { Children, use, useContext, useEffect, useState } from "react";
import { sendRequest } from "@/utils/api";
import ReactPaginate from "react-paginate";
import { BarsOutlined, CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { auth } from "@/auth";
import { BusinessContext } from "@/library/business.context";
import { useRouter } from "next/navigation";
import ModalCreateRestaurant from "@/components/restaurant/restaurant.create";
import ModalUpdateRestaurant from "@/components/business/restaurant/restaurant.update";
import ModalConfirmDelete from "@/components/modalConfirm/modalConfirm.delete";
import ModalConfirmActive from "@/components/modalConfirm/modalConfirm.active";
import ModalConfirmHidden from "@/components/modalConfirm/modalConfirm.hidden";
import { handleGetDataRestaurantById } from "@/utils/action";
import dayjs from "dayjs";

const RestaurantBusiness = (props: any) => {
    const { user } = props
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [isHaveRestaurant, setIsHaveRestaurant] = useState(false)
    const [currentRestaurant, setCurrentRestaurant] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [isOpenModalCreateRestaurant, setIsOpenModalCreateRestaurant] = useState(false)
    const [isOpenModalUpdateRestaurant, setIsOpenUpdateRestaurant] = useState(false)
    const [isOpenModalConfirmDelete, setOpenModalConfirmDelete] = useState<boolean>(false)
    const [isOpenModalConfirmHidden, setOpenModalConfirmHidden] = useState<boolean>(false)
    const [isOpenModalConfirmActive, setOpenModalConfirmActive] = useState<boolean>(false)
    const [dataRestaurant, setDataRestaurant] = useState<any>([])
    const [form] = Form.useForm()
    const { roleUsers, roleUser, setRoleUser } = useContext(BusinessContext)!;
    const router = useRouter()

    const getDataRestaurant = async (user: any) => {
        if (user) {
            const response: any = await handleGetDataRestaurantById(`api/v1/restaurants/get-restaurant-by-id?_id=${user._id}`, user?.access_token)
            if (response?.data.length > 0) {
                setIsHaveRestaurant(true)
                setIsLoading(false)
                setCurrentRestaurant({
                    isShow: response?.data[0].isShow,
                    _id: response?.data[0]._id,
                    address: response?.data[0].address,
                    phone:  response?.data[0].phone,
                    description:  response?.data[0].description,
                    restaurantName: response?.data[0].restaurantName,
                    productType: response?.data[0].productType,
                    userId: response?.data[0]?.user?._id

                })
                const formatData  = [
                    {
                        label: "Chủ sở hữu",
                        children: response?.data[0]?.user?.name
                    },
                    {
                        label: "Họ và tên",
                        children: response?.data[0]?.restaurantName
                    },
                    {
                        label: "Địa chỉ",
                        children: response?.data[0]?.address
                    },
                    {
                        label: "Số điện thoại",
                        children: response?.data[0]?.phone
                    },
                    {
                        label: "Trạng thái",
                        children: response?.data[0]?.isShow ? "Show": "Hidden"
                    },
                    {
                        label: "Đánh giá",
                        children: response?.data[0]?.rating
                    },
                    {
                        label: "Mô tả",
                        children: response?.data[0]?.description
                    },
                    {
                        label: "Tạo ngày",
                        children: dayjs(response?.data[0]?.createdAt).format('DD-MM-YYYY')
                         
                    },
                    {
                        label: "Loại sản phẩm",
                        children: response?.data[0]?.productType
                    },
                    {
                        label: "Số lượng menu",
                        children: response?.data[0]?.menu.length
                    },
                ]
    
                setDataRestaurant(formatData)
                
            }
        }
    }

    useEffect(() => {
        getDataRestaurant(user)
        setTimeout(()=>{
            setIsLoading(false)
        }, 500)
    },[])


    if (user?.role === "BUSINESSMAN") {

        return (isLoading ?
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Spin />
            </div>
            :
            <>
                {!isHaveRestaurant && <Button onClick={() => setIsOpenModalCreateRestaurant(true)}>Create Restaurant</Button>}
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 20,
                    fontSize: 20,
                    fontWeight: 600
                }}>
                    <span>Shop của tôi</span>
                    
                </div>

                <Descriptions  items={dataRestaurant} bordered/>

                {isHaveRestaurant &&
                    <div style={{ display: "flex", gap: 15, marginTop: 20, justifyContent: "flex-end"}}>
                    <Button onClick={()=>setOpenModalConfirmDelete(true)}>Delete</Button>
                    <Button onClick={()=> setOpenModalConfirmHidden(true)}>Disable</Button>
                    <Button onClick={()=>setOpenModalConfirmActive(true)}>Active</Button>
                    <Button onClick={()=>setIsOpenUpdateRestaurant(true)}>Update</Button>
                </div>}

                <ModalCreateRestaurant
                    isOpenModal={isOpenModalCreateRestaurant}
                    setIsOpenModal={setIsOpenModalCreateRestaurant}
                    currentRestaurant={currentRestaurant}
                    access_token={user?.access_token}
                    user= {user}
                />

                <ModalUpdateRestaurant
                    isOpenModalUpdateRestaurant={isOpenModalUpdateRestaurant}
                    setIsOpenUpdateRestaurant={setIsOpenUpdateRestaurant}
                    currentRestaurant={currentRestaurant}
                    access_token={user?.access_token}
                />
                <ModalConfirmDelete
                    isOpenModalConfirmDelete={isOpenModalConfirmDelete}
                    setOpenModalConfirmDelete={setOpenModalConfirmDelete}
                    title={`Bạn chắc chắn muốn xóa tài khoản bán hàng này vĩnh viễn ?`}
                    currentItem={currentRestaurant}
                    access_token={user?.access_token}
                    type="RESTAURANTS"
                />
                <ModalConfirmActive
                    isOpenModalConfirmActive={isOpenModalConfirmActive}
                    setOpenModalConfirmActive={setOpenModalConfirmActive}
                    title={`Bạn chắc chắn hiển thị tài khoản bán hàng này?`}
                    currentItem={currentRestaurant}
                    access_token={user?.access_token}
                    type="RESTAURANTS"
                />
                <ModalConfirmHidden
                    isOpenModalConfirmHidden={isOpenModalConfirmHidden}
                    setOpenModalConfirmHidden={setOpenModalConfirmHidden}
                    title={`Bạn chắc chắn muốn ẩn tài khoản bán hàng này?`}
                    currentItem={currentRestaurant}
                    access_token={user?.access_token}
                    type="RESTAURANTS"
                />
            </>
        )
    } else {
        return <>Bạn không có quyền truy cập vào chức năng này.</>
    }
}

export default RestaurantBusiness;