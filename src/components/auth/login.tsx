"use client";
import { Button, Col, Divider, Form, Input, notification, Row } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import { authenticate } from "@/utils/action";
import { useRouter } from "next/navigation";
import ModalReactive from "./modal.reactive";
import { useEffect, useState } from "react";
import ModalChangePassword from "./modal.change.password";
import "./Login.scss";
const Login = () => {
  const router = useRouter();
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [userEmail, setUserEmail] = useState("");
  const [changePassword, setChangePassword] = useState(false);

  const onFinish = async (values: any) => {
    const { username, password } = values;
    // trigger sign-in
    const res = await authenticate(username, password);
    if (res?.error) {
      // error
      notification.error({
        message: "Error login",
        description: res?.error,
      });
      if (res?.code === 2) {
        setIsOpenModal(true);
        setUserEmail(username);
        return;
      }
    } else {
      router.push("/auth/role");
    }
  };

  return (
    <div className="container">
      <div className="login-form">
        <Row>
          <Col xs={24} sm={20} md={16} lg={12} xl={8}>
            <fieldset
              style={{
                padding: "15px",
                margin: "5px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                width: "100%",
              }}
            >
              <legend>Đăng Nhập</legend>
              <Form
                name="basic"
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
              >
                <Form.Item
                  label="Email"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng điền email!",
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
                      message: "Vui lòng điền mật khẩu!",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Button type="primary" htmlType="submit">
                      Đăng nhập
                    </Button>
                    <Button type="link" onClick={() => setChangePassword(true)}>
                      {" "}
                      Quên mật khẩu
                    </Button>
                  </div>
                </Form.Item>
              </Form>
              <Link href={"/"}>
                <ArrowLeftOutlined /> Quay lại trang chủ
              </Link>
              <Divider />
              <div style={{ textAlign: "center" }}>
                Chưa có tài khoản?{" "}
                <Link href={"/auth/register"}>Đăng ký tại đây</Link>
              </div>
            </fieldset>
          </Col>
        </Row>
      </div>
      <ModalReactive
        isOpenModal={isOpenModal}
        setIsOpenModal={setIsOpenModal}
        userEmail={userEmail}
        setUserEmail={setUserEmail}
      />
      <ModalChangePassword
        isModalOpen={changePassword}
        setIsModalOpen={setChangePassword}
      />
    </div>
  );
};

export default Login;
