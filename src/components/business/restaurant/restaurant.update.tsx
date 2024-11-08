"use client";
import {
  Modal,
  Steps,
  Form,
  Button,
  Input,
  message,
  notification,
  DatePicker,
} from "antd";
import {
  CheckCircleOutlined,
  LoadingOutlined,
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import { sendRequest } from "@/utils/api";
import { useHasMounted } from "@/utils/customHook";
import { Select, Space } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { auth } from "@/auth";

const ModalUpdateRestaurant = (props: any) => {
  const {
    access_token,
    user,
    isOpenModalUpdateRestaurant,
    setIsOpenUpdateRestaurant,
    currentRestaurant,
  } = props;
  const [form] = Form.useForm();
  const [dataUser, setDataUser] = useState([]);

  const router = useRouter();
  useEffect(() => {
    if (user.role !== "BUSINESSMAN") {
      fetchUserId();
    }
  }, [isOpenModalUpdateRestaurant]);

  const fetchUserId = async () => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/get-all-users`,
      method: "GET",
    });
    if (res?.data) {
      const formatdata = res?.data.map((item: any) => {
        return {
          value: item._id,
          label: item.name,
        };
      });
      setDataUser(formatdata);
    }
  };

  useEffect(() => {
    form.setFieldValue("_id", currentRestaurant._id);
    form.setFieldValue("phone", currentRestaurant.phone);
    form.setFieldValue("restaurantName", currentRestaurant.restaurantName);
    form.setFieldValue("address", currentRestaurant.address);
    form.setFieldValue("description", currentRestaurant.description);
    form.setFieldValue("productType", currentRestaurant.productType);
    form.setFieldValue("userId", currentRestaurant.userId);
  }, [currentRestaurant]);

  const updateRestaurant = async (values: any) => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/restaurants/update`,
      method: "PATCH",
      body: {
        ...values,
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    if (res?.data) {
      notification.success({
        message: "Cập nhập người dùng thành công",
      });
      window.location.reload();
    } else {
      notification.error({
        message: "Có lỗi xả ra, vui lòng thử lại sau",
        description: res.message,
      });
    }
  };
  const hasMounted = useHasMounted();
  if (!hasMounted) return <></>;
  return (
    <>
      <Modal
        title="Cập nhập Shop của tôi"
        open={isOpenModalUpdateRestaurant}
        onOk={() => setIsOpenUpdateRestaurant(false)}
        onCancel={() => setIsOpenUpdateRestaurant(false)}
        maskClosable={false}
        footer={null}
        forceRender={true}
      >
        <Form
          name="verify"
          autoComplete="off"
          layout="vertical"
          form={form}
          onFinish={updateRestaurant}
        >
          <Form.Item
            label="Id"
            name="_id"
            hidden
            rules={[
              {
                required: true,
                message: "_id không được để trống!",
              },
            ]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Tên shop"
            name="restaurantName"
            rules={[
              {
                required: true,
                message: "Tên Shop không được để trống!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              {
                required: true,
                message: "Số điện thoại không được để trống!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Địa chỉ shop"
            name="address"
            rules={[
              {
                required: true,
                message: "Địa chỉ không được để trống!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              {
                required: true,
                message: "Mô tả không được để trống!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Loại sản phẩm"
            name="productType"
            rules={[
              {
                required: true,
                message: "Loại sản phẩm không được để trống!",
              },
            ]}
          >
            <Select
              options={[
                { value: "FOOD", label: "Đồ ăn" },
                { value: "DRINK", label: "Đồ uống" },
                { value: "FASTFOOD", label: "Đồ ăn nhanh" },
                { value: "FOOD + DRINK", label: "Đồ ăn + Đồ uống" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Người sở hữu"
            name="userId"
            rules={[
              {
                required: true,
                message: "Người sở hữu không được để trống!",
              },
            ]}
          >
            <Select disabled options={dataUser} />
          </Form.Item>

          <Form.Item
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 20,
              marginBottom: 0,
            }}
          >
            <Button type="primary" htmlType="submit">
              Cập nhập
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalUpdateRestaurant;
