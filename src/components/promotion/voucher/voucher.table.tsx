"use client";

import { sendRequest } from "@/utils/api";
import Icon, {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  MinusOutlined,
  PlusOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  notification,
  Row,
  Select,
  Spin,
  Table,
} from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { use, useContext, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

import "../Pagination.scss";
import ModalCreateVoucher from "./voucher.create";
import ModalConfirmDelete from "@/components/modalConfirm/modalConfirm.delete";
import ModalConfirmHidden from "@/components/modalConfirm/modalConfirm.hidden";
import ModalConfirmActive from "@/components/modalConfirm/modalConfirm.active";
import { useRouter } from "next/navigation";
import { AdminContext } from "@/library/admin.context";

const VoucherTable = (props: any) => {
  const [form] = Form.useForm();
  const { role, access_token, user, userCreateId } = props;
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<any>([]);
  const [isOpenCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [isOpenModalConfirmDelete, setOpenModalConfirmDelete] =
    useState<boolean>(false);
  const [isOpenModalConfirmHidden, setOpenModalConfirmHidden] =
    useState<boolean>(false);
  const [currentVoucher, setCurrentVoucher] = useState<any>("");
  const [isOpenModalConfirmActive, setOpenModalConfirmActive] =
    useState<boolean>(false);
  const [typeAction, setTypeAction] = useState<string>("NORMAL");
  const [totalItem, setTotalItem] = useState<number>(1);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });
  const roleUsers = ["ADMINS", "ADMIN", "BUSINESSMAN"];

  const fetchVouchersPerPage = async (page: number, limit: number) => {
    const res = await sendRequest<IBackendRes<IUserPerPage>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/vouchers?current=${page}&pageSize=${limit}&belongTo=${userCreateId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    if (res?.data?.results) {
      setTotalItem(Number(res.data.totalItems));
      const vouchers = Array.isArray(res.data.results)
        ? res.data.results
        : [res.data.results];

      const formatData = vouchers.map((item) => {
        return {
          ...item,
          type: item.type === "GIFT" ? "Quà tặng" : "Sự kiện",
          scope:
            item.scope === "FOOD"
              ? "Thức ăn"
              : item.scope === "DRINK"
              ? "Đồ uống"
              : "Tất cả",
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
      setLoading(false);
    } else {
      notification.error({
        message: "Có lỗi xảy ra, vui lòng thử lại.",
        description: res?.message,
      });
    }
  };

  useEffect(() => {
    fetchVouchersPerPage(pagination.current, pagination.pageSize);
  }, [pagination.current]);

  const handleUnActiveVoucher = async (values: any) => {
    setCurrentVoucher(values);
    setOpenModalConfirmHidden(true);
  };

  const handleActiveVoucher = async (values: any) => {
    setCurrentVoucher(values);
    setOpenModalConfirmActive(true);
  };

  const handleConfirmDeleteVoucher = async (values: any) => {
    setCurrentVoucher(values);
    setOpenModalConfirmDelete(true);
  };

  const handleShowDetail = async (values: any) => {
    setCurrentVoucher(values);
    if (role === "ADMINS" || role === "ADMIN") {
      router.push(`/dashboard/promotion/voucher/${values._id}`);
    } else {
      router.push(`/business/promotion/voucher/${values._id}`);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Tên",
      dataIndex: "nameVoucher",
      key: "nameVoucher",
      width: "10%",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: "25%",
    },
    {
      title: "Phạm vi",
      dataIndex: "scope",
      key: "scope",
    },
    {
      title: "Phân loại",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Trạng thái",
      dataIndex: "activeIcon",
      key: "activeIcon",
    },
    {
      title: "Số lượng",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "%",
      dataIndex: "percentage",
      key: "percentage",
    },
    {
      title: "Tạo bởi",
      dataIndex: "createdBy",
      key: "createdBy",
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
            gap: 20,
            fontSize: 20,
          }}
        >
          <ProfileOutlined onClick={() => handleShowDetail(record)} />
          <MinusOutlined onClick={() => handleUnActiveVoucher(record)} />
          <PlusOutlined onClick={() => handleActiveVoucher(record)} />
          <DeleteOutlined onClick={() => handleConfirmDeleteVoucher(record)} />
        </div>
      ),
    },
  ];

  const search = async (values: any) => {
    setLoading(true);
    setTypeAction("SEARCH");

    let { time, ...rest } = values;
    let formatvalue = {
      ...rest,
      belongTo: userCreateId,
    };

    if (values?.time) {
      dayjs.extend(utc);
      const convertStartedDate = dayjs(values.time[0].$d).utc().format();
      const convertEndedDate = dayjs(values.time[1].$d).utc().format();
      formatvalue = {
        ...rest,
        startedTime: convertStartedDate,
        endedTime: convertEndedDate,
        belongTo: userCreateId,
      };
    }

    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/vouchers/search`,
      method: "POST",
      body: {
        ...formatvalue,
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    if (res?.data) {
      const voucher = Array.isArray(res.data.vouchers)
        ? res.data.vouchers
        : [res.data.vouchers];
      const formatData = voucher.map((item: any) => {
        return {
          ...item,
          type: item.type === "GIFT" ? "Quà tặng" : "Sự kiện",
          scope:
            item.scope === "FOOD"
              ? "Thức ăn"
              : item.scope === "DRINK"
              ? "Đồ uống"
              : "Tất cả",
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
      notification.success({
        message: `Có ${formatData.length} kết quả ứng với giá trị tìm kiếm.`
      });
      setDataSource(formatData);
      setLoading(false);
    } else {
      setLoading(false);
      notification.error({
        message: "Có lỗi xảy ra, vui lòng thử lại",
        description: res?.message,
      });
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    await fetchVouchersPerPage(pagination.current, pagination.pageSize);
    form.resetFields();
    setTypeAction("NORMAL");
  };

  const handleTableChange = (page: any) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
    }));
  };

  if (roleUsers.includes(role)) {
    return !loading ? (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
            alignContent: "center",
            fontSize: 20,
            fontWeight: 600,
          }}
        >
          <span>Quản lí Voucher</span>
          <Button
            style={{ fontSize: 16, fontWeight: 600, padding: "12px" }}
            onClick={() => setOpenCreateModal(true)}
          >
            Tạo Voucher
          </Button>
        </div>

        <div>
          <Form
            name="search"
            autoComplete="off"
            layout="vertical"
            form={form}
            onFinish={search}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Tên voucher" name="nameVoucher">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Id " name="_id">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Phân loại" name="type">
                  <Select
                  options = {[
                    { value: "GIFT", label: "Quà tặng" },
                    { value: "EVENT", label: "Sự kiện" },
                  ]}
                  ></Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Phạm vi" name="scope">
                <Select
                  options = {[
                    { value: "FOOD", label: "Thức ăn" },
                    { value: "DRINK", label: "Đồ uống" },
                    { value: "ALL", label: "Tất cả" },
                  ]}
                  ></Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Giảm giá" name="percentage">
                <InputNumber style={{width : "100%"}}/>
              </Form.Item>
            </Col>
              <Col span={12}>
                <Form.Item label="Khoảng thời gian" name="time">
                  <DatePicker.RangePicker
                    placeholder={["Từ", "đến"]}
                    allowEmpty={[false, true]}
                    onChange={(date, dateString) => {}}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  gap: 20,
                  marginTop: 10,
                  marginBottom: 10,
                }}
              >
                <span>
                  <Button htmlType="submit" onClick={() => handleRefresh()}>
                    Làm mới
                  </Button>
                </span>
                <span>
                  <Button type="primary" htmlType="submit">
                    Tìm kiếm
                  </Button>
                </span>
              </div>
            </Form.Item>
          </Form>
        </div>

        <div style={{ height: "40vh", overflowY: "scroll" }}>
          <Table
            bordered
            dataSource={dataSource}
            columns={columns}
            rowKey="_id"
            pagination={
              typeAction !== "SEARCH"
                ? {
                    pageSize: pagination.pageSize,
                    total: totalItem,
                    onChange: (page) => handleTableChange(page),
                  }
                : false
            }
          />

          <ModalCreateVoucher
            isOpenModal={isOpenCreateModal}
            setIsOpenModal={setOpenCreateModal}
            access_token={access_token}
            user={user}
          />
          <ModalConfirmDelete
            isOpenModalConfirmDelete={isOpenModalConfirmDelete}
            setOpenModalConfirmDelete={setOpenModalConfirmDelete}
            title={`Bạn chắc chắn muốn xóa voucher này vĩnh viễn ?`}
            currentItem={currentVoucher}
            access_token={access_token}
            type="VOUCHER"
          />
          <ModalConfirmActive
            isOpenModalConfirmActive={isOpenModalConfirmActive}
            setOpenModalConfirmActive={setOpenModalConfirmActive}
            title={`Bạn chắc chắn muốn kích hoạt voucher này?`}
            currentItem={currentVoucher}
            access_token={access_token}
            type="VOUCHER"
          />

          <ModalConfirmHidden
            isOpenModalConfirmHidden={isOpenModalConfirmHidden}
            setOpenModalConfirmHidden={setOpenModalConfirmHidden}
            title={`Bạn chắc chắn muốn hủy kích hoạt voucher này?`}
            currentItem={currentVoucher}
            access_token={access_token}
            type="VOUCHER"
          />
        </div>
      </div>
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
  } else {
    return <h3 style={{ textAlign: "center" }}>Xác thực quyền truy cập</h3>;
  }
};

export default VoucherTable;
