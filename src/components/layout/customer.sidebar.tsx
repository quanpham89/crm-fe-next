"use client";
import { Layout, Menu } from "antd";
import {
    AppstoreOutlined,
    BookOutlined,
    MenuOutlined,
    SettingOutlined,
    ShopOutlined,
    ShoppingOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import React, { useContext } from 'react';
import { CustomerContext } from "@/library/customer.context";
import type { MenuProps } from 'antd';
import Link from 'next/link';
import { usePathname } from "next/navigation";

type MenuItem = Required<MenuProps>['items'][number];

const CustomerSideBar = () => {
    const { Sider } = Layout;
    const { collapseMenu } = useContext(CustomerContext)!;
    const pathName = usePathname();
    const selectedKey = pathName.split('/').pop()|| "customer";

    const items: MenuItem[] = [
        {
            key: 'gr',
            label: 'Sidebar Menu',
            type: 'group',
            children: [
                {
                    key: "customer",
                    label: <Link href={"/customer"}> Me</Link>,
                    icon: <UserOutlined />,
                },
                {
                    key: "restaurant",
                    label: <Link href={"/customer/restaurant"}> Restaurant</Link>,
                    icon: <ShopOutlined />,
                },
                {
                    key: "order",
                    label: <Link href={"/customer/order"}> My Order</Link>,
                    icon: <ShopOutlined />,
                },
                {
                    key: "cart",
                    label: <Link href={"/customer/cart"}> Cart</Link>,
                    icon: <ShopOutlined />,
                },
                {
                    key: "protion",
                    label: <Link href={"/customer/protion"}> Promotion</Link>,
                    icon: <BookOutlined />,
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

export default CustomerSideBar;
