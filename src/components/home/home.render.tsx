"use client";

import { useState } from "react";
import CouponRender from "./coupon.render";
import "./Home.scss";
import RestaurantRender from "./restaurant.render";
import VoucherRender from "./voucher.render";
import { Spin } from "antd";

const HomeRender = (props: any) => {
  const { restaurant, voucher, coupon, user } = props;
  const [isLoading, setIsLoading] = useState(true);
  setTimeout(() => {
    setIsLoading(false);
  }, 800);

  return !isLoading ? (
    <div className="home-container">
      <RestaurantRender restaurant={restaurant} />
      <VoucherRender voucher={voucher} user={user} type={"VOUCHER"} />
      <CouponRender coupon={coupon} user={user} type={"COUPON"} />
    </div>
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Spin />
    </div>
  );
};

export default HomeRender;
