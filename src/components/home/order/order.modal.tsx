import { useHasMounted } from "@/utils/customHook";
import {
  Button,
  Col,
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Row,
  Select,
  Space,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useContext, useEffect } from "react";
import type { DatePickerProps, GetProps } from "antd";
import en from "antd/es/date-picker/locale/en_US";
import enUS from "antd/es/locale/en_US";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { RangePickerProps } from "antd/es/date-picker";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { CustomerContext } from "@/library/customer.context";
import { helper } from "@/app/helpers/customize";

const OderModal = (props: any) => {
  const { isOpenModal, setIsOpenModal, currentItem, setCurrentItem, user } =
    props;
  const [form] = Form.useForm();
  const { currentCart, setCurrentCart } = useContext(CustomerContext)!;

  type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
  dayjs.extend(customParseFormat);
  dayjs.extend(buddhistEra);

  const hasMounted = useHasMounted();
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const { cart } = JSON.parse(storedCart);
      setCurrentCart(cart);
    }
  }, []);
  useEffect(() => {
    form.setFieldValue("menuItemId", currentItem?._id);
    form.setFieldValue("restaurantId", currentItem?.restaurantId);
    form.setFieldValue("restaurantName", currentItem?.restaurantName);
    form.setFieldValue("nameItemMenu", currentItem?.nameItemMenu);
    form.setFieldValue("nameMenu", currentItem?.nameMenu);
    form.setFieldValue("menuId", currentItem?.menuId);
    form.setFieldValue("description", currentItem?.description);
    form.setFieldValue("remain", currentItem?.remain);
    form.setFieldValue("sellingPrice", currentItem?.sellingPrice);
    form.setFieldValue("orderTime", dayjs());
  }, [currentItem]);

  if (!hasMounted) return <></>;
  const handleCloseModal = () => {
    setIsOpenModal(false);
    setCurrentItem("");
    form.resetFields();
  };

  const handleAddItemToCart = (values: any) => {
    const storedCart = localStorage.getItem("cart");
    const currentCart = storedCart ? JSON.parse(storedCart) : {};
    const userCart = currentCart[user?._id] || [];

    const checkItemExistInCart = helper.isExistItemInCart(userCart, values);
    let updatedCart;

    if (checkItemExistInCart) {
      updatedCart = userCart.map((item: any) => {
        if (item.menuItemId === values.menuItemId) {
          if (+item.amount + +values.amount > +values.remain) {
            notification.error({
              message: `Hiện tại bạn đã có ${item.amount} sản phẩm trong giỏ hàng. Yêu cầu vượt quá giới hạn sản phẩm đang có(${values.remain}), vui lòng giảm số lượng sản phẩm để thực hiện yêu cầu.`,
            });
            return item;
          }
          return {
            ...item,
            amount: item.amount + values.amount,
          };
        }
        return item;
      });
    } else {
      updatedCart = [...userCart, values];
    }

    currentCart[user?._id] = updatedCart;

    localStorage.setItem("cart", JSON.stringify(currentCart));
    setCurrentCart(updatedCart);
    handleCloseModal();
  };

  return (
    <>
      <Modal
        title="Đơn hàng"
        open={isOpenModal}
        onCancel={handleCloseModal}
        maskClosable={false}
        forceRender={true}
        footer={null}
      >
        <Form
          name="verify"
          autoComplete="off"
          layout="vertical"
          form={form}
          onFinish={handleAddItemToCart}
        >
          <Form.Item
            label="menuItemId"
            name="menuItemId"
            hidden
            rules={[
              {
                required: true,
                message: "menuItemId không được để trống!",
              },
            ]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="restaurantId"
            name="restaurantId"
            hidden
            rules={[
              {
                required: true,
                message: "restaurantId không được để trống!",
              },
            ]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="restaurantName"
            name="restaurantName"
            hidden
            rules={[
              {
                required: true,
                message: "restaurantName không được để trống!",
              },
            ]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item label="Tên món ăn" name="nameItemMenu">
            <Input disabled />
          </Form.Item>

          <Form.Item label="menuId" name="menuId" hidden>
            <Input disabled />
          </Form.Item>

          <Form.Item label="Menu" name="nameMenu">
            <Input disabled />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <textarea
              disabled
              style={{
                width: "95%",
                borderRadius: 8,
                resize: "none",
                padding: 10,
              }}
            />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Số lượng còn lại: " name="remain">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Giá bán: " name="sellingPrice">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={`Số lượng mua (tối đa ${+currentItem?.remain}): `}
            name="amount"
            rules={[
              {
                required: true,
                message: "Số lượng sản phẩm không được để trống!",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              max={+currentItem?.remain}
              min={1}
            />
          </Form.Item>

          <Form.Item style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="primary" htmlType="submit">
              Thêm vào giỏ hàng
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default OderModal;
