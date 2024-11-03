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
  InputNumber,
} from "antd";
import { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import { sendRequest } from "@/utils/api";
import { useHasMounted } from "@/utils/customHook";
import { Select } from "antd";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

const ModalCreateVoucher = (props: any) => {
  const { isOpenModal, setIsOpenModal, access_token, user } = props;
  const [form] = Form.useForm();
  const [dataUser, setDataUser] = useState([]);
  const router = useRouter();

  const createVoucher = async (values: any) => {
    dayjs.extend(utc);
    const convertedStarteDate = dayjs(values.rangeTime[0].$d).utc().format();
    const convertedEndedDate = dayjs(values.rangeTime[1].$d).utc().format();
    const { rangeTime, ...rest } = values;
    const formatValue = {
      ...rest,
      startedDate: convertedStarteDate,
      endedDate: convertedEndedDate,
      userCreateId: user?._id,
      createdBy: user.name ? user.name : user.email,
    };

    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/vouchers`,
      method: "POST",
      body: {
        ...formatValue,
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    if (res?.data) {
      notification.success({
        message: "Tạo voucher thành công",
      });
      window.location.reload();
    } else {
      notification.error({
        message: "Có lỗi xảy ra, vui lòng thử lại sau.",
        description: res.message,
      });
    }
  };

  const hasMounted = useHasMounted();
  if (!hasMounted) return <></>;
  return (
    <>
      <Modal
        title=" Voucher"
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
          onFinish={createVoucher}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Phạm vi"
                name="scope"
                rules={[
                  {
                    required: true,
                    message: "Phạm vi không được để trống!",
                  },
                ]}
              >
                <Select
                  options={[
                    { value: "FOOD", label: "Thức ăn " },
                    { value: "DRINK", label: "Đồ uống" },
                    { value: "ALL", label: "Tất cả" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Phân loại"
                name="type"
                rules={[
                  {
                    required: true,
                    message: "Phân loại không được để trống!",
                  },
                ]}
              >
                <Select
                  options={[
                    { value: "GIFT", label: "Quà tặng" },
                    { value: "EVENT", label: "Sự kiện" },
                  ]}
                />
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
                  options={[
                    { value: "PUBLIC", label: "Hiển thị" },
                    { value: "HIDDEN", label: "Ẩn" },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Hạn sử dụng"
                name="rangeTime"
                rules={[
                  {
                    required: true,
                    message: "Hạn sử dụng không được để trống!",
                  },
                ]}
              >
                <DatePicker.RangePicker
                  placeholder={["From", "To"]}
                  allowEmpty={[false, true]}
                  onChange={(date, dateString) => {}}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Tên"
            name="nameVoucher"
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
            label="Phần trăm giảm"
            name="percentage"
            rules={[
              {
                required: true,
                message: "Phần trăm giảm không được để trống!",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} min={1} max={100} />
          </Form.Item>

          <Form.Item
            label="Số lượng"
            name="amount"
            rules={[
              {
                required: true,
                message: "Số lượng không được để trống!",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} min={1} max={10} />
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
              Tạo
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalCreateVoucher;
