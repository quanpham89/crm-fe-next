"use client";
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  ShopOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import React, { useContext } from "react";
import { AdminContext } from "@/library/admin.context";
import type { MenuProps } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";

type MenuItem = Required<MenuProps>["items"][number];
const AdminSideBar = () => {
  const { Sider } = Layout;
  const { collapseMenu } = useContext(AdminContext)!;
  const pathName = usePathname();
  const selectedKey = pathName.split("/").pop() || "dashboard";

  const items: MenuItem[] = [
    {
      key: "grp",
      label: "Danh mục",
      type: "group",
      children: [
        {
          key: "dashboard",
          label: <Link href={"/dashboard"}>Tổng quan</Link>,
          icon: <AppstoreOutlined />,
        },
        {
          key: "user",
          label: <Link href={"/dashboard/user"}>Quản lí người dùng</Link>,
          icon: <TeamOutlined />,
        },
        {
          key: "restaurant",
          label: <Link href={"/dashboard/restaurant"}>Quản lí shop</Link>,
          icon: <ShopOutlined />,
        },
        {
          key: "Promotion",
          label: "Khuyến mại",
          icon: <AppstoreOutlined />,
          children: [
            {
              key: "voucher",
              label: <Link href={"/dashboard/promotion/voucher"}>Voucher</Link>,
            },
            {
              key: "coupon",
              label: <Link href={"/dashboard/promotion/coupon"}>Coupon</Link>,
            },
          ],
        },
        {
          key: "error",
          label: <Link href={"/dashboard/error"}>Góp ý</Link>,
          icon: <TeamOutlined />,
        },
      ],
    },
  ];

  return (
    <Sider collapsed={collapseMenu}>
      <Menu
        mode="inline"
        defaultSelectedKeys={[selectedKey]}
        items={items}
        style={{ height: "100vh" }}
        theme="dark"
      />
    </Sider>
  );
};

export default AdminSideBar;
