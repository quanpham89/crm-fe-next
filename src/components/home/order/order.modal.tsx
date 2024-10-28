import { useHasMounted } from "@/utils/customHook";
import { Button, Col, ConfigProvider, DatePicker, Form, Input, InputNumber, Modal, notification, Row, Select, Space } from "antd"
import { useForm } from "antd/es/form/Form";
import { useContext, useEffect } from "react";
import type { DatePickerProps, GetProps } from 'antd';
import en from 'antd/es/date-picker/locale/en_US';
import enUS from 'antd/es/locale/en_US';
import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import { RangePickerProps } from "antd/es/date-picker";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { CustomerContext } from "@/library/customer.context";
import { helper } from "@/app/helpers/customize";


const OderModal = (props: any) => {
    const { isOpenModal, setIsOpenModal, currentItem, setCurrentItem, user } = props
    const [form] = Form.useForm()
    const { currentCart, setCurrentCard } = useContext(CustomerContext)!;
 
    type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
    dayjs.extend(customParseFormat);
    dayjs.extend(buddhistEra);


    const hasMounted = useHasMounted();
    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            const { cart } = JSON.parse(storedCart);
            setCurrentCard(cart);
        }
    }, []);
    useEffect(() => {
        form.setFieldValue("menuItemId", currentItem?._id)
        form.setFieldValue("restaurantId", currentItem?.restaurantId)
        form.setFieldValue("restaurantName", currentItem?.restaurantName)
        form.setFieldValue("nameItemMenu", currentItem?.nameItemMenu)
        form.setFieldValue("nameMenu", currentItem?.nameMenu)
        form.setFieldValue("menuId", currentItem?.menuId)
        form.setFieldValue("description", currentItem?.description)
        form.setFieldValue("quantity", currentItem?.quantity)
        form.setFieldValue("sellingPrice", currentItem?.sellingPrice)
        form.setFieldValue("orderTime", dayjs())
    }, [currentItem])


    if (!hasMounted) return <></>;
    const handleCloseModal = () => {
        setIsOpenModal(false)
        setCurrentItem("")
        form.resetFields()

    }

    const handleAddItemToCart = (values: any) => {
        const checkItemExistInCart = helper.isExistItemInCart(currentCart, values);
        let updatedCart;
        
        if (checkItemExistInCart) {
            updatedCart = currentCart.map((item: any) => {
                if (item.menuItemId === values.menuItemId) {
                    if (+item.amount + +values.amount > +values.quantity) { 
                        notification.error({
                            message: `Hiện tại bạn đã có ${item.amount} sản phẩm trong giỏ hàng. Yêu cầu vượt quá giới hạn sản phẩm đang có(${values.quantity}), vui lòng giảm số lượng sản phẩm để thực hiện yêu cầu.`
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
            updatedCart = [...currentCart, values];
        }
        const cart = {
            userId: user?._id,
            cart: updatedCart, 
        };
    
        setCurrentCard(updatedCart); 
        localStorage.setItem('cart', JSON.stringify(cart));
        handleCloseModal()
    };
    


  


    return <>
        <Modal title="Đơn hàng"
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
                            message: 'menuItemId không được để trống!',
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
                            message: 'restaurantId không được để trống!',
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
                            message: 'restaurantName không được để trống!',
                        },
                    ]}
                >
                    <Input disabled />
                </Form.Item>
                <Form.Item
                    label="Tên món ăn"
                    name="nameItemMenu"
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    label="menuId"
                    name="menuId"
                    hidden
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    label="Menu"
                    name="nameMenu"
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"

                >
                    <textarea disabled style={{ width: "95%", borderRadius: 8, resize: "none", padding: 10 }} />
                </Form.Item>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Số lượng còn lại: "
                            name="quantity"
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Giá bán: "
                            name="sellingPrice"
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>
                </Row>

                {/* <Form.Item
                    label="Địa chỉ người nhận:"
                    name="address"
                    rules={[
                        {
                            required: true,

                            message: 'Địa chỉ nhận hàng không được để trống!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item> */}

                {/* <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Thời gian đặt"
                            name="orderTime"
                            rules={[
                                {
                                    required: true,
                                    message: 'orderTime không được để trống!',
                                },
                            ]}
                        >
                            <DatePicker format={"DD-MM-YYYY HH-mm"} disabled style={{ width: "100%" }} />

                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Dự kiến thời gian nhận hàng"
                            name="predictionTime"
                            rules={[
                                {
                                    required: true,
                                    message: 'predictionTime không được để trống!',
                                },
                            ]}
                        >
                            <ConfigProvider locale={globalBuddhistLocale}>
                                <DatePicker
                                    placeholder="Chọn ngày/ giờ"
                                    showTime
                                    showNow={false}
                                    onChange={(date, dateString) => {
                                        form.setFieldValue("predictionTime", date);
                                    }
                                    }
                                    style={{ width: "100%" }}
                                    disabledDate={disabledDate}
                                    disabledTime={disabledTime}
                                />
                            </ConfigProvider>

                        </Form.Item>
                    </Col>
                </Row> */}

                <Form.Item
                    label={`Số lượng mua (tối đa ${+currentItem?.quantity}): `}
                    name="amount"
                    rules={[
                        {
                            required: true,
                            message: 'Số lượng sản phẩm không được để trống!',
                        },
                    ]}

                >
                    <InputNumber style={{ width: "100%" }} max={+currentItem?.quantity} min={1} />
                </Form.Item>

                

                <Form.Item style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button type="primary" htmlType="submit">
                        Thêm vào giỏ hàng
                    </Button>
                </Form.Item>
            </Form>
        </Modal>

    </>


}

export default OderModal