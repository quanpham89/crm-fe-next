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
  Row,
  Col,
} from "antd";
import { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import { sendRequest } from "@/utils/api";
import { useHasMounted } from "@/utils/customHook";
import { Select, Space } from "antd";
import { useRouter } from "next/navigation";

const ModalUpdateUser = (props: any) => {
  const { access_token } = props;
  const { isOpenModalUpdateUser, setIsOpenUpdateUser, currentUser } = props;
  const [form] = Form.useForm();
  const router = useRouter();

  const updateUser = async (values: any) => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/update`,
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
        message: "Có lỗi xảy ra, vui lòng thử lại sau",
        description: res.message,
      });
    }
  };
  useEffect(() => {
    form.setFieldValue("_id", currentUser._id);
    form.setFieldValue("email", currentUser.email);
    form.setFieldValue("phone", currentUser.phone);
    form.setFieldValue("name", currentUser.name);
    form.setFieldValue("address", currentUser.address);
    form.setFieldValue("accountType", currentUser.accountType);
    form.setFieldValue("role", currentUser.role);
    form.setFieldValue("sex", currentUser.sex);
  }, [currentUser]);
  const hasMounted = useHasMounted();
  if (!hasMounted) return <></>;
  return (
    <>
      <Modal
        title="Cập nhập người dùng"
        open={isOpenModalUpdateUser}
        onOk={() => setIsOpenUpdateUser(false)}
        onCancel={() => setIsOpenUpdateUser(false)}
        maskClosable={false}
        footer={null}
        forceRender={true}
      >
        <Form
          name="update"
          autoComplete="off"
          layout="vertical"
          form={form}
          onFinish={updateUser}
        >
          <Form.Item
            label="Id"
            name="_id"
            hidden
            rules={[
              {
                required: true,
                message: "Id không được để trống!",
              },
            ]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Email không được để trống!",
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
            label="Họ và tên"
            name="name"
            rules={[
              {
                required: true,
                message: "Họ và tên không được để trống!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Địa chỉ" name="address">
            <Input />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Loại tài khoản"
                name="accountType"
              >
                <Select
                  style={{ width: "100%" }}
                  options={[
                    { value: "FREE", label: "Miễn phí" },
                    { value: "PREMIUM", label: "Cao cấp" },
                    { value: "BUSINESS", label: "Kinh Doanh" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Phân quyền"
                name="role"
              >
                <Select
                  style={{ width: "100%" }}
                  options={[
                    { value: "ADMIN", label: "Quản trị viên" },
                    { value: "CUSTOMER", label: "khách hàng" },
                    { value: "BUSINESSMAN", label: "Người kinh doanh" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                style={{ marginBottom: "10px" }}
                label="Giới tính"
                name="sex"
              >
                <Select
                  style={{ width: "100%" }}
                  options={[
                    { value: "MALE", label: "Nam" },
                    { value: "FEMALE", label: "Nữ" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 0,
              marginTop: 10,
            }}
          >
            <Button type="primary" htmlType="submit">
              Cập nhập người dùng
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalUpdateUser;
