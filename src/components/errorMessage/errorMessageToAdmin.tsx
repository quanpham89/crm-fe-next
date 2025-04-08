"use client";

import { handleChangeStatusError, handleSendError } from "@/utils/action";
import { useHasMounted } from "@/utils/customHook";
import {
  Button,
  Col,
  Collapse,
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
import dayjs from "dayjs";

const ErrorMessageForAdminPage = (props: any) => {
  const { user, error } = props;
  const [form] = Form.useForm();
  const [listErrors, setListErrors] = useState([]);

  const changeStatus = () => {};

  const handleChangeSelectOption = async (item: any, value: string) => {
    const response = await handleChangeStatusError(
      `api/v1/error-message?_id=${item._id}`,
      user?.access_token
    );
    if (response && response.data) {
      notification.success({ message: "Chuyển trạng thái thành công." });
    } else {
      notification.success({ message: "Có lỗi xảy ra, vui lòng thử lại." });
    }
  };

  useEffect(() => {
    form.setFieldValue("userId", user?._id);
    form.setFieldValue("role", user?.role);
  }, []);

  useEffect(() => {
    if (error && error.length > 0) {
      const listError = error.map((item: any) => {
        return {
          key: item._id,
          label: dayjs(item.createdAt).format("hh:mm _ DD-MM-YYYY"),
          children: (
            <>
              <div
                style={{
                  display: "flex",
                  gap: 40,
                }}
              >
                <span>
                  <b>
                    <i>Tên người góp ý: </i>
                  </b>
                  {item.userId.name}
                </span>
                <span>
                  <b>
                    <i>Vai trò: </i>
                  </b>
                  {item.role}
                </span>
              </div>
              <span>
                <b>
                  <i>Mô tả: </i>
                </b>
                <p>{item.description}</p>
              </span>
              <div>
                <Form
                  name="verify"
                  autoComplete="off"
                  layout="vertical"
                  form={form}
                  onFinish={changeStatus}
                >
                  <Form.Item>
                    <Select
                      defaultValue={item.status}
                      options={[
                        { value: "PENDING", label: "Chờ " },
                        { value: "COMPLETED", label: "Hoàn thành" },
                      ]}
                      onChange={(value) =>
                        handleChangeSelectOption(item, value)
                      }
                    />
                  </Form.Item>
                </Form>
              </div>
            </>
          ),
        };
      });
      setListErrors(listError);
    }
  }, [error]);

  const hasMounted = useHasMounted();
  if (!hasMounted) return <></>;
  return (
    <div className="error-container ">
      <h3 style={{ textAlign: "center", marginBottom: 20 }}> Góp ý</h3>

      <div className="order-container ">
        <Collapse items={listErrors} />
      </div>
    </div>
  );
};

export default ErrorMessageForAdminPage;
