"use client";
import { Layout, Menu } from "antd";
import {
    AppstoreOutlined,
    BookOutlined,
    MenuOutlined,
    ShopOutlined,
    ShoppingOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import React, { useContext } from 'react';
import { BusinessContext } from "@/library/business.context";
import type { MenuProps } from 'antd';
import Link from 'next/link';
import { usePathname } from "next/navigation";

type MenuItem = Required<MenuProps>['items'][number];

const BusinessSideBar = () => {
    const { Sider } = Layout;
    const { collapseMenu } = useContext(BusinessContext)!;
    const pathName = usePathname();

    let selectedKey = "business"; // Default key
    if (pathName.startsWith('/business/restaurant')) {
        selectedKey = "restaurant"; 
    } else if (pathName.startsWith('/business/user')) {
        selectedKey = "user";
    }

    const items: MenuItem[] = [
        {
            key: 'gr',
            label: 'Sidebar Menu',
            type: 'group',
            children: [
                // {
                //     key: "business",
                //     label: <Link href={"/business"}>Tổng quan</Link>,
                //     icon: <AppstoreOutlined />,
                // },
                {
                    key: "user",
                    label: <Link href={"/business/user"}>Tôi</Link>,
                    icon: <TeamOutlined />,
                },
                {
                    key: "restaurant",
                    label: <Link href={"/business/restaurant"}>Shop của tôi</Link>,
                    icon: <ShopOutlined />,
                    children: [
                        {key: 'menu', label: <Link href={"/business/restaurant/menu"}>Menu</Link>, icon: <MenuOutlined />},
                        {key: "voucher", label: <Link href={"/business/promotion/voucher"}>Voucher</Link>, icon: <BookOutlined />},
                        {key: "coupon", label: <Link href={"/business/promotion/coupon"}>Coupon</Link>, icon: <BookOutlined />},
                        {key: "order", label: <Link href={"/business/restaurant/order"}>Yêu cầu</Link>, icon: <ShoppingOutlined />},
                    ],
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
                style={{ height: '100vh' }}
            />
        </Sider>
    );
};

export default BusinessSideBar;
