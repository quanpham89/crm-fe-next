"use client";

import { Card, Carousel, Image, Rate } from "antd";
import "./Home.scss"

const HomePage = (props: any) => {
  const { restaurant } = props;
  console.log(restaurant)


  return (
    <div className="home-container">

      <Carousel className="slider"  autoplaySpeed={2000} arrows infinite >
        <div className="slide">

          <Card className="slide-card">
            <Image alt="image" preview={false} src="https://t3.ftcdn.net/jpg/04/84/88/76/360_F_484887682_Mx57wpHG4lKrPAG0y7Q8Q7bJ952J3TTO.jpg" />
            <h5>{restaurant[0].restaurantName}</h5>
            <div >
              <div><span>Mô tả: </span>{restaurant[0].description}</div>
              <div><span>Địa chỉ: </span>{restaurant[0].address}</div>
              <div><span>Loại sản phẩm: </span>{restaurant[0].productType}</div>
              <div><span>Đánh giá: </span><Rate allowHalf disabled defaultValue={Number(restaurant[0].rating / 2)} /></div>
            </div>
          </Card>
          <div className="menu-list">
            <h2 className="title">Menu</h2>
            <div className="menu-item">
            <div className="menu-card">
            <Image alt="image" preview={false} src="https://t3.ftcdn.net/jpg/04/84/88/76/360_F_484887682_Mx57wpHG4lKrPAG0y7Q8Q7bJ952J3TTO.jpg" />
            <h5>{restaurant[0].restaurantName}</h5>
            <div >
              <div><span>Mô tả: </span>{restaurant[0].description}</div>
              <div><span>Địa chỉ: </span>{restaurant[0].address}</div>
              <div><span>Loại sản phẩm: </span>{restaurant[0].productType}</div>
              <div><span>Đánh giá: </span><Rate allowHalf disabled defaultValue={Number(restaurant[0].rating / 2)} /></div>
            </div>
          </div>

            </div>
          </div>
          
        </div>
        <div>
          
        </div>

        <div>
          
        </div>

        <div>
        </div>
      </Carousel>
    </div>
  );
};

export default HomePage;
