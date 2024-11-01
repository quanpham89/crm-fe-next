"use client";

import { helper } from "@/app/helpers/customize";
import {
  Button,
  Collapse,
  CollapseProps,
  Modal,
  notification,
  Popover,
  Select,
  Steps,
  StepsProps,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Item from "../item/item";
import { useHasMounted } from "@/utils/customHook";
import "./history.scss";
import ModalConfirmHidden from "@/components/modalConfirm/modalConfirm.hidden";
import { handleReceiveOrder } from "@/utils/action";

const AllHistoryRender = (props: any) => {
  const { orders, user } = props;
  const [listOrder, setListOrder] = useState([]);
  const [items, setItems] = useState<CollapseProps["items"]>();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>({});
  const [isOpenModalConfirmReceive, setOpenModalConfirmReceive] =
    useState(false);
  const [currentOrderId, setCurrentOrderId] = useState("");

  const getCurrentStatus = (statusOrder: string) => {
    switch (statusOrder) {
      case "CANCEL":
        return "Hủy đơn";
      case "COMPLETE":
        return "Đã nhận đơn hàng.";
      case "DENIED":
        return "Từ chối";

      default:
        return "";
    }
  };
  const getCurrenStep = (statusOrder: string) => {
    switch (statusOrder) {
      case "CANCEL":
        return -1;
      case "PENDING":
        return 0;
      case "ACCEPT":
        return 1;
      case "PREPARE":
        return 2;
      case "SENDING":
        return 3;
      case "COMPLETE":
        return 4;
      default:
        return 0;
    }
  };
  useEffect(() => {
    if (orders?.data) {
      const allOrder = orders.data.filter((item: any) => {
        return item.status == "COMPLETE" || item.status == "CANCEL";
      });
      setListOrder(allOrder);
    }
  }, [orders?.data]);

  const handleOpenModal = (item: any) => {
    const formatItem = item.orderDetail.map((item: any) => {
      return {
        menuItemId: item.menuItem,
        nameItemMenu: item.nameItemMenu,
        restaurantName: item.restaurantName,
        nameMenu: item.nameMenu,
        amount: item.amount,
        sellingPrice: item.sellingPrice,
      };
    });
    setSelectedOrder(formatItem);
    setIsOpen(true);
  };

  useEffect(() => {
    if (listOrder && listOrder.length > 0) {
      const listItem = listOrder.map((item: any) => {
        return {
          key: item._id,
          label: dayjs(item.orderTime).format("hh:mm _ DD-MM-YYYY"),
          children: (
            <div>
              <Steps
                style={{ marginBottom: 15 }}
                current={getCurrenStep(item?.status)}
                items={[
                  {
                    title: "Đang chờ xác nhận",
                  },
                  {
                    title: "Chấp nhận đơn hàng",
                  },
                  {
                    title: "Chuẩn bị hàng",
                  },
                  {
                    title: "Giao hàng",
                  },
                  {
                    title: "Hoàn thành",
                  },
                ]}
              />
              <p>
                <span>
                  Thanh toán: {helper.formatMoneyVND(item.totalWithoutDiscount)}
                </span>
              </p>
              <p>
                <span>
                  Phương thức:{" "}
                  {item.paymentForm === "bank" ? "Chuyển khoản" : "Tiền mặt"}
                </span>
              </p>
              <p>
                <span>Trạng thái: {getCurrentStatus(item.status)}</span>
              </p>
              <p>
                <span>
                  Thời gian đặt:{" "}
                  {dayjs(item.orderTime).format("hh:mm _ DD-MM-YYYY")}
                </span>
              </p>
              <p>
                <span>
                  Thời gian giao hàng:{" "}
                  {dayjs(item.predictionTime).format("hh:mm _ DD-MM-YYYY")}
                </span>
              </p>
              <p>
                <span>Địa chỉ: </span>
                <span>{item.address}</span>
              </p>
              <p
                style={{ display: "flex", justifyContent: "flex-end", gap: 20 }}
              >
                <Button onClick={() => handleOpenModal(item)}>
                  Chi tiết đơn hàng
                </Button>
              </p>
            </div>
          ),
        };
      });
      setItems(listItem);
    }
  }, [listOrder]);

  const hasMounted = useHasMounted();
  if (!hasMounted) return <></>;
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 20,
          fontSize: 20,
          fontWeight: 600,
        }}
      >
        <span>Lịch sử mua hàng của tôi</span>
      </div>
      <Collapse items={items} />
      <Modal
        title="Chi tiết đơn hàng"
        open={isOpen}
        onOk={() => setIsOpen(false)}
        onCancel={() => setIsOpen(false)}
        maskClosable={false}
        footer={null}
        forceRender={true}
      >
        <div className="cart-container">
          {selectedOrder &&
            selectedOrder.length > 0 &&
            selectedOrder.map((i: any) => {
              return <Item key={i.menuItemId} product={i} />;
            })}
        </div>
      </Modal>
      <ModalConfirmHidden
        isOpenModalConfirmHidden={isOpenModalConfirmReceive}
        setOpenModalConfirmHidden={setOpenModalConfirmReceive}
        title={"Bạn có chắc chắn muốn hủy đơn hàng này không."}
        access_token={user?.access_token}
        type="CANCEL"
        currentItem={currentOrderId}
      />
    </>
  );
};

export default AllHistoryRender;
