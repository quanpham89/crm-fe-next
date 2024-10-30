"use client";

import CouponRender from "./coupon.render";
import "./Home.scss";
import RestaurantRender from "./restaurant.render";
import VoucherRender from "./voucher.render";

const HomeRender = (props: any) => {
  const { restaurant, voucher, coupon, user } = props;

  return (
    <div className="home-container">
      <RestaurantRender restaurant={restaurant} />
      <VoucherRender voucher={voucher} user={user} type={"VOUCHER"} />
      <CouponRender coupon={coupon} user={user} type={"COUPON"} />
    </div>
  );
};

export default HomeRender;
