"use client";

import { Card, Carousel, Image, notification } from "antd";
import "./Home.scss";
import dayjs from "dayjs";
import { handleAddPromotionForCustomer } from "@/utils/action";
import { PlusOutlined } from "@ant-design/icons";

const CouponRender = (props: any) => {
  const { coupon, type, user } = props;
  const handleAddPromotion = async (item: any) => {
    const data = {
      userId: user._id,
      _id: item._id,
    };
    if (type === "VOUCHER") {
      const response = await handleAddPromotionForCustomer(
        "api/v1/customers/add-voucher-for-customer",
        data
      );
      if (response.statusCode === 201) {
        notification.success({
          message: "Thêm thành công!",
        });
      } else {
        notification.error({
          message: response.message,
        });
      }
    } else {
      const response = await handleAddPromotionForCustomer(
        "api/v1/customers/add-coupon-for-customer",
        data
      );
      if (response.statusCode === 201) {
        notification.success({
          message: "Thêm thành công!",
        });
      } else {
        notification.error({
          message: response.message,
        });
      }
    }
  };
  const actions = (item: any): React.ReactNode[] => [
    <PlusOutlined key="add" onClick={() => handleAddPromotion(item)} />,
  ];
  return (
    <Carousel
      className="slider-coupon"
      arrows
      infinite={false}
      slidesToShow={5}
    >
      {coupon &&
        coupon.length > 0 &&
        coupon.map((item: any, index: number) => {
          return (
            <Card
              className="slide-card"
              actions={item.remain < item.amount ? actions(item) : []}
              key={item._id}
            >
              <Image alt="image" preview={false} src={item.image} width={140} />
              <h5 className="truncate">{item.nameCoupon}</h5>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  gap: 5,
                }}
              >
                <div>
                  <span className="support-title">Thời gian bắt đầu: </span>
                  <b>{dayjs(item.startedDate).format("DD/MM/YYYY")}</b>
                </div>
                <div>
                  <span className="support-title">Thời gian kết thúc: </span>
                  <b>{dayjs(item.endedDate).format("DD/MM/YYYY")}</b>
                </div>
              </div>
            </Card>
          );
        })}
    </Carousel>
  );
};

export default CouponRender;
