"use client";
import {
  Modal,
  Form,
  Button,
  Input,
  message,
  notification,
  Steps,
  Card,
} from "antd";
import { sendRequest } from "@/utils/api";
import { useHasMounted } from "@/utils/customHook";
import {
  BankOutlined,
  CheckOutlined,
  ContainerOutlined,
  LoadingOutlined,
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { helper } from "@/app/helpers/customize";
import "./Home.scss";
import dayjs from "dayjs";

const ModalConfirmOrder = (props: any) => {
  const { isOpenModalConfirmOrder, setIsOpenModalConfirmOrder, title, data } =
    props;
  const [currentStep, setCurrentStep] = useState(1);
  const hasMounted = useHasMounted();
  if (!hasMounted) return <></>;
  const confirm = () => {};

  return (
    <Modal
      title={title}
      open={isOpenModalConfirmOrder}
      onOk={() => setIsOpenModalConfirmOrder(false)}
      onCancel={() => setIsOpenModalConfirmOrder(false)}
      maskClosable={false}
      footer={null}
      forceRender={true}
      width={1000}
    >
      <Steps
        current={currentStep}
        style={{ marginTop: "25px" }}
        items={[
          {
            title: "Thông tin",
            icon: <ContainerOutlined />,
          },

          {
            title: "Kiểm tra",
            icon: <CheckOutlined />,
          },
          ...(data?.paymentForm === "bank"
            ? [
                {
                  title: "Chuyển khoản",
                  icon: <LoadingOutlined />,
                },
              ]
            : []),

          {
            title: "Hòa thành",
            icon: <SmileOutlined />,
          },
        ]}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 20,
          fontSize: 16,
        }}
      >
        <span>Số lượng: </span>
        <span> {data?.cart?.length}</span>
      </div>
      <div className="bill-info">
        <p className="bill-info-list">
          <span>Địa chỉ nhận hàng: </span> <span>{data?.address}</span>
        </p>
        <p className="bill-info-list">
          <span>Thời gian đặt hàng: </span>{" "}
          <span>{dayjs(data?.orderTime).format("DD-MM-YYYY")}</span>
        </p>
        <p className="bill-info-list">
          <span>Thời gian nhận hàng: </span>{" "}
          <span>{dayjs(data?.predictionTime).format("DD-MM-YYYY")}</span>
        </p>
        <p className="bill-info-list">
          <span>Voucher: </span>{" "}
          <span>
            {data?.voucher && data?.voucher !== undefined ? "1" : "0"}
          </span>
        </p>
        <p className="bill-info-list">
          <span>Coupon: </span>{" "}
          <span>{data?.coupon && data?.coupon !== undefined ? "1" : "0"}</span>
        </p>
        <p className="bill-info-list">
          <span>Tổng tiền: </span>{" "}
          <span>{helper.formatMoneyVND(data?.total)}</span>
        </p>
      </div>
      <div className="cart-container">
        {data &&
          data.cart &&
          data.cart.length > 0 &&
          data.cart.map((item: any, index: number) => {
            return (
              <Card
                key={item.menuItemId}
                title={item.nameItemMenu}
                style={{ width: "100%", marginBottom: 5 }}
              >
                <p>
                  <span>{item.restaurantName} _ </span>
                  <span>{item.nameMenu}</span>
                </p>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p>
                    <span>Số lượng: </span> <span>{item.amount}</span>
                  </p>
                  <p>
                    <span>Giá: </span>
                    <span>
                      {helper.formatMoneyVND(item.sellingPrice * item.amount)}
                    </span>
                  </p>
                </div>
              </Card>
            );
          })}
      </div>
    </Modal>
  );
};

export default ModalConfirmOrder;
