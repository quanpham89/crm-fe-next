"use client";
import React from "react";
import { Button, Col, Divider, Form, Input, notification, Row } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import { sendRequest } from "@/utils/api";
import { useRouter } from "next/navigation";
import "./Login.scss";

const Register = () => {
  const router = useRouter();

  const onFinish = async (values: any) => {
    const { email, password, name } = values;
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/register`,
      method: "POST",
      body: {
        email,
        name,
        password,
      },
    });
    if (res?.data) {
      router.push(`/verify/${res?.data?._id}`);
    } else {
      notification.error({
        message: "Register error",
        description: res?.message,
      });
    }
  };

  return (
    <div className="container">
      <div className="login-form">
        <Row>
          <Col xs={24} md={16} lg={8}>
            <fieldset
              style={{
                padding: "15px",
                margin: "5px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              <legend>Đăng Ký Tài Khoản</legend>
              <Form
                name="basic"
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
              >
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
                  label="Mật khẩu"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Password không được để trống!",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
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

                <Form.Item>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button type="primary" htmlType="submit">
                      Đăng kí
                    </Button>
                  </div>
                </Form.Item>
              </Form>
              <Link href={"/"}>
                <ArrowLeftOutlined /> Quay lại trang chủ
              </Link>
              <Divider />
              <div style={{ textAlign: "center" }}>
                Đã có tài khoản? <Link href={"/auth/login"}>Đăng nhập</Link>
              </div>
            </fieldset>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Register;
