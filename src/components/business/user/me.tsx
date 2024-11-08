"use client";
import { handleGetDataUserById } from "@/utils/action";
import {
  Button,
  Descriptions,
  notification,
  Pagination,
  Spin,
  Table,
} from "antd";
import { useEffect, useState } from "react";
import BusinessCard from "../dashboard/businessCard";

const MeInfo = (props: any) => {
  const { user, dataFigureOrder, dataFigureOrderBelongToMenu } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<any>([]);

  const getInfoUser = async () => {
    const response = await handleGetDataUserById(
      `api/v1/users/get-user-by-id?_id=${user._id}`,
      user.access_token
    );
    if (response && response.data) {
      setIsLoading(false);
      const data = response?.data;
      const formatValue = [
        {
          key: "1",
          label: "Họ và tên: ",
          children: data?.name,
        },
        {
          key: "2",
          label: "Email",
          children: data?.email,
        },
        {
          key: "3",
          label: "Giới tính",
          children: data?.sex === "MALE" ? "Nam " : "Nữ",
        },
        {
          key: "4",
          label: "Loại tài khoản",
          children:
            data?.role === "BUSINESSMAN" ? "Người kinh doanh" : "Khách hàng",
        },
        {
          key: "5",
          label: "Trạng thái",
          children: data?.isActive ? "Hoạt động" : "vô hiệu hóa",
        },
        {
          key: "6",
          label: "Loại tài khoản",
          children: data?.accountType === "FREE" && "Miễn phí",
        },
      ];

      setItems(formatValue);
    }
  };

  useEffect(() => {
    getInfoUser();
  }, []);

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
      <Descriptions
        bordered
        title="Thông tin người dùng"
        layout="horizontal"
        items={items}
      />
      <BusinessCard
        dataFigureOrder={dataFigureOrder}
        role={user?.role}
        dataFigureOrderBelongToMenu={dataFigureOrderBelongToMenu}
      />
    </>
  );
};

export default MeInfo;
