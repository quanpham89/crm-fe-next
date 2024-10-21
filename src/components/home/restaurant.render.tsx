"use client";

import { Card, Carousel, Image, Rate } from "antd";
import "./Home.scss"

const RestaurantRender = (props: any) => {
  const { restaurant } = props;

  return (
    <Carousel className="slider" autoplay autoplaySpeed={2000} arrows infinite >
    {restaurant && restaurant.length > 0 &&
      restaurant.map((item: any, index: number) => {
        return (
          <div className="slide" key={index}>
            <Card className="slide-card">
              <Image alt="image" preview={false} src={item.image} />
              <h5 style={{textAlign: "center", marginBottom: 5, fontSize: 15}}>{item.restaurantName}</h5>
              <div >
                <div><span className="support-title">Mô tả: </span>{item.description}</div>
                <div><span className="support-title">Địa chỉ: </span>{item.address}</div>
                <div><span className="support-title">Loại sản phẩm: </span>{item.productType}</div>
                <div><span className="support-title">Đánh giá: </span><Rate allowHalf disabled defaultValue={Number(item.rating / 2)} style={{fontSize: 13}}/></div>
              </div>
            </Card>

            <div className="menu-list">
              <h2 className="title" style={{marginBottom: 10}}>Menu</h2>
              <div className="menu-item">
                {item.menu && item.menu.length > 0 ?
                item.menu.map((it: any, index: number)=>{
                  return it.menuItemId.map((i:any, idx:any)=>{
                    return (
                      <div className="menu-card" key = {i._id}>
                        <Image alt="image" preview={false} src={i.image} />
                        <h5 style={{textAlign: "center", marginBottom: 5, fontSize: 14}}>{i.nameItemMenu}</h5>
                        <div >
                        <div><span className="support-title">Menu: </span>{i.nameMenu}</div>
                          <div><span className="support-title">Mô tả: </span>{i.description}</div>
                          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", gap: 5}}>
                            <span className="support-title">Giá: </span>
                            <span style={{textDecoration: "line-through"}}>{i.fixedPrice}</span>
                            <span  className="support-title">Giảm còn: </span>
                            {i.sellingPrice}
                          </div>
                        </div>
                      </div>
                    )
                  })
                })
                :
                <h5>Chưa có món ăn nào</h5>
                }
              </div>
            </div>
          </div>
        )
      })

    }

  </Carousel>
  );
};

export default RestaurantRender;
