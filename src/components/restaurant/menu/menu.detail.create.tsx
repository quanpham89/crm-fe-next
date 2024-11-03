"use client";

import { AdminContext } from "@/library/admin.context";
import { handleGetData, handleGetDataPerPage } from "@/utils/action";
import { sendRequest } from "@/utils/api";
import {
  BarsOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  MinusCircleOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Descriptions,
  Form,
  Input,
  InputNumber,
  notification,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Upload,
} from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import "../Pagination.scss";

const MenuDetailCreate = (props: any) => {
  const { restaurantId, role, access_token, menuInfo } = props;
  const [form] = Form.useForm();
  const author = {
    nameMenu: menuInfo?.nameMenu,
    restaurantId: menuInfo?.restaurantId,
    status: menuInfo?.status,
    menuId: menuInfo?.menuId,
  };
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleCreateItem = async (values: any) => {
    if (values.menuItem && values.menuItem.length > 0) {
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menu-items`,
        method: "POST",
        body: {
          ...values,
          ...author,
        },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      if (res.data?.EC === 0) {
        form.resetFields();
        notification.success({
          message: "Tạo sản phẩm thành công.",
        });
      }
    } else {
      notification.error({
        message: "Bạn cần ít nhất 1 sản phẩm để tạo.",
      });
    }
  };
  return (
    <div
      className="list-item-menu"
      style={{
        border: "1px solid #d9d9d9",
        padding: 10,
        borderRadius: 8,
        height: "50vh",
      }}
    >
      <Form
        name="verify"
        autoComplete="off"
        layout="vertical"
        form={form}
        onFinish={handleCreateItem}
      >
        <div style={{ padding: "10px", height: "45vh", overflow: "scroll" }}>
          <Form.List name="menuItem">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "block", marginBottom: 16 }}
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
                              message: "Tên không được để trống!",
                            },
                          ]}
                        >
                          <Input placeholder="Tên  sản phẩm" />
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
                          name={[name, "quantity"]}
                          rules={[
                            {
                              required: true,
                              message: "Số lượng sản phẩm không được để trống!",
                            },
                          ]}
                        >
                          <InputNumber
                            min={1}
                            placeholder="Số lượng"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name={[name, "status"]}>
                          <Select
                            placeholder="Trạng thái"
                            options={[
                              { value: "HIDDEN", label: "Ẩn sản phẩm" },
                              { value: "PUBLIC", label: "Hiện sản phẩm" },
                            ]}
                          ></Select>
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
                              message: "Giá gốc sản phẩm không được để trống!",
                            },
                          ]}
                        >
                          <InputNumber
                            min={1000}
                            placeholder="Giá gốc sản phẩm"
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
                            placeholder="Giá bán"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
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
        </div>
        <Form.Item
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 0,
          }}
        >
          <Button type="primary" htmlType="submit">
            Tạo sản phẩm
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default MenuDetailCreate;
