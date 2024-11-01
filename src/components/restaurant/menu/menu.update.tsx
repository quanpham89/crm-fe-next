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
  Space,
  Upload,
  InputNumber,
} from "antd";
import { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import { sendRequest } from "@/utils/api";
import { useHasMounted } from "@/utils/customHook";
import { Select } from "antd";
import { useRouter } from "next/navigation";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const ModalMenuUpdate = (props: any) => {
  const {
    isOpenModal,
    setIsOpenModal,
    access_token,
    author,
    setLoading,
    currentMenu,
  } = props;
  const [form] = Form.useForm();
  const [dataUser, setDataUser] = useState([]);
  const router = useRouter();
  useEffect(() => {
    form.setFieldValue("status", currentMenu.status);
    form.setFieldValue("nameMenu", currentMenu.nameMenu);
    form.setFieldValue("description", currentMenu.description);
    form.setFieldValue("_id", currentMenu._id);
  }, [currentMenu]);

  const hasMounted = useHasMounted();
  if (!hasMounted) return <></>;

  const handleUpdateMenu = async (values: any) => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menus/update`,
      method: "PATCH",
      body: {
        ...values,
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    if (res?.data) {
      setIsOpenModal(false);
      notification.success({
        message: "Cập nhập thành công",
      });
      window.location.reload();
    } else {
      notification.error({
        message: "Lỗi cập nhập",
        description: res.message,
      });
    }
  };
  return (
    <>
      <Modal
        title="Cập nhập Menu"
        open={isOpenModal}
        onOk={() => setIsOpenModal(false)}
        onCancel={() => setIsOpenModal(false)}
        maskClosable={false}
        footer={null}
        forceRender={true}
        width={"70%"}
      >
        <Form
          name="verify"
          autoComplete="off"
          layout="vertical"
          form={form}
          onFinish={handleUpdateMenu}
        >
          <Form.Item
            label="Id"
            name="_id"
            rules={[
              {
                required: true,
                message: "Id không được để trống!",
              },
            ]}
          >
            <Input disabled />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tên menu"
                name="nameMenu"
                rules={[
                  {
                    required: true,
                    message: "Tên Menu không được để trống!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Trạng thái"
                name="status"
                rules={[
                  {
                    required: true,
                    message: "Trạng thái không được để trống!",
                  },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  options={[
                    { value: "HIDDEN", label: "Ẩn menu" },
                    { value: "PUBLIC", label: "Hiện menu" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
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

export default ModalMenuUpdate;
