"use client";

import { AdminContext } from "@/library/admin.context";
import { handleGetData, handleGetDataPerPage } from "@/utils/action";
import { sendRequest } from "@/utils/api";
import {
  BarsOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  MinusCircleOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Descriptions,
  Form,
  Input,
  InputNumber,
  notification,
  Row,
  Space,
  Spin,
  Table,
  Tabs,
  Upload,
} from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import "../Pagination.scss";
import { SizeType } from "antd/es/config-provider/SizeContext";
import MenuDetailUpdate from "./menu.detail.update";
import MenuDetailCreate from "./menu.detail.create";
import MenuDetailDelete from "./menu.detail.delete";

const MenuDetail = (props: any) => {
  const { role, menuInfo, menuItems, user, access_token, restaurantId } = props;
  const author = {
    userCreateId: menuInfo.userCreateId,
    createdBy: menuInfo.createdBy,
    restaurantId: menuInfo.restaurantId,
  };
  const [isLoading, setLoading] = useState(false);
  const { roleUsers, roleUser, setRoleUser } = useContext(AdminContext)!;
  const router = useRouter();
  useEffect(() => {
    setRoleUser(role);
  }, []);
  const formatItems = [
    {
      key: "1",
      label: "Shop",
      children: menuInfo.restaurant.restaurantName,
    },
    {
      key: "2",
      label: "Liên hệ",
      children: menuInfo.restaurant.phone,
    },
    {
      key: "3",
      label: "Menu",
      children: menuInfo.nameMenu,
    },
    {
      key: "4",
      label: "Trạng thái",
      children: menuInfo.status === "HIDDEN" ? "Ẩn" : "Hiện",
    },
    {
      key: "5",
      label: "Tạo bởi",
      children: menuInfo.createdBy,
    },
    {
      key: "6",
      label: "Mô tả",
      children: menuInfo.description,
    },
  ];

  const [size, setSize] = useState<SizeType>("small");

  return isLoading ? (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spin />
    </div>
  ) : (
    <>
      <Button style={{ marginBottom: 20 }} onClick={() => router.back()}>
        Quay lại
      </Button>
      <Descriptions bordered items={formatItems} />

      <div
        style={{
          marginTop: 10,
        }}
      >
        <Tabs
          defaultActiveKey="1"
          size={size}
          items={[
            {
              label: "Cập nhập",
              key: "1",
              children: (
                <MenuDetailUpdate
                  role={role}
                  menuInfo={menuInfo}
                  menuItems={menuItems}
                  user={user}
                  access_token={access_token}
                />
              ),
            },
            {
              label: " Tạo sản phẩm",
              key: "2",
              children: (
                <MenuDetailCreate
                  restaurantId={restaurantId}
                  role={role}
                  access_token={access_token}
                  author={author}
                  menuInfo={menuInfo}
                />
              ),
            },
            {
              label: "Xóa",
              key: "3",
              children: (
                <MenuDetailDelete
                  role={role}
                  access_token={access_token}
                  menuInfo={menuInfo}
                />
              ),
            },
          ]}
        />
      </div>
    </>
  );
};

export default MenuDetail;
