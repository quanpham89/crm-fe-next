"use client";
import { Button, notification, Pagination, Spin, Table } from "antd";
import ModalCreateUser from "./user.create";
import { useContext, useEffect, useState } from "react";
import { sendRequest } from "@/utils/api";
import ReactPaginate from "react-paginate";
import "./User.scss";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  MinusOutlined,
} from "@ant-design/icons";
import ModalUpdateUser from "./user.update";
import { auth } from "@/auth";
import ModalConfirmDelete from "@/components/modalConfirm/modalConfirm.delete";
import ModalConfirmHidden from "../modalConfirm/modalConfirm.hidden";
import { AdminContext } from "@/library/admin.context";

const UserTable = (props: any) => {
  const { role, access_token } = props;
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModalUpdateUser, setIsOpenUpdateUser] = useState(false);
  const [dataSource, setDataSource] = useState<any>([]);
  const [currentUser, setCurrentUser] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isOpenModalConfirmDelete, setOpenModalConfirmDelete] =
    useState<boolean>(false);
  const [isOpenModalConfirmHidden, setOpenModalConfirmHidden] =
    useState<boolean>(false);
    const [totalItem, setTotalItem] = useState<number>(1)
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
    });
  const { roleUsers, roleUser, setRoleUser } = useContext(AdminContext)!;
  setRoleUser(role);

  const fetchUserPerPage = async (page: number, limit: number) => {
    const res = await sendRequest<IBackendRes<IUserPerPage>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users?current=${page}&pageSize=${limit}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    if (res?.data?.results) {
      const users = Array.isArray(res.data.results)
        ? res.data.results
        : [res.data.results];

      const formatDataUser = users.map((item) => ({
        ...item,
        activeIcon: item.isActive ? (
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
      }));
      setDataSource(formatDataUser);
      setTotalItem(+res?.data?.totalItems);
      console.log(res.data)
      setLoading(false);
    } else {
      notification.error({
        message: "Call APIs error",
        description: res?.message,
      });
    }
  };
  <CheckOutlined />;

  useEffect(() => {
    fetchUserPerPage(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);

  const handleEditUser = async (record: any) => {
    setIsOpenUpdateUser(true);
    setCurrentUser(record);
  };

  const handleUnActiveUser = async (record: any) => {
    setOpenModalConfirmHidden(true);
    setCurrentUser(record);
  };

  const handleConfirmDeleteUser = (record: any) => {
    setOpenModalConfirmDelete(true);
    setCurrentUser(record);
  };

  const handleTableChange = (page: any) => {
    setPagination((prev) => ({
        ...prev,
        current: page,
    }))
};

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Tên người dùng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Quyền hạn",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Giới tính",
      dataIndex: "sex",
      key: "sex",
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
          <EditOutlined onClick={() => handleEditUser(record)} />
          <MinusOutlined onClick={() => handleUnActiveUser(record)} />
          <DeleteOutlined onClick={() => handleConfirmDeleteUser(record)} />
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
          }}
        >
          <span>Manager Users</span>
          <Button onClick={() => setIsOpenModal(true)}>Create User</Button>
        </div>
        <div style={{ height: "50vh", overflowY: "scroll" }}>
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
        <ModalCreateUser
          isOpenModal={isOpenModal}
          setIsOpenModal={setIsOpenModal}
          access_token={access_token}
        />

        <ModalUpdateUser
          isOpenModalUpdateUser={isOpenModalUpdateUser}
          setIsOpenUpdateUser={setIsOpenUpdateUser}
          access_token={access_token}
          currentUser={currentUser}
        />
        <ModalConfirmDelete
          isOpenModalConfirmDelete={isOpenModalConfirmDelete}
          setOpenModalConfirmDelete={setOpenModalConfirmDelete}
          title={`Bạn chắc chắn muốn xóa người dùng này vĩnh viễn ?`}
          currentItem={currentUser}
          access_token={access_token}
          type="USER"
        />
        <ModalConfirmHidden
          isOpenModalConfirmHidden={isOpenModalConfirmHidden}
          setOpenModalConfirmHidden={setOpenModalConfirmHidden}
          title={`Bạn chắc chắn muốn ẩn hủy kích hoạt người dùng này?`}
          currentItem={currentUser}
          access_token={access_token}
          type="USER"
        />
      </>
    );
  } else {
    return <h3 style={{textAlign: "center"}}>Xác thực quyền truy cập</h3>;;
  }
};

export default UserTable;
