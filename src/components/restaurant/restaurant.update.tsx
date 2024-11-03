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
  const { access_token } = props;

  const {
    isOpenModalUpdateRestaurant,
    setIsOpenUpdateRestaurant,
    currentRestaurant,
    setCurrentRestaurant,
  } = props;
  const [form] = Form.useForm();

  const router = useRouter();

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
        message: "Cập nhập thông tin shop thành công.",
      });
      window.location.reload();
      notification.error({
        message: "Có lỗi xảy ra, vui lòng thử lại sau.",
        description: res.message,
      });
    }
  };
  const handleCloseModal = () => {
    setIsOpenUpdateRestaurant(false);
    form.resetFields();
    setCurrentRestaurant({});
  };
  const hasMounted = useHasMounted();
  if (!hasMounted) return <></>;
  return (
    <>
      <Modal
        title="Cập nhập shop"
        open={isOpenModalUpdateRestaurant}
        onOk={handleCloseModal}
        onCancel={handleCloseModal}
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
                message: "Tên shop không được để trống!",
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
            label="Địa chỉ"
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
                { value: "FOOD + DRINK", label: "Đồ ăn  + Đồ uống" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Chủ sở hữu"
            name="userId"
            hidden
            rules={[
              {
                required: true,
                message: "Chủ sở hữu không được để trống!",
              },
            ]}
          >
            <Input disabled />
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
