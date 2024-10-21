"use client";
import { Layout, Menu } from "antd";
import {
    AppstoreOutlined,
    MenuOutlined,
    SettingOutlined,
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
    const selectedKey = pathName.split('/').pop()|| "dashboard-business";

    const items: MenuItem[] = [
        {
            key: 'gr',
            label: 'Sidebar Menu',
            type: 'group',
            children: [
                {
                    key: "dashboard-business",
                    label: <Link href={"/dashboard-business"}>Dashboard</Link>,
                    icon: <AppstoreOutlined />,
                },
                {
                    key: "user",
                    label: <Link href={"/dashboard-business/user"}> Me</Link>,
                    icon: <TeamOutlined />,
                },
                {
                    key: "restaurant",
                    label: <Link href={"/dashboard-business/restaurant"}> Restaurant</Link>,
                    icon: <ShopOutlined />,
                    children: [
                        {key: 'menu', label:<Link href={"/dashboard-business/restaurant/menu"}> Menu</Link>, icon: <MenuOutlined />},
                        {key: "voucher", label: <Link href={"/dashboard-business/promotion/voucher"}> Voucher</Link>, icon: <ShoppingOutlined />},
                        {key: "coupon", label: <Link href={"/dashboard-business/promotion/coupon"}> Coupon</Link>, icon: <ShoppingOutlined />},
                        {key: "order", label: <Link href={"/dashboard-business/restaurant/order"}> Order</Link>, icon: <ShoppingOutlined />},
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
