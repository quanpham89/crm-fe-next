"use client";
import { BusinessContext } from "@/library/business.context";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout } from "antd";
import { useContext } from "react";
import { DownOutlined, SmileOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import { signOut } from "next-auth/react";
const BusinessHeader = (props: any) => {
  const { Header } = Layout;
  const { session } = props;
  const { collapseMenu, setCollapseMenu } = useContext(BusinessContext)!;

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <span>Cài đặt</span>,
    },

    {
      key: "4",
      danger: true,
      label: (
        <span onClick={() => signOut({ callbackUrl: "/auth/login" })}>
          Đăng xuất
        </span>
      ),
    },
  ];

  return (
    <>
      <Header
        style={{
          padding: 0,
          display: "flex",
          background: "rgb(0 21 41 / 91%)",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          type="text"
          icon={collapseMenu ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapseMenu(!collapseMenu)}
          style={{
            fontSize: "16px",
            width: 64,
            height: 64,
            color: "#fff",
          }}
        />
        <Dropdown menu={{ items }}>
          <a
            onClick={(e) => e.preventDefault()}
            style={{
              lineHeight: "0 !important",
              marginRight: 20,
              color: "#fff",
            }}
          >
            <Space>
              Xin chào, {props.userName}
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </Header>
    </>
  );
};

export default BusinessHeader;
