"use client";

import { AdminContext } from "@/library/admin.context";
import { sendRequest } from "@/utils/api";
import {
  CheckOutlined,
  CloseOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, notification, Spin, Table } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import "./coupon.scss";

const CouponDetail = (props: any) => {
  const { id, role, access_token } = props;
  const [dataCouponItem, setDataCouponItem] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentCoupon, setCurrentCoupon] = useState("");
  const [isOpenModalConfirmActive, setOpenModalConfirmActive] = useState(false);
  const [isOpenModalConfirmUnActive, setOpenModalConfirmUnActive] =
    useState(false);
  const roleUsers = ["ADMINS", "ADMIN", "BUSINESSMAN"];

  const router = useRouter();

  const fetchCouponItem = async () => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/coupons/get-coupon-by-id?_id=${id}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    if (res?.data) {
      setLoading(false);
      const result = res?.data[0].couponItems;
      const formatResult = result.map((item: any) => {
        let startDate = dayjs(item.startedDate).format("DD-MM-YYYY");
        let endDate = dayjs(item.endedDate).format("DD-MM-YYYY");
        let time = dayjs(item.usedTime).format("DD-MM-YYYY");
        return {
          ...item,
          customer: item?.customer?.userId.name,
          startedDate: startDate,
          endedDate: endDate,
          nameCoupon: res?.data[0].nameCoupon,
          usedTime: time,
        };
      });
      setDataCouponItem(formatResult);
    } else {
      notification.error({
        message: "Có lỗi xảy ra, vui lòng thử lại sau",
        description: res?.message,
      });
    }
  };

  useEffect(() => {
    fetchCouponItem();
  }, []);

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Tên voucher",
      dataIndex: "nameCoupon",
      key: "nameCoupon",
    },
    {
      title: "Mã voucher",
      dataIndex: "codeId",
      key: "codeId",
    },

    {
      title: "Người sử dụng",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Mã yêu cầu sử dụng",
      dataIndex: "orderUse",
      key: "orderUse",
    },

    {
      title: "Ngày bắt đầu",
      dataIndex: "startedDate",
      key: "startedDate",
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endedDate",
      key: "endedDate",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Thời gian sử dụng",
      dataIndex: "usedTime",
      key: "usedTime",
    },
  ];

  return !loading ? (
    <>
      <Button onClick={() => router.back()}>Quay lại</Button>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          fontSize: 20,
          fontWeight: 600,
          marginTop: 20,
        }}
      >
        <span>Thông tin Coupon</span>
        <span>Số lượng: {dataCouponItem.length}</span>
      </div>

      <div className="table">
        <Table
          bordered
          dataSource={dataCouponItem}
          columns={columns}
          pagination={false}
          rowKey="_id"
        />
      </div>
    </>
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spin />
    </div>
  );
};

export default CouponDetail;
