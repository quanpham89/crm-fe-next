'use client'
import { CustomerContext } from '@/library/customer.context';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Layout } from 'antd';
import { useContext } from 'react';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import { signOut } from 'next-auth/react';
const CustomerHeader = (props : any) => {
    const { Header } = Layout;
    const {session} = props
    const { collapseMenu, setCollapseMenu } = useContext(CustomerContext)!;

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <span>
                    Settings
                </span>
            ),
        },
        
        {
            key: '4',
            danger: true,
            label: <span onClick={() => signOut({ callbackUrl: '/auth/login' })}>Đăng xuất</span>,
        },
    ];

    return (
        <>
            <Header
                style={{
                    padding: 0,
                    display: "flex",
                    background: "#f5f5f5",
                    justifyContent: "space-between",
                    alignItems: "center"
                }} >

                <div></div>
                <Dropdown menu={{ items }} >
                    <a onClick={(e) => e.preventDefault()}
                        style={{ color: "unset", lineHeight: "0 !important", marginRight: 20 }}
                    >
                        <Space>
                            Welcome {props.userName}
                            <DownOutlined />
                        </Space>
                    </a>
                </Dropdown>
            </Header>
        </>
    )
}

export default CustomerHeader;