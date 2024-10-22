"use client";

import CouponRender from "./coupon.render";
import "./Home.scss"
import RestaurantRender from "./restaurant.render";
import VoucherRender from "./voucher.render";

const HomeRender = (props: any) => {
  const { restaurant, voucher, coupon } = props;

  return (
    <div className="home-container">
      <RestaurantRender restaurant= {restaurant}/>
      <VoucherRender voucher = {voucher}/>
      <CouponRender coupon = {coupon}/>
      
    </div>
  );
};

export default HomeRender;
