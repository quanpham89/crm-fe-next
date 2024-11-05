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
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import { sendRequest } from "@/utils/api";
import { useHasMounted } from "@/utils/customHook";
import { Select } from "antd";
import { useRouter } from "next/navigation";

const ModalCreateRestaurant = (props: any) => {
  const { isOpenModal, setIsOpenModal, user, role, access_token } = props;
  const [form] = Form.useForm();
  const [dataUser, setDataUser] = useState([]);
  const router = useRouter();

  const fetchUserId = async () => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/get-all-users`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
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
    form.setFieldValue("userId", user._id);
    if ((user && user?.role !== "ADMINS") || (user && user?.role !== "ADMIN")) {
      fetchUserId();
    } else {
    }
  }, [isOpenModal]);

  const createRestaurants = async (values: any) => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/restaurants`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      body: {
        ...values,
      },
    });
    if (res?.data) {
      if (user?.role === "BUSINESSMAN") {
        notification.success({
          message:
            "Tạo shop thành công, hệ thống tự động đăng xuất sau 5s, vui lòng thực hiện đăng nhập lại để thao tác.",
        });
        setTimeout(async () => {
          await signOut({ redirect: false });
          router.push("/auth/login");
        }, 5000);
      } else {
        notification.success({
          message: "Tạo shop thành công.",
        });
        window.location.reload();
      }
    } else {
      notification.error({
        message: "Đã xảy ra vấn đề, vui lòng thử lại sau.",
        description: res.message,
      });
    }
  };
  const hasMounted = useHasMounted();
  if (!hasMounted) return <></>;
  return (
    <>
      <Modal
        title="Tạo shop"
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
          onFinish={createRestaurants}
        >
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
                message: "Product's type không được để trống!",
              },
            ]}
          >
            <Select
              options={[
                { value: "FOOD", label: "Đồ ăn" },
                { value: "DRINK", label: "Đồ uống" },
                { value: "FASTFOOD", label: "Đồ ăn nhanh" },
                { value: "FASTFOOD + DRINK", label: "Đồ ăn nhanh + Đồ uống" },
              ]}
            />
          </Form.Item>
          {role === "ADMIN" || role === "ADMINS" ? (
            <Form.Item
              label="Chủ sở hữu"
              name="userId"
              rules={[
                {
                  required: true,
                  message: "Chủ sở hữu không được để trống!",
                },
              ]}
            >
              <Select style={{ width: "100%" }} options={dataUser} />
            </Form.Item>
          ) : (
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
          )}

          <Form.Item
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 20,
              marginBottom: 0,
            }}
          >
            <Button type="primary" htmlType="submit">
              Tạo
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalCreateRestaurant;
