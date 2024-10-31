"use client";
import {
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Checkbox,
  Col,
  ConfigProvider,
  DatePicker,
  DatePickerProps,
  Descriptions,
  Form,
  GetProps,
  Input,
  InputNumber,
  InputRef,
  notification,
  Pagination,
  Row,
  Select,
  Space,
  Spin,
  Table,
  TableColumnsType,
  TableColumnType,
} from "antd";
import { Children, use, useContext, useEffect, useRef, useState } from "react";
import { sendRequest } from "@/utils/api";
import { BusinessContext } from "@/library/business.context";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import {
  CloseOutlined,
  EditOutlined,
  MinusOutlined,
  PlusOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { CustomerContext } from "@/library/customer.context";
import { helper } from "@/app/helpers/customize";
import { RangePickerProps } from "antd/es/date-picker";
import en from "antd/es/date-picker/locale/en_US";
import enUS from "antd/es/locale/en_US";
import buddhistEra from "dayjs/plugin/buddhistEra";
import ModalConfirmOrder from "../modalConfirm.order";
import _ from "lodash";
interface DataType {
  key: string;
  restaurantName: string;
  nameMenu: string;
  nameItemMenu: string;
  pricePerProduct: number;
  amount: number;
  totalPrice: number;
  quantity: number;
  sellingPrice: number;
  voucher: string;
  coupon: string;
}

interface optionSelect {
  value: string;
  label: string;
}
const Cart = (props: any) => {
  const { user, vouchers, coupons, domainUrl, customerId} = props;

  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const [dataColumn, setDataColumn] = useState([]);
  const [isOpenModalConfirmOrder, setIsOpenModalConfirmOrder] = useState(false);
  const [dataConfirmOrder, setDataConfirmOrder] = useState({});
  const [dataVoucher, setDataVoucher] = useState<optionSelect[]>([]);
  const [dataCoupon, setDataCoupon] = useState<optionSelect[]>([]);
  const [total, setTotal] = useState("0");
  const [totalDisplay, setTotalDisplay] = useState("0");
  const [voucher, setVoucher] = useState<any>({});
  const [coupon, setCoupon] = useState<any>({});
  const { currentCart, setCurrentCart } = useContext(CustomerContext)!;
  type NewType = keyof DataType;
  type DataIndex = keyof DataType;
  type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
  const [form] = Form.useForm();
  const router = useRouter();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    form.setFieldValue("orderTime", dayjs());
    if (storedCart) {
      const { cart } = JSON.parse(storedCart);
      setCurrentCart(cart);
    }
    const emptyOption: optionSelect = {
      value: "",
      label: "Bỏ chọn",
    };
    const formatDataVoucher = vouchers.map((item: any) => {
      return {
        value: item._id,
        label: item.nameVoucher,
      };
    });
    setDataVoucher([emptyOption, ...formatDataVoucher]);
    const formatDataCoupon = coupons.map((item: any) => {
      return {
        value: item._id,
        label: item.nameCoupon,
      };
    });
    setDataCoupon([emptyOption, ...formatDataCoupon]);
  }, []);
  useEffect(() => {
    form.setFieldValue("orderTime", dayjs());
    const dataCart = currentCart.map((item: any) => {
      const sellingPrice = +item.sellingPrice;
      const quantity = +item.quantity;
      const amount = +item.amount;

      return {
        key: item.menuItemId,
        nameItemMenu: item.nameItemMenu,
        sellingPrice: helper.formatMoneyVND(sellingPrice),
        quantity,
        amount,
        totalPrice: helper.formatMoneyVND(
          Math.round((amount * sellingPrice) / 1000) * 1000
        ),
        voucher: (
          <Select
            style={{ width: "100%" }}
            disabled
            placeholder="Chức năng này hiện tại vẫn đang được phát triển."
            options={[
              { value: "money", label: "Tiền mặt" },
              { value: "bank", label: "Chuyển khoản" },
            ]}
          />
        ),
        coupon: (
          <Select
            style={{ width: "100%" }}
            disabled
            placeholder="Chức năng này hiện tại vẫn đang được phát triển."
            options={[
              { value: "money", label: "Tiền mặt" },
              { value: "card", label: "Thẻ" },
              { value: "bank", label: "Chuyển khoản" },
            ]}
          />
        ),
      };
    });
    setDataColumn(dataCart);
    if (dataCart.length > 0) {
      const totalPrice = dataCart.reduce((accumulator: any, item: any) => {
        return (
          accumulator + item.amount * +helper.parsePrice(item.sellingPrice)
        );
      }, 0);
      const roundTotalPrice = Math.round(totalPrice / 1000) * 1000;
      setTotal(String(roundTotalPrice));
      setTotalDisplay(String(roundTotalPrice));
    } else {
      setTotal("0");
      setTotalDisplay("0");
    }
  }, [currentCart]);

  const handleRemoveAllCart = () =>{
    form.resetFields()
    if(localStorage.getItem("cart")){
        setCurrentCart([])
        localStorage.removeItem('cart');
        notification.success({message: "Xóa toàn bộ sản phẩm khỏi giỏ hàng thành công."})
    }else{
        notification.error({message: "Giỏ hàng trống."})
    }
    
  }

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleRemoveItem = (record: any) => {
    if (currentCart && currentCart.length > 0) {
      const cartAfterRemoveItem = currentCart.filter((item: any) => {
        return item.menuItemId !== record.key;
      });
      form.resetFields();
      setCurrentCart(cartAfterRemoveItem);
    }
  };

  const handleReduceItem = (record: any) => {
    if (currentCart && currentCart.length > 0) {
      const cartAfterReduceItem = currentCart.map((item: any) => {
        if (item.menuItemId === record.key && item.amount > 1) {
          item.amount -= 1;
        }
        return item;
      });
      form.resetFields();
      setCurrentCart(cartAfterReduceItem);
    }
  };

  const handleAddItem = (record: any) => {
    if (currentCart && currentCart.length > 0) {
      const cartAfterReduceItem = currentCart.map((item: any) => {
        if (item.menuItemId === record.key && record.amount < item.quantity) {
          item.amount += 1;
        }
        return item;
      });
      form.resetFields();
      setCurrentCart(cartAfterReduceItem);
    }
  };

  const columns: any = [
    {
      title: "Tổng sản phẩm",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a: DataType, b: DataType) => a.quantity - b.quantity,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "nameItemMenu",
      key: "nameItemMenu",
      width: "15%",
      ...getColumnSearchProps("nameItemMenu"),
    },
    {
      title: "Giá tiền",
      dataIndex: "sellingPrice",
      key: "sellingPrice",
      sorter: (a: DataType, b: DataType) =>
        helper.parsePrice(a.sellingPrice) - helper.parsePrice(b.sellingPrice),
    },

    {
      title: "Số lượng mua",
      dataIndex: "amount",
      key: "amount",
      sorter: (a: DataType, b: DataType) => a.amount - b.amount,
      render: (text: string, record: any) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 40,
          }}
        >
          <MinusOutlined onClick={() => handleReduceItem(record)} />
          <span>{record.amount}</span>
          <PlusOutlined onClick={() => handleAddItem(record)} />
        </div>
      ),
    },
    {
      title: "Tổng số tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      sorter: (a: DataType, b: DataType) =>
        helper.parsePrice(a.totalPrice) - helper.parsePrice(b.totalPrice),
    },
    {
      title: "Voucher",
      dataIndex: "voucher",
      key: "voucher",
      width: "10%",
    },
    {
      title: "Coupon",
      dataIndex: "coupon",
      key: "coupon",
      width: "10%",
    },

    {
      title: "",
      dataIndex: "action",
      key: "action",
      render: (text: string, record: any) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 40,
            fontSize: 20,
          }}
        >
          <CloseOutlined onClick={() => handleRemoveItem(record)} />
        </div>
      ),
    },
  ];

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: NewType
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };
  const handleTableChange = (pagination: any) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  const buddhistLocale: typeof en = {
    ...en,
    lang: {
      ...en.lang,
      fieldDateFormat: "DD-MM-YYYY",
      fieldDateTimeFormat: "DD-MM-YYYY HH:mm",
      yearFormat: "YYYY",
      cellYearFormat: "YYYY",
    },
  };

  const globalBuddhistLocale: typeof enUS = {
    ...enUS,
    DatePicker: {
      ...enUS.DatePicker!,
      lang: buddhistLocale.lang,
    },
  };

  const range = (start: number, end: number) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current < dayjs().startOf("day");
  };

  const disabledTime: DatePickerProps["disabledTime"] = (date) => {
    const currentTime = dayjs();
    const minTime = currentTime.add(20, "minute");

    if (date && date.isSame(currentTime, "day")) {
      return {
        disabledHours: () => {
          const hours = [];
          for (let i = 0; i < 24; i++) {
            if (i < minTime.hour()) {
              hours.push(i);
            }
          }
          return hours;
        },
        disabledMinutes: (hour: number) => {
          if (hour === minTime.hour()) {
            return range(0, minTime.minute());
          }
          return [];
        },
        disabledSeconds: () => [],
      };
    }

    return {
      disabledHours: () => [],
      disabledMinutes: () => [],
      disabledSeconds: () => [],
    };
  };

  const handleAddVoucher = (selectedOption: string) => {
    const currentTotal = total;
    if(dataColumn.length > 0){
      if (selectedOption) {
        const voucherSelected = vouchers.filter(
          (item: any) => item._id === selectedOption
        );
        setVoucher(voucherSelected);
        if (!_.isEmpty(coupon) && coupon[0].discount) {
          const formatTotal =
            (Number(currentTotal) - coupon[0].discount) *
            (1 - voucherSelected[0].percentage / 100);
          setTotalDisplay(String(formatTotal));
        } else {
          const formatTotal =
            Number(currentTotal) * (1 - voucherSelected[0].percentage / 100);
          setTotalDisplay(String(Math.round(formatTotal / 1000) * 1000));
        }
      } else {
        setVoucher({});
        setTotalDisplay(String(total));
        if (!_.isEmpty(coupon) && coupon[0].discount) {
          const formatTotal = Number(currentTotal) - coupon[0].discount;
          setTotalDisplay(String(formatTotal));
        }
      }
    }
  };

  const handleAddCoupon = (selectedOption: string) => {
    const currentTotal = total;
    if(dataColumn.length >0){
      if (selectedOption) {
        const couponSelected = coupons.filter(
          (item: any) => item._id === selectedOption
        );
        if (!_.isEmpty(voucher) && voucher[0].percentage) {
          const formatTotal =
            (Number(currentTotal) - couponSelected[0].discount) *
            (1 - voucher[0].percentage / 100);
          setTotalDisplay(String(Math.round(formatTotal / 1000) * 1000));
        } else {
          const formatTotal = Number(currentTotal) - couponSelected[0].discount;
          setTotalDisplay(String(Math.round(formatTotal / 1000) * 1000));
        }
        setCoupon(couponSelected);
      } else {
        setCoupon({});
        setTotalDisplay(String(Math.round(Number(total) / 1000) * 1000));
        if (!_.isEmpty(voucher) && voucher[0].percentage) {
          const formatTotal =
            Number(currentTotal) * (1 - voucher[0].percentage / 100);
          setTotalDisplay(String(Math.round(formatTotal / 1000) * 1000));
        }
      }
    }
  };

  const handleBuyItem = (values: any) => {
    values.orderTime = values.orderTime.$d;
    values.predictionTime = values.predictionTime.$d;
    setDataConfirmOrder({
      cart: currentCart,
      ...values,
      totalPrice: totalDisplay,
      totalWithoutDiscount: total,
      customerId: customerId
    });
    if(currentCart && currentCart.length > 0){
      setIsOpenModalConfirmOrder(true);
    }else{
      notification.error({
        message: "Giỏ hàng của bạn không có sản phẩm, vui lòng chọn sản phẩm để thực hiện thanh toán."
      })
    }
  };

  return isLoading ? (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spin />
    </div>
  ) : (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 20,
          fontSize: 20,
          fontWeight: 600,
        }}
      >
        <span>Thông tin mua hàng</span>
      </div>

      <div>
        <Form
          name="verify"
          autoComplete="off"
          layout="vertical"
          form={form}
          onFinish={handleBuyItem}
        >
          <Form.Item
            label="Địa chỉ người nhận:"
            name="address"
            rules={[
              {
                required: true,

                message: "Địa chỉ nhận hàng không được để trống!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Thời gian đặt"
                name="orderTime"
                rules={[
                  {
                    required: true,
                    message: "Thời gian đặt hàng không được để trống!",
                  },
                ]}
              >
                <DatePicker
                  format={"DD-MM-YYYY HH-mm"}
                  disabled
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Dự kiến thời gian nhận hàng"
                name="predictionTime"
                rules={[
                  {
                    required: true,
                    message: "Thời gian nhận hàng không được để trống!",
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
                    }}
                    style={{ width: "100%" }}
                    disabledDate={disabledDate}
                    disabledTime={disabledTime}
                  />
                </ConfigProvider>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Hình thức thanh toán: "
            name="paymentForm"
            rules={[
              {
                required: true,
                message: "Hình thức thanh toán không được để trống!",
              },
            ]}
          >
            <Select
              options={[
                { value: "money", label: "Tiền mặt" },
                { value: "bank", label: "Chuyển khoản" },
              ]}
            ></Select>
          </Form.Item>

          <Form.Item label="Voucher: " name="voucher">
            <Select options={dataVoucher} onChange={handleAddVoucher}></Select>
          </Form.Item>

          <Form.Item label="Coupon: " name="coupon">
            <Select options={dataCoupon} onChange={handleAddCoupon}></Select>
          </Form.Item>

          <div>
            <i>
              Note:
              <span> </span>
              <b style={{ fontSize: 12 }}>
                Nếu khách hàng áp dụng cả coupon và voucher thì sẽ giảm giá theo
                coupon trước sau đó mới giảm theo % của voucher.
              </b>
            </i>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <div>Tổng thanh toán:</div>
            <div>{helper.formatMoneyVND(Number(totalDisplay))}</div>
          </div>

          <Form.Item style={{ display: "flex", justifyContent: "flex-end", gap: 20 }}>
            <Button onClick={handleRemoveAllCart} style={{marginRight: 20 }}>
              Xóa toàn bộ giỏ hàng
            </Button>
            <Button type="primary" htmlType="submit">
              Mua hàng
            </Button>
          </Form.Item>
        </Form>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 20,
          fontSize: 20,
          fontWeight: 600,
        }}
      >
        <span>Giỏ hàng của tôi</span>
      </div>

      <Table
        style={{ marginTop: 50 }}
        columns={columns}
        dataSource={dataColumn}
        pagination={{
          pageSize: pagination.pageSize,
          total: dataColumn.length,
          onChange: (page, pageSize) =>
            handleTableChange({ current: page, pageSize }),
        }}
      />

      <ModalConfirmOrder
        isOpenModalConfirmOrder={isOpenModalConfirmOrder}
        setIsOpenModalConfirmOrder={setIsOpenModalConfirmOrder}
        data={dataConfirmOrder}
        domainUrl = {domainUrl}
        customerId = {customerId}
        user= {user}
      />
    </>
  );
};

export default Cart;
