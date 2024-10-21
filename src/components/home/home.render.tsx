"use client";

import "./Home.scss"
import RestaurantRender from "./restaurant.render";
import VoucherRender from "./voucher.render";

const HomeRender = (props: any) => {
  const { restaurant, voucher } = props;

  return (
    <div className="home-container">
      <RestaurantRender restaurant= {restaurant}/>
      <VoucherRender voucher = {voucher}/>
    </div>
  );
};

export default HomeRender;
