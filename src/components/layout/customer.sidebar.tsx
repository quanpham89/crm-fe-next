"use client";
import { Layout, Menu } from "antd";
import {
  AppstoreOutlined,
  BookOutlined,
  ContainerOutlined,
  MenuOutlined,
  ReadOutlined,
  SettingOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useContext } from "react";
import { CustomerContext } from "@/library/customer.context";
import type { MenuProps } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";

type MenuItem = Required<MenuProps>["items"][number];

const CustomerSideBar = () => {
  const { Sider } = Layout;
  const { collapseMenu } = useContext(CustomerContext)!;
  const pathName = usePathname();
  const selectedKey = pathName.split("/").pop() || "customer";

  const items: MenuItem[] = [
    {
      key: "gr",
      label: "Danh mục",
      type: "group",
      children: [
        {
          key: "customer",
          label: <Link href={"/customer"}> Tôi</Link>,
          icon: <UserOutlined />,
        },
        {
          key: "restaurant",
          label: <Link href={"/customer/restaurant"}> Shop</Link>,
          icon: <ShopOutlined />,
        },
        {
          key: "cart",
          label: <Link href={"/customer/cart"}> Giỏ hàng</Link>,
          icon: <ShoppingCartOutlined />,
        },
        {
          key: "order",
          label: <Link href={"/customer/order"}> Đơn hàng của tôi</Link>,
          icon: <ContainerOutlined />,
        },
        {
          key: "history",
          label: <Link href={"/customer/history"}> Lịch sử mua hàng</Link>,
          icon: <ReadOutlined />,
        },
        {
          key: "error",
          label: <Link href={"/customer/error"}>Góp ý</Link>,
          icon: <ReadOutlined />,
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

export default CustomerSideBar;
