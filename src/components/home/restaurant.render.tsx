"use client";

import { Card, Carousel, Image, Rate } from "antd";
import "./Home.scss";
import { useRouter } from "next/navigation";
import { helper } from "@/app/helpers/customize";

const RestaurantRender = (props: any) => {
  const { restaurant } = props;
  const router = useRouter();
  const handleOpenRestaurant = async (id: string) => {
    router.push(`/customer/restaurant/${id}`);
  };

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
        <span>Shop - Sản phẩm</span>
      </div>
      <Carousel className="slider" autoplaySpeed={2000} arrows infinite>
        {restaurant &&
          restaurant.length > 0 &&
          restaurant.map((item: any) => {
            return (
              <div className="slide" key={item._id}>
                <Card
                  className="slide-card"
                  onClick={() => handleOpenRestaurant(item._id)}
                >
                  <Image alt="image" preview={false} src={item.image} />
                  <h5
                    style={{
                      textAlign: "center",
                      marginBottom: 5,
                      fontSize: 15,
                    }}
                  >
                    {item.restaurantName}
                  </h5>
                  <div>
                    <div className="truncate">
                      <span className="support-title">Mô tả: </span>
                      {item.description}
                    </div>
                    <div className="truncate">
                      <span className="support-title">Địa chỉ: </span>
                      {item.address}
                    </div>
                    <div className="truncate">
                      <span className="support-title">Loại sản phẩm: </span>
                      {item?.productType === "FASTFOOD"
                        ? "Đồ ăn nhanh"
                        : item?.productType === "DRINK"
                        ? "Đồ uống"
                        : item?.productType === "FOOD"
                        ? "Đồ ăn"
                        : "Đồ ăn nhanh và đồ uống"}
                    </div>
                    <div className="truncate">
                      <span className="support-title">Đánh giá: </span>
                      <Rate
                        allowHalf
                        disabled
                        defaultValue={Number(item.rating / 2)}
                        style={{ fontSize: 13 }}
                      />
                    </div>
                  </div>
                </Card>

                <div className="menu-list">
                  <h2 className="title" style={{ marginBottom: 0 }}>
                    Menu
                  </h2>
                  <div className="menu-item">
                    {item.menu && item.menu.length > 0 ? (
                      item.menu.map((it: any) =>
                        it.menuItemId.map((i: any) => (
                          <div className="menu-card" key={i._id}>
                            <Image alt="image" preview={false} src={i.image} />
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
                                  gap: 5,
                                }}
                              >
                                <div className="truncate">
                                  <span className="support-title">Giá: </span>
                                  <span
                                    style={{ textDecoration: "line-through" }}
                                  >
                                    {helper.formatMoneyVND(i.fixedPrice)}
                                  </span>
                                </div>
                                <div className="truncate">
                                  <span className="support-title">
                                    Giảm còn:{" "}
                                  </span>
                                  {helper.formatMoneyVND(i.sellingPrice)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )
                    ) : (
                      <h5>Chưa có món ăn nào</h5>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </Carousel>
    </>
  );
};

export default RestaurantRender;
