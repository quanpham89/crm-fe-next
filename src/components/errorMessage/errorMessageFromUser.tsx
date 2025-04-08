"use client";

import { handleSendError } from "@/utils/action";
import { useHasMounted } from "@/utils/customHook";
import {
  Button,
  Col,
  Form,
  Input,
  notification,
  Row,
  Select,
  Spin,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import "./errorMessageFromUser.scss";

const ErrorMessageFromUserPage = (props: any) => {
  const { user } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldValue("userId", user?._id);
    form.setFieldValue("role", user?.role);
  }, []);

  const sendError = async (values: any) => {
    const response = await handleSendError("api/v1/error-message", values);
    if (response.data) {
      notification.success({ message: "Gửi lỗi thành công" });
      form.setFieldValue("description", "");
    }
  };
  const hasMounted = useHasMounted();
  if (!hasMounted) return <></>;
  return (
    <div className="error-container ">
      <h3 style={{ textAlign: "center", marginBottom: 20 }}> Góp ý</h3>
      <Form
        name="verify"
        autoComplete="off"
        layout="vertical"
        form={form}
        onFinish={sendError}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              style={{ marginBottom: "10px" }}
              label="Người dùng"
              name="userId"
            >
              <Input disabled style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              style={{ marginBottom: "10px" }}
              label="Phân quyền"
              name="role"
            >
              <Select
                style={{ width: "100%" }}
                disabled
                options={[
                  { value: "ADMIN", label: "Quản trị viên" },
                  { value: "CUSTOMER", label: "khách hàng" },
                  { value: "BUSINESSMAN", label: "Người kinh doanh" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Mô tả" name="description">
          <TextArea rows={10} placeholder="Mô tả lỗi gặp phải" />
        </Form.Item>

        <span style={{ fontSize: 13 }}>
          <b>
            <i>
              Trong quá trình trải nghiệm nếu có bất cứ lỗi nào được phát hiện,
              vui lòng người dùng đưa ra mô tả chi tiết để cải thiện ứng dụng.
            </i>
          </b>
        </span>

        <Form.Item
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 10,
            marginBottom: 0,
          }}
        >
          <Button type="primary" htmlType="submit">
            Gửi
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ErrorMessageFromUserPage;
