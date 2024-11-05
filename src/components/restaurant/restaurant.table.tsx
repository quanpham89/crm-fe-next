"use client";
import { Button, notification, Pagination, Spin, Table } from "antd";
import { useContext, useEffect, useState } from "react";
import { sendRequest } from "@/utils/api";
import ReactPaginate from "react-paginate";
import {
  BarsOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { auth } from "@/auth";
import ModalUpdateRestaurant from "./restaurant.update";
import ModalCreateRestaurant from "./restaurant.create";
import "./Pagination.scss";
import ModalConfirmDelete from "../modalConfirm/modalConfirm.delete";
import ModalConfirmHidden from "../modalConfirm/modalConfirm.hidden";
import { AdminContext } from "@/library/admin.context";
import { useRouter } from "next/navigation";
import ModalConfirmActive from "../modalConfirm/modalConfirm.active";

const RestaurantTable = (props: any) => {
  const { role, access_token } = props;
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModalUpdateRestaurant, setIsOpenUpdateRestaurant] =
    useState(false);
  const [dataSource, setDataSource] = useState<any>([]);
  const [currentRestaurant, setCurrentRestaurant] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isOpenModalConfirmDelete, setOpenModalConfirmDelete] =
    useState<boolean>(false);
  const [isOpenModalConfirmHidden, setOpenModalConfirmHidden] =
    useState<boolean>(false);
  const [isOpenModalConfirmActive, setOpenModalConfirmActive] =
    useState<boolean>(false);
  const [totalItem, setTotalItem] = useState<number>(1);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });
  const { roleUsers, roleUser, setRoleUser } = useContext(AdminContext)!;
  setRoleUser(role);
  const router = useRouter();

  const fetchRestaurantPerPage = async (page: number, limit: number) => {
    const res = await sendRequest<IBackendRes<IUserPerPage>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/restaurants?current=${page}&pageSize=${limit}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    if (res?.data?.results) {
      setTotalItem(Number(res.data.totalItems));
      const restaurants = Array.isArray(res.data.results)
        ? res.data.results
        : [res.data.results];

      const formatData = restaurants.map((item) => {
        const { user, ...rest } = item;
        return {
          ...rest,
          userId: item?.user?._id,
          email: item?.user?.email,
          name: item?.user?.name,
          menu: item?.menuId.length,
          productType:
            item?.productType === "FASTFOOD"
              ? "Đồ ăn nhanh"
              : item?.productType === "FOOD"
              ? "Đồ ăn"
              : item?.productType === "DRINK"
              ? "Đồ uống"
              : "Đồ ăn + Đồ uống",
          activeIcon: item.isShow ? (
            <CheckOutlined
              style={{
                fontSize: "16px",
                display: "flex",
                justifyContent: "center",
                color: "green",
              }}
            />
          ) : (
            <CloseOutlined
              style={{
                fontSize: "16px",
                display: "flex",
                justifyContent: "center",
                color: "red",
              }}
            />
          ),
        };
      });
      setDataSource(formatData);
      setLoading(false);
    } else {
      notification.error({
        message: "Có lỗi xảy ra, vui lòng thực hiện lại",
        description: res?.message,
      });
    }
  };

  useEffect(() => {
    fetchRestaurantPerPage(pagination.current, pagination.pageSize);
  }, [pagination.current]);

  const handleEditRestaurant = async (record: any) => {
    setIsOpenUpdateRestaurant(true);
    setCurrentRestaurant(record);
  };

  const handleUnActiveRestaurant = async (record: any) => {
    setOpenModalConfirmHidden(true);
    setCurrentRestaurant(record);
  };

  const handleActiveRestaurant = (record: any) => {
    setOpenModalConfirmActive(true);
    setCurrentRestaurant(record);
  };

  const handleConfirmDeleteRestaurant = async (record: any) => {
    setOpenModalConfirmDelete(true);
    setCurrentRestaurant(record);
  };

  const handleOpenCreateRestaurant = (record: any) => {
    setCurrentRestaurant(record);
    router.push(`/dashboard/restaurant/${record._id}/menu`);
  };

  const handleTableChange = (page: any) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
    }));
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Tên shop",
      dataIndex: "restaurantName",
      key: "restaurantName",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Đánh giá ?/10",
      dataIndex: "rating",
      key: "rating",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Loại sản phẩm",
      dataIndex: "productType",
      key: "productType",
    },
    {
      title: "Menu",
      dataIndex: "menu",
      key: "menu",
    },
    {
      title: "Chủ sở hữu",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Trạng thái",
      dataIndex: "activeIcon",
      key: "activeIcon",
    },
    {
      title: "Thao tác",
      dataIndex: "",
      key: "",
      render: (text: string, record: any) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 40,
            fontSize: 20,
          }}
        >
          <EditOutlined onClick={() => handleEditRestaurant(record)} />
          <BarsOutlined onClick={() => handleOpenCreateRestaurant(record)} />
          <MinusOutlined onClick={() => handleUnActiveRestaurant(record)} />
          <PlusOutlined onClick={() => handleActiveRestaurant(record)} />
          <DeleteOutlined
            onClick={() => handleConfirmDeleteRestaurant(record)}
          />
        </div>
      ),
    },
  ];
  if (roleUsers.includes(roleUser)) {
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
            fontSize: 20,
            fontWeight: 600,
          }}
        >
          <span>Quản lí shop</span>
          <Button
            style={{ fontSize: 16, fontWeight: 600, padding: "12px" }}
            onClick={() => setIsOpenModal(true)}
          >
            Tạo shop
          </Button>
        </div>
        <div>
          <Table
            bordered
            dataSource={dataSource}
            columns={columns}
            rowKey="_id"
            pagination={{
              pageSize: pagination.pageSize,
              total: totalItem,
              onChange: (page) => handleTableChange(page),
            }}
          />
        </div>
        <ModalCreateRestaurant
          isOpenModal={isOpenModal}
          setIsOpenModal={setIsOpenModal}
          role={role}
          access_token={access_token}
        />
        <ModalUpdateRestaurant
          isOpenModalUpdateRestaurant={isOpenModalUpdateRestaurant}
          setIsOpenUpdateRestaurant={setIsOpenUpdateRestaurant}
          currentRestaurant={currentRestaurant}
          setCurrentRestaurant={setCurrentRestaurant}
          access_token={access_token}
        />
        <ModalConfirmDelete
          isOpenModalConfirmDelete={isOpenModalConfirmDelete}
          setOpenModalConfirmDelete={setOpenModalConfirmDelete}
          title={`Bạn chắc chắn muốn xóa tài khoản bán hàng này vĩnh viễn ?`}
          currentItem={currentRestaurant}
          access_token={access_token}
          type="RESTAURANTS"
        />
        <ModalConfirmActive
          isOpenModalConfirmActive={isOpenModalConfirmActive}
          setOpenModalConfirmActive={setOpenModalConfirmActive}
          title={`Bạn chắc chắn hiển thị tài khoản bán hàng này?`}
          currentItem={currentRestaurant}
          access_token={access_token}
          type="RESTAURANTS"
        />
        <ModalConfirmHidden
          isOpenModalConfirmHidden={isOpenModalConfirmHidden}
          setOpenModalConfirmHidden={setOpenModalConfirmHidden}
          title={`Bạn chắc chắn muốn ẩn tài khoản bán hàng này?`}
          currentItem={currentRestaurant}
          access_token={access_token}
          type="RESTAURANTS"
        />
      </>
    );
  } else {
    return <>Bạn không có quyền truy cập vào chức năng này.</>;
  }
};

export default RestaurantTable;
