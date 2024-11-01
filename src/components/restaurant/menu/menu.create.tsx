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

const ModalCreateMenu = (props: any) => {
  const { isOpenModal, setIsOpenModal, access_token, author, setLoading } =
    props;

  const [form] = Form.useForm();
  const [dataUser, setDataUser] = useState([]);
  const router = useRouter();
  // useEffect(()=>{
  //     form.setFieldValue("_id", currentMenu._id)
  //     form.setFieldValue("email", currentMenu.email)
  //     form.setFieldValue("phone", currentMenu.phone)
  //     form.setFieldValue("name", currentMenu.name)
  //     form.setFieldValue("address", currentMenu.address)
  //     form.setFieldValue("accountType", currentMenu.accountType)
  //     form.setFieldValue("role", currentMenu.role)
  //     form.setFieldValue("sex", currentMenu.sex)

  // }, [currentMenu])

  const createMenus = async (values: any) => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menus`,
      method: "POST",
      body: {
        ...values,
        ...author,
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    // setLoading(true)
    if (res?.data) {
      notification.success({
        message: "Tạo menu thành công",
      });
      setLoading(false);
      setIsOpenModal(false);
      form.resetFields();
      window.location.reload();
    } else {
      notification.error({
        message: "Có lỗi xảy ra, vui lòng thử lại",
        description: res.message,
      });
    }
  };
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const hasMounted = useHasMounted();
  if (!hasMounted) return <></>;
  return (
    <>
      <Modal
        title="Tạo Menu"
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
          onFinish={createMenus}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tên Menu"
                name="nameMenu"
                rules={[
                  {
                    required: true,
                    message: "Tên menu không được để trống!",
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
          <label>Sản phẩm</label>
          <Form.List name="menuItem">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{
                      display: "block",
                      marginBottom: 16,
                      marginTop: 10,
                    }}
                  >
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          valuePropName="fileList"
                          getValueFromEvent={normFile}
                          name={[name, "image"]}
                        >
                          <Upload
                            listType="picture-card"
                            accept="image/png, image/jpeg"
                            maxCount={1}
                            showUploadList={{
                              showPreviewIcon: false,
                            }}
                          >
                            <button
                              style={{ border: 0, background: "none" }}
                              type="button"
                            >
                              <PlusOutlined />
                              <div style={{ marginTop: 8 }}>Tải ảnh</div>
                            </button>
                          </Upload>
                        </Form.Item>
                      </Col>
                      <Col span={11}></Col>
                      <Col span={1}>
                        <MinusCircleOutlined
                          onClick={() => remove(name)}
                          style={{ cursor: "pointer", fontSize: "24px" }}
                        />
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name={[name, "nameItemMenu"]}
                          rules={[
                            {
                              required: true,
                              message: "Tên sản phẩm không được để trống!",
                            },
                          ]}
                        >
                          <Input placeholder="Tên sản phẩm" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name={[name, "description"]}
                          rules={[
                            {
                              required: true,
                              message: "Mô tả không được để trống!",
                            },
                          ]}
                        >
                          <Input placeholder="Mô tả" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name={[name, "fixedPrice"]}
                          rules={[
                            {
                              required: true,
                              message: "Giá bán gốc không được để trống!",
                            },
                          ]}
                        >
                          <InputNumber
                            min={1000}
                            placeholder="Giá bán gốc"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name={[name, "sellingPrice"]}
                          rules={[
                            {
                              required: true,
                              message: "Giá bán không được để trống!",
                            },
                          ]}
                        >
                          <InputNumber
                            min={1000}
                            placeholder="Gián bán"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item
                      name={[name, "quantity"]}
                      rules={[
                        {
                          required: true,
                          message: "Số lượng không được để trống!",
                        },
                      ]}
                    >
                      <InputNumber
                        max={1000}
                        min={1}
                        placeholder="Số lượng"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Space>
                ))}

                {fields.length < 3 && (
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Thêm sản phẩm
                    </Button>
                  </Form.Item>
                )}
              </>
            )}
          </Form.List>

          <Form.Item
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 20,
              marginBottom: 0,
            }}
          >
            <Button type="primary" htmlType="submit">
              Tạo menu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalCreateMenu;
