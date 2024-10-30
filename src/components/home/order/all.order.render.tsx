"use client"

import { helper } from "@/app/helpers/customize"
import { Button, Collapse, CollapseProps, Modal, Popover, Select, Steps, StepsProps } from "antd"
import dayjs from "dayjs"
import { useEffect, useState } from "react"
import Item from "../item/item"
import { useHasMounted } from "@/utils/customHook"
import "./order.scss";

const AllOrder = (props: any) => {
    const { orders } = props
    const [listOrder, setListOrder] = useState([])
    const [items, setItems] = useState<CollapseProps['items']>()
    const [isOpen, setIsOpen] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState<any>({});
    const getCurrentStatus = (statusOrder: string) => {
        switch (statusOrder) {
            case "PENDING":
                return "Đang chờ xác nhận.";
            case "ACCEPT":
                return "Chấp nhận đơn hàng.";
            case "PREPARE":
                return "Chuẩn bị hàng.";
            case "SENDING":
                return "Giao hàng.";
            case "DENIED":
                return "Từ chối.";

            default:
                return "";
        }
    }
    const getCurrenStep = (statusOrder: string)=>{
        switch (statusOrder) {
            case "PENDING":
                return 0;
            case "ACCEPT":
                return 1;
            case "PREPARE":
                return 2;
            case "SENDING":
                return 3;
            default:
                return 0;
        }

    }
    useEffect(() => {
        if (orders?.data) {
            const allOrder = orders.data.filter((item: any) => {
                return item.status !== "COMPLETE" && item.status !== "RECEIVE";
            });
            setListOrder(allOrder);
        }
    }, [orders?.data]);

    const handleOpenModal = (item : any) =>{
        const formatItem = item.orderDetail.map((item: any)=>{
            return {
                menuItemId: item.menuItem,
                nameItemMenu: item.nameItemMenu,
                restaurantName: item.restaurantName,
                nameMenu: item.nameMenu,
                amount: item.amount,
                sellingPrice: item.sellingPrice
            }
        })
        setSelectedOrder(formatItem)
        setIsOpen(true);
    }

    useEffect(() => {
        if (listOrder && listOrder.length > 0) {
            console.log(listOrder)
            const listItem = listOrder.map((item: any) => {
                return {
                    key: item._id,
                    label: dayjs(item.orderTime).format("hh:mm _ DD-MM-YYYY"),
                    children: <div>
                        <Steps
                        style={{marginBottom: 15}}
                            current={getCurrenStep(item?.status)}
                            items={[
                                {
                                    title: 'Đang chờ xác nhận',
                                },
                                {
                                    title: 'Chấp nhận đơn hàng',
                                },
                                {
                                    title: 'Chuẩn bị hàng',
                                },
                                {
                                    title: 'Giao hàng',
                                },
                            ]}
                        />
                        <p>
                            <span>Thanh toán: {helper.formatMoneyVND(item.totalWithoutDiscount)}</span>
                        </p>
                        <p>
                            <span>Trạng thái: {getCurrentStatus(item.status)}</span>
                        </p>
                        <p>
                            <span>Thời gian đặt: {dayjs(item.orderTime).format("hh:mm _ DD-MM-YYYY")}</span>
                        </p>
                        <p>
                            <span>Thời gian giao hàng: {dayjs(item.predictionTime).format("hh:mm _ DD-MM-YYYY")}</span>
                        </p>
                        <p>
                            <span>Địa chỉ: </span>
                            <span>{item.address}</span>
                        </p>
                        <p style={{display: "flex", justifyContent: "flex-end"}}>
                        <Button onClick={()=>handleOpenModal(item)}>Chi tiết đơn hàng</Button>
                        </p>

                    </div>
                }
            })
            setItems(listItem)
        }

    }, [listOrder])

    

    const hasMounted = useHasMounted();
    if (!hasMounted) return <></>;
    return <>
        <Collapse  items={items} />
        <Modal
                title="Chi tiết đơn hàng"
                open={isOpen}
                onOk={()=>setIsOpen(false)}
                onCancel={()=>setIsOpen(false)}
                maskClosable={false}
                footer={null}
                forceRender={true}
            >
                 <div className="cart-container">
                    {selectedOrder && selectedOrder.length > 0 &&
                        selectedOrder.map((i: any) => {
                            return  <Item key={i.menuItemId} product={i} />;
                        })
                    }

                 </div>
            </Modal>
        
    </>
}




export default AllOrder