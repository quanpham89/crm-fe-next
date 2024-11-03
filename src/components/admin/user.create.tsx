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
import { useState } from "react";
import { useForm } from "antd/es/form/Form";
import { sendRequest } from "@/utils/api";
import { useHasMounted } from "@/utils/customHook";
import { Select } from "antd";
import { useRouter } from "next/navigation";

const ModalCreateUser = (props: any) => {
  const { isOpenModal, setIsOpenModal, access_token } = props;
  const [form] = Form.useForm();
  const [dataCreateUser, setDataCreateUser] = useState({});
  const router = useRouter();

  const createUser = async (values: any) => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/register`,
      method: "POST",
      body: {
        ...values,
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    if (res?.data) {
      notification.success({
        message: "Tạo người dùng thành công",
      });
      // router.push("/dashboard/user")
      window.location.reload();
    } else {
      notification.error({
        message: "Có lỗi xảy ra, vui lòng thử lại sau",
        description: res.message,
      });
    }
  };
  const hasMounted = useHasMounted();
  if (!hasMounted) return <></>;
  return (
    <>
      <Modal
        title="Tạo mới người dùng"
        open={isOpenModal}
        onOk={() => setIsOpenModal(false)}
        onCancel={() => setIsOpenModal(false)}
        maskClosable={false}
        footer={null}
        forceRender={true}
      >
        <Form
          name="verify"
          autoComplete="off"
          layout="vertical"
          form={form}
          onFinish={createUser}
        >
          <Form.Item
            style={{ marginBottom: "10px" }}
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
            style={{ marginBottom: "10px" }}
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
            style={{ marginBottom: "10px" }}
            label="Mật khẩu"
            name="password"
            rules={[
              {
                required: true,
                message: "Mật khẩu không được để trống!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: "10px" }}
            label="Tên"
            name="name"
            rules={[
              {
                required: true,
                message: "Tên không được để trống!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: "10px" }}
            label="Địa chỉ"
            name="address"
          >
            <Input />
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Item
              style={{ marginBottom: "10px" }}
              label="Loại tài khoản"
              name="accountType"
            >
              <Select
                style={{ width: 140 }}
                options={[
                  { value: "FREE", label: "Miễn phí" },
                  { value: "PREMIUM", label: "Cao cấp" },
                  { value: "BUSINESS", label: "Kinh Doanh" },
                ]}
              />
            </Form.Item>

            <Form.Item
              style={{ marginBottom: "10px" }}
              label="Phân quyền"
              name="role"
            >
              <Select
                style={{ width: 140 }}
                options={[
                  { value: "ADMIN", label: "Quản trị viên" },
                  { value: "CUSTOMER", label: "khách hàng" },
                  { value: "BUSINESSMAN", label: "Người bán hàng" },
                ]}
              />
            </Form.Item>

            <Form.Item
              style={{ marginBottom: "10px" }}
              label="Giới tính"
              name="sex"
            >
              <Select
                style={{ width: 140 }}
                options={[
                  { value: "MALE", label: "Nam" },
                  { value: "FEMALE", label: "Nữ" },
                ]}
              />
            </Form.Item>
          </div>
          <Form.Item
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 10,
            }}
          >
            <Button type="primary" htmlType="submit">
              Tạo người dùng
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalCreateUser;
