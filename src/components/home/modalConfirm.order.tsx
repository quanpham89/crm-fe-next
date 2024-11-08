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
  QRCode,
} from "antd";
import { sendRequest } from "@/utils/api";
import { useHasMounted } from "@/utils/customHook";
import {
  BankOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  ContainerOutlined,
  LoadingOutlined,
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { helper } from "@/app/helpers/customize";
import "./Home.scss";
import dayjs from "dayjs";
import { useQRCode } from "next-qrcode";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useRouter } from "next/navigation";
import { handlePostDataBillOfCustomer } from "@/utils/action";
import _ from "lodash";
import Item from "./item/item";

const ModalConfirmOrder = (props: any) => {
  const {
    user,
    isOpenModalConfirmOrder,
    setIsOpenModalConfirmOrder,
    title,
    data,
    domainUrl,
  } = props;

  const [currentStep, setCurrentStep] = useState(1);
  const [showIcon, setShowIcon] = useState(false);
  const router = useRouter();
  const { SVG } = useQRCode();
  const hasMounted = useHasMounted();
  const pushDataCart = async () => {
    const storedCart = localStorage.getItem("cart");

    if (data && data.cart && data.cart.length > 0) {
      const response = await handlePostDataBillOfCustomer(
        `api/v1/orders`,
        data,
        user?.access_token
      );

      if (response && response.statusCode === 201) {
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          delete parsedCart[user?._id];
          localStorage.setItem("cart", JSON.stringify(parsedCart));
        }

        notification.success({
          message:
            "Đơn hàng của bạn đã được đặt. Vui lòng chờ xác nhận của Shop để thực hiện vận chuyển đơn hàng.",
        });
        window.location.reload();
      } else {
        notification.error({
          message: "Đã xảy ra lỗi trong quá trình đặt hàng. Vui lòng thử lại.",
          description: response.message,
        });
      }
    } else {
      notification.error({
        message:
          "Giỏ hàng của bạn không có sản phẩm, vui lòng chọn sản phẩm để thực hiện thanh toán.",
      });
    }
  };

  useEffect(() => {
    if (currentStep < 1) {
      setIsOpenModalConfirmOrder(false);
      setCurrentStep(1);
    }
    if (currentStep === 2 && data?.paymentForm !== "bank") {
      setTimeout(() => {
        setIsOpenModalConfirmOrder(false);
        setCurrentStep(1);
        pushDataCart();
      }, 1000);
    }

    if (currentStep === 3 && data?.paymentForm === "bank") {
      setTimeout(() => {
        setIsOpenModalConfirmOrder(false);
        setCurrentStep(1);
        pushDataCart();
      }, 1000);
    }
  }, [currentStep]);

  if (!hasMounted) return <></>;
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
            title: "Hoàn thành",
            icon: <SmileOutlined />,
          },
        ]}
      />
      {currentStep === 1 && (
        <>
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
              <span>
                {data?.coupon && data?.coupon !== undefined ? "1" : "0"}
              </span>
            </p>
            <p className="bill-info-list">
              <span>Tổng tiền: </span>{" "}
              <span>{helper.formatMoneyVND(data?.totalPrice)}</span>
            </p>
          </div>
          <div className="cart-container">
            {data &&
              data.cart &&
              data.cart.length > 0 &&
              data.cart.map((item: any, index: number) => {
                return <Item key={item.menuItemId} product={item} />;
              })}
          </div>
        </>
      )}
      {currentStep === 2 && data?.paymentForm === "bank" && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2 style={{ textAlign: "center" }}>
            Quét qr code để thực hiển chuyển khoản
          </h2>
          <SVG
            text={`${domainUrl}/customer/cart`}
            options={{
              margin: 2,
              width: 200,
              color: {
                dark: "#000",
                light: "#fff",
              },
            }}
          />
          <Input
            style={{ display: "none" }}
            disabled
            placeholder={`${domainUrl}/customer/cart`}
          />
        </div>
      )}
      {currentStep === 3 ||
        (currentStep === 2 && data?.paymentForm !== "bank" && (
          <h2 style={{ textAlign: "center", marginTop: 20 }}>
            Cảm ơn quý khác đã mua hàng.
          </h2>
        ))}
      {currentStep < 3 && data.paymentForm === "bank" && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 20,
            margin: "20px 0",
          }}
        >
          <Button onClick={() => setCurrentStep(currentStep - 1)}>
            Quay lại
          </Button>
          <Button
            type="primary"
            onClick={() => setCurrentStep(currentStep + 1)}
          >
            Tiếp theo
          </Button>
        </div>
      )}

      {currentStep < 2 && data.paymentForm !== "bank" && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 20,
            margin: "20px 0",
          }}
        >
          <Button onClick={() => setCurrentStep(currentStep - 1)}>
            Quay lại
          </Button>
          <Button
            type="primary"
            onClick={() => setCurrentStep(currentStep + 1)}
          >
            Tiếp theo
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default ModalConfirmOrder;
