"use client";

import { useRouter } from "next/navigation";
import { Avatar, Badge, Button, Card, Image, Rate } from "antd";
import "./restaurant.detail.render.scss";
import { helper } from "@/app/helpers/customize";
import PromotionListRender from "../promotion/promotion.list.render";
import { useContext, useEffect, useState } from "react";
import OderModal from "../order/order.modal";
import { PlusOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { CustomerContext } from "@/library/customer.context";

const RestaurantDetailRender = (props: any) => {
  const { dataRestaurant, dataMenu, user } = props;
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModalOrder, setIsOpenModalOrder] = useState(false);
  const [currentItem, setCurrentItem] = useState({})
  const [type, setType] = useState<string>("");
  const { currentCart, setCurrentCart } = useContext(CustomerContext)!;
  const router = useRouter();

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const { cart } = JSON.parse(storedCart);
      setCurrentCart(cart);
    }
  }, []);
  const handleOpenPromotionModal = (type: string) => {
    if (type === "VOUCHER") {
      setIsOpenModal(true);
      setType("VOUCHER");
    } else {
      setIsOpenModal(true);
      setType("COUPON");
    }
  };
  const actions = (i: any): React.ReactNode[] => [
    <PlusOutlined key="add" onClick={() => handleOrder(i)} />,
  ];

  const handleOrder = (item: any) => {
    setIsOpenModalOrder(true)
    item.restaurantId = dataRestaurant._id
    item.userId = user._id
    item.restaurantName = dataRestaurant.restaurantName
    setCurrentItem(item)
  }
  return (
    <div className="detail-restaurant-container">
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        fontSize: 20,
        fontWeight: 600
      }}>
        <Button onClick={() => router.back()}>Back</Button>
        <span style={{cursor: "pointer"}} onClick={() => router.push("/customer/cart")}>
          <Badge count={currentCart.length} >
            <Avatar shape="square" icon={<ShoppingCartOutlined />} />
          </Badge>
        </span>
      </div>
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
              <Card className="menu-card" key={i._id} actions={actions(i)} >
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

        <OderModal
          setIsOpenModal={setIsOpenModalOrder}
          isOpenModal={isOpenModalOrder}
          currentItem={currentItem}
          setCurrentItem={setCurrentItem}
          user={user}
        />
      </div>
    </div>
  );
};

export default RestaurantDetailRender;
