"use client";

import { Card, Carousel, Image, notification } from "antd";
import "./Home.scss";
import dayjs from "dayjs";
import { PlusOutlined } from "@ant-design/icons";
import { handleAddPromotionForCustomer } from "@/utils/action";
import { useState } from "react";

const VoucherRender = (props: any) => {
  const { voucher, user, type } = props;

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
    <>
    <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
          marginBottom: 10,
          fontSize: 20,
          fontWeight: 600,
        }}
      >
        <span>Voucher Khuyến mãi</span>
      </div>
      <Carousel
        className="slider-voucher"
        arrows
        infinite={false}
        slidesToShow={5}
      >
        {voucher &&
          voucher.length > 0 &&
          voucher.map((item: any, index: number) => {
            return (
              <Card
                className="slide-card"
                actions={item.remain > 0 ? actions(item) : []}
                key={item._id}
              >
                <div className="image">
                  <Image
                    alt="image"
                    preview={false}
                    src={item.image}
                    width={140}
                  />
                </div>
                <div className="slide-cad-content">
                  <h5
                    className="truncate"
                    style={{
                      textAlign: "center",
                      marginBottom: "5px 0",
                      fontSize: 15,
                    }}
                  >
                    {item.nameVoucher}
                  </h5>
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
                </div>
              </Card>
            );
          })}
      </Carousel>
      </>
  );
};

export default VoucherRender;
