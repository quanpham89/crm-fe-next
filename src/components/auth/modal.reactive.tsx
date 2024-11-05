"use client";
import { Modal, Steps, Form, Button, Input, message, notification } from "antd";
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

const ModalReactive = (props: any) => {
  const { isOpenModal, setIsOpenModal, userEmail, setUserEmail } = props;
  const [form] = Form.useForm();
  const [userId, setUserId] = useState("");
  useEffect(() => {
    form.setFieldValue("email", userEmail);
  }, [userEmail]);

  const [current, setCurrent] = useState(0);

  const sendEmail = async (values: any) => {
    const { email } = values;
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/re-active`,
      method: "POST",
      body: {
        email,
      },
    });

    if (res?.data) {
      setCurrent(1);
      setUserId(res?.data?._id);
    } else {
      notification.error({
        message: "Có lỗi xảy ra, vui lòng thử lại",
        description: res?.message,
      });
    }
  };
  const verifyCode = async (values: any) => {
    const { code } = values;
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/verify`,
      method: "POST",
      body: {
        _id: userId,
        code,
      },
    });

    if (res?.data) {
      setCurrent(2);

      setTimeout(() => {
        setIsOpenModal(false);
      }, 2000);
    } else {
      notification.error({
        message: "Có lỗi xảy ra, vui lòng thử lại",
        description: res?.message,
      });
    }
  };

  const hasMounted = useHasMounted();
  if (!hasMounted) return <></>;

  return (
    <>
      <Modal
        title="Kích hoạt tài khoản của bạn"
        open={isOpenModal}
        onOk={() => setIsOpenModal(false)}
        onCancel={() => setIsOpenModal(false)}
        maskClosable={false}
        footer={null}
        forceRender={true}
      >
        <Steps
          current={current}
          items={[
            {
              title: "Đăng nhập",
              icon: <UserOutlined />,
            },
            {
              title: "Xác thực",
              icon: <SolutionOutlined />,
            },
            {
              title: "Hoàn thành",
              // status: 'wait',
              icon: <SmileOutlined />,
            },
          ]}
        />
        {current === 0 && (
          <>
            <div style={{ marginTop: "20px 0" }}>
              <p>
                Tài khoản chưa được kích hoạt. Chọn nhập mã code để nhận mã code
                và kích hoạt tài khoản.
              </p>
            </div>
            <Form
              name="verify"
              autoComplete="off"
              layout="vertical"
              form={form}
              onFinish={sendEmail}
            >
              <Form.Item label="Email" name="email">
                <Input disabled />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Nhập mã code
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
        {current === 1 && (
          <>
            <div style={{ marginTop: "20px 0" }}>
              <p>Nhập mã code để kích hoạt tài khoản của bạn.</p>
            </div>
            <Form
              name="verify"
              autoComplete="off"
              layout="vertical"
              form={form}
              onFinish={verifyCode}
            >
              <Form.Item
                label="Code"
                name="code"
                rules={[
                  {
                    required: true,
                    message: "Please input your code!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Nhập mã code
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
        {current === 2 && (
          <>
            <div style={{ marginTop: "20px 0" }}>
              <p>Tài khoản của kích hoạt thành công.</p>
            </div>
            <p
              style={{ textAlign: "center", fontSize: "32px", color: "green" }}
            >
              <CheckCircleOutlined />
            </p>
          </>
        )}
      </Modal>
    </>
  );
};

export default ModalReactive;
