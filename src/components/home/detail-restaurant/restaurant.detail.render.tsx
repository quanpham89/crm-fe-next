"use client";

import { useRouter } from "next/navigation";
import { Button, Card, Image, Rate } from "antd";
import "./restaurant.detail.render.scss";
import { helper } from "@/app/helpers/customize";
import PromotionListRender from "../promotion/promotion.list.render";
import { useState } from "react";

const RestaurantDetailRender = (props: any) => {
  const { dataRestaurant, dataMenu, user } = props;
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [type, setType] = useState<string>("");
  const router = useRouter();
  const handleOpenPromotionModal = (type: string) => {
    if (type === "VOUCHER") {
      setIsOpenModal(true);
      setType("VOUCHER");
    } else {
      setIsOpenModal(true);
      setType("COUPON");
    }
  };
  return (
    <div className="detail-restaurant-container">
      <Button onClick={() => router.back()}>Back</Button>
      <div className="restaurant">
        <div className="image">
          <Image alt="image" src={dataRestaurant.image} />
        </div>
        <div className="content">
          <h5 style={{ textAlign: "center", marginBottom: 12, fontSize: 20 }}>
            {dataRestaurant.restaurantName}
          </h5>
          <div>
            <div className="truncate">
              <span className="support-title">Mô tả: </span>{" "}
              {dataRestaurant.description}
            </div>
            <div className="truncate">
              <span className="support-title">Địa chỉ: </span>{" "}
              {dataRestaurant.address}
            </div>
            <div className="truncate">
              <span className="support-title">Loại sản phẩm: </span>{" "}
              {dataRestaurant.productType}
            </div>
            <div className="truncate">
              <span className="support-title">Đánh giá: </span>{" "}
              <Rate
                allowHalf
                disabled
                defaultValue={Number(dataRestaurant.rating / 2)}
                style={{ fontSize: 13 }}
              />
            </div>
            <div
              className="truncate"
              style={{ display: "flex", justifyContent: "flex-end", gap: 20 }}
            >
              <Button onClick={() => handleOpenPromotionModal("VOUCHER")}>
                Voucher
              </Button>
              <Button onClick={() => handleOpenPromotionModal("COUPON")}>
                Coupon
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="menu">
        {dataMenu && dataMenu.length > 0 ? (
          dataMenu.map((item: any) =>
            item.menuItem.map((i: any) => (
              <Card className="menu-card" key={i._id}>
                <div className="image">
                  <Image alt="image" src={i.image} />
                </div>
                <div className="content">
                  <h5
                    style={{
                      textAlign: "center",
                      marginBottom: 5,
                      fontSize: 14,
                    }}
                  >
                    {i.nameItemMenu}
                  </h5>
                  <div style={{ fontSize: 12 }}>
                    <div className="truncate">
                      <span className="support-title">Menu: </span>
                      {i.nameMenu}
                    </div>
                    <div className="truncate">
                      <span className="support-title">Mô tả: </span>
                      {i.description}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 20,
                      }}
                    >
                      <div className="truncate">
                        <span className="support-title">Giá: </span>
                        <span style={{ textDecoration: "line-through" }}>
                          {helper.formatMoneyVND(i.fixedPrice)}
                        </span>
                      </div>
                      <div className="truncate">
                        <span className="support-title">Giảm còn: </span>
                        {helper.formatMoneyVND(i.sellingPrice)}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )
        ) : (
          <h5>Chưa có món ăn nào</h5>
        )}
        <PromotionListRender
          setIsOpenModal={setIsOpenModal}
          isOpenModal={isOpenModal}
          user={user}
          type={type}
        />
      </div>
    </div>
  );
};

export default RestaurantDetailRender;
