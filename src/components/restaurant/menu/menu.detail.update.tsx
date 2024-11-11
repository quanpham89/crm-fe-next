"use client";

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

const MenuDetailUpdate = (props: any) => {
  const { role, menuItems, user, access_token } = props;
  const [isLoading, setLoading] = useState(false);

  const router = useRouter();
  const pathName = usePathname();
  const [form] = Form.useForm();

  const [idItemChange, setIdItemChange] = useState<any>([]);

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const formatValueMenuItem = menuItems.map((item: any) => {
    return {
      nameItemMenu: item.nameItemMenu,
      description: item.description,
      fixedPrice: item.fixedPrice,
      sellingPrice: item.sellingPrice,
      remain: item.remain,
      status: item.status,
      _id: item._id,
      image: [
        {
          deleteUrl: item.deleteUrl,
          url: item.image,
        },
      ],
    };
  });

  const initialValues = {
    menuItem: formatValueMenuItem,
  };

  const valueChange = (changedValues: any, allValues: any) => {
    for (const key in changedValues.menuItem) {
      if (changedValues.menuItem[key]) {
        setIdItemChange((value: any) => [...value, menuItems[key]._id]);
      }
    }
  };

  const handleMenuChange = async (values: any) => {
    const uniqueIdItemsFilter = idItemChange.filter(
      (item: any, index: any) => idItemChange.indexOf(item) === index
    );
    const filteredMenuItemChange = values.menuItem.filter((item: any) =>
      uniqueIdItemsFilter.includes(item._id)
    );
    if (filteredMenuItemChange && filteredMenuItemChange.length > 0) {
      const response = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menu-items/update-menu-item`,
        method: "POST",
        body: {
          ...filteredMenuItemChange,
        },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      if (response && response.statusCode === 201) {
        notification.success({
          message: "Cập nhập thành công.",
        });
        window.location.reload();
      } else {
        notification.success({
          message: "có lỗi xảy ra, vui lòng thử lại sau.",
        });
      }
    }
  };

  return isLoading ? (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Spin />
    </div>
  ) : (
    <>
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
          onFinish={handleMenuChange}
          initialValues={initialValues}
          onValuesChange={(changedValues, allValues) =>
            valueChange(changedValues, allValues)
          }
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
                      <Form.Item
                        name={[name, "_id"]}
                        rules={[
                          {
                            required: true,
                            message: "_id không dược để trống!",
                          },
                        ]}
                        hidden
                      >
                        <Input disabled />
                      </Form.Item>
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
                        <Col span={1}></Col>
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
                          <Form.Item name={[name, "remain"]}>
                            <InputNumber
                              min={1}
                              placeholder="Số lượng còn lại"
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
                                message:
                                  "Giá gốc sản phẩm không được để trống!",
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
              Cập nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default MenuDetailUpdate;
