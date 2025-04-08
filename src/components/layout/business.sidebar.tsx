"use client";
import { Layout, Menu } from "antd";
import {
  AppstoreOutlined,
  BookOutlined,
  MenuOutlined,
  ShopOutlined,
  ShoppingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useContext } from "react";
import { BusinessContext } from "@/library/business.context";
import type { MenuProps } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";

type MenuItem = Required<MenuProps>["items"][number];

const BusinessSideBar = () => {
  const { Sider } = Layout;
  const { collapseMenu } = useContext(BusinessContext)!;
  const pathName = usePathname();

  const selectedKey = pathName.split("/").pop() || "user";

  const items: MenuItem[] = [
    {
      key: "gr",
      label: "Danh mục",
      type: "group",

      children: [
        {
          key: "user",
          label: <Link href={"/business/user"}>Tôi</Link>,
          icon: <UserOutlined />,
        },
        {
          key: "restaurant",
          label: <Link href={"/business/restaurant"}>Shop của tôi</Link>,
          icon: <ShopOutlined />,
          children: [
            {
              key: "menu",
              label: <Link href={"/business/restaurant/menu"}>Menu</Link>,
              icon: <MenuOutlined />,
            },
            {
              key: "voucher",
              label: <Link href={"/business/promotion/voucher"}>Voucher</Link>,
              icon: <BookOutlined />,
            },
            {
              key: "coupon",
              label: <Link href={"/business/promotion/coupon"}>Coupon</Link>,
              icon: <BookOutlined />,
            },
            {
              key: "order",
              label: <Link href={"/business/restaurant/order"}>Yêu cầu</Link>,
              icon: <ShoppingOutlined />,
            },
          ],
        },
        {
          key: "error",
          label: <Link href={"/business/error"}>Góp ý</Link>,
          icon: <TeamOutlined />,
        },
      ],
    },
  ];

  return (
    <Sider collapsed={collapseMenu}>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={items}
        style={{ height: "100vh" }}
        theme="dark"
      />
    </Sider>
  );
};

export default BusinessSideBar;
