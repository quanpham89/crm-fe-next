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
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, notification, Spin, Table } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import "../Pagination.scss";

import ReactPaginate from "react-paginate";
import ModalCreateMenu from "./menu.create";
import ModalConfirmDelete from "@/components/modalConfirm/modalConfirm.delete";
import ModalConfirmHidden from "@/components/modalConfirm/modalConfirm.hidden";
import ModalChooseMenu from "./menu.choose";
import ModalConfirmActive from "@/components/modalConfirm/modalConfirm.active";
import Restaurant from "@/app/(admin)/dashboard/restaurant/[id]/page";

const MenuTable = (props: any) => {
  const { role, access_token, dataRestaurant, user } = props;

  const author = {
    userCreateId: user._id,
    createdBy: user.name,
    restaurantId: dataRestaurant[0]._id,
  };

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModalChooseMenu, setIsOpenChooseMenu] = useState(false);
  const [dataSource, setDataSource] = useState<any>([]);
  const [currentMenu, setCurrentMenu] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isOpenModalConfirmDelete, setOpenModalConfirmDelete] =
    useState<boolean>(false);
  const [isOpenModalConfirmHidden, setOpenModalConfirmHidden] =
    useState<boolean>(false);
  const [isOpenModalConfirmActive, setOpenModalConfirmActive] =
    useState<boolean>(false);
  const { roleUsers, roleUser, setRoleUser } = useContext(AdminContext)!;
  setRoleUser(role);
  const [totalItem, setTotalItem] = useState<number>(1);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });
  const router = useRouter();
  const pathName = usePathname();

  const fetchMenuPerPage = async (page: number, limit: number) => {
    const res = await handleGetDataPerPage(
      `api/v1/menus?current=${page}&pageSize=${limit}&belongTo=${author.restaurantId}`,
      access_token,
      { next: { tags: "dataMenu" } }
    );
    if (res?.data?.results) {
      const menus = Array.isArray(res.data.results)
        ? res.data.results
        : [res.data.results];
      const formatData = menus.map((item) => {
        const { user, ...rest } = item;
        return {
          ...rest,

          activeIcon:
            item.status === "PUBLIC" ? (
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
      setTotalItem(+res?.data?.totalItems);
      setLoading(false);
    } else {
      notification.error({
        message: "Call APIs error",
        description: res?.message,
      });
    }
  };

  useEffect(() => {
    fetchMenuPerPage(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);

  const handleEditMenu = async (record: any) => {
    const menuId = record._id;
    router.push(`${pathName}/detailMenu/${menuId}`);
  };

  const handleUnActiveMenu = async (record: any) => {
    setOpenModalConfirmHidden(true);
    setCurrentMenu(record);
  };

  const handleActiveMenu = (record: any) => {
    setOpenModalConfirmActive(true);
    setCurrentMenu(record);
  };

  const handleConfirmDeleteMenu = async (record: any) => {
    setOpenModalConfirmDelete(true);
    setCurrentMenu(record);
  };

  const handleOpenCreateMenu = (record: any) => {
    setCurrentMenu(record);
    router.push(`/dashboard/menu/${record._id}/menu`);
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
      title: "Tên menu",
      dataIndex: "nameMenu",
      key: "nameMenu",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
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
          <EditOutlined onClick={() => handleEditMenu(record)} />
          <MinusOutlined onClick={() => handleUnActiveMenu(record)} />
          <PlusOutlined onClick={() => handleActiveMenu(record)} />
          <DeleteOutlined onClick={() => handleConfirmDeleteMenu(record)} />
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
          <span>Quản lí menu</span>
          <Button
            style={{ fontSize: 16, fontWeight: 600, padding: "12px" }}
            onClick={() => setIsOpenModal(true)}
          >
            Tạo Menu
          </Button>
        </div>
        <div className="table">
          <Table
            bordered
            dataSource={dataSource}
            columns={columns}
            pagination={{
              pageSize: pagination.pageSize,
              total: totalItem,
              onChange: (page) => handleTableChange(page),
            }}
            rowKey="_id"
          />
        </div>
        <ModalCreateMenu
          isOpenModal={isOpenModal}
          setIsOpenModal={setIsOpenModal}
          access_token={access_token}
          author={author}
          setLoading={setLoading}
        />
        <ModalChooseMenu
          isOpenModalChooseMenu={isOpenModalChooseMenu}
          setIsOpenChooseMenu={setIsOpenChooseMenu}
          access_token={access_token}
        />
        <ModalConfirmDelete
          isOpenModalConfirmDelete={isOpenModalConfirmDelete}
          setOpenModalConfirmDelete={setOpenModalConfirmDelete}
          title={`Bạn chắc chắn muốn menu này vĩnh viễn ?`}
          currentItem={currentMenu}
          access_token={access_token}
          type="MENU"
        />
        <ModalConfirmHidden
          isOpenModalConfirmHidden={isOpenModalConfirmHidden}
          setOpenModalConfirmHidden={setOpenModalConfirmHidden}
          title={`Bạn chắc chắn muốn ẩn menu này?`}
          currentItem={currentMenu}
          access_token={access_token}
          type="MENU"
        />
        <ModalConfirmActive
          isOpenModalConfirmActive={isOpenModalConfirmActive}
          setOpenModalConfirmActive={setOpenModalConfirmActive}
          title={`Bạn chắc chắn hiển thị menu này?`}
          currentItem={currentMenu}
          access_token={access_token}
          type="MENU"
        />
      </>
    );
  } else {
    return <h3 style={{ textAlign: "center" }}>Xác thực quyền truy cập</h3>;
  }
};

export default MenuTable;
