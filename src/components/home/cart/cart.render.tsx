'use client'
import { Avatar, Badge, Breadcrumb, Button, Checkbox, Col, ConfigProvider, DatePicker, DatePickerProps, Descriptions, Form, GetProps, Input, InputNumber, InputRef, notification, Pagination, Row, Select, Space, Spin, Table, TableColumnsType, TableColumnType } from "antd"
import { Children, use, useContext, useEffect, useRef, useState } from "react";
import { sendRequest } from "@/utils/api";
import { BusinessContext } from "@/library/business.context";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { PlusOutlined, SearchOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { CustomerContext } from "@/library/customer.context";
import { helper } from "@/app/helpers/customize";
import { RangePickerProps } from "antd/es/date-picker";
import en from 'antd/es/date-picker/locale/en_US';
import enUS from 'antd/es/locale/en_US';
import buddhistEra from 'dayjs/plugin/buddhistEra';


interface DataType {
    key: string;
    restaurantName: string;
    nameMenu: string;
    nameItemMenu: string;
    pricePerProduct: number;
    amount: number;
    totalPrice: number;
    quantity: number;
    sellingPrice: number,
    voucher: string,
    coupon: string,
    
  }

const Cart = (props: any) => {
    const { user } = props

    const [isLoading, setIsLoading] = useState(false)
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const [dataColumn, setDataColumn] = useState([])
    const { currentCart, setCurrentCard } = useContext(CustomerContext)!;
    type NewType =  keyof DataType;
    type DataIndex = keyof DataType;
    type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

    const [form] = Form.useForm()
    const router = useRouter()
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
    });
    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        const userId = localStorage.getItem('userId');
        form.setFieldValue("orderTime", dayjs())
        if (storedCart) {
            const { cart } = JSON.parse(storedCart);
            setCurrentCard(cart);
        }
    }, []);
    useEffect(()=>{
        const dataCart = currentCart.map((item:any)=>{
            return {
                key: item.menuItemId,
                nameItemMenu: item.nameItemMenu,
                sellingPrice: helper.formatMoneyVND(+item.sellingPrice),
                quantity: + item.quantity ,
                amount:   + item.amount,
                totalPrice: helper.formatMoneyVND(+item.amount*+item.sellingPrice) 
            }
        })
        setDataColumn(dataCart)

    }, [currentCart])
   
 
    const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<DataType> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
          <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
            <Input
              ref={searchInput}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
              style={{ marginBottom: 8, display: 'block' }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
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
          <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
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
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ''}
            />
          ) : (
            text
          ),
      });

    
      const columns: any = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'nameItemMenu',
            key: 'nameItemMenu',
            width: '30%',
            ...getColumnSearchProps('nameItemMenu'),
        },
        {
            title: 'Giá tiền',
            dataIndex: 'sellingPrice',
            key: 'sellingPrice',
            width: '20%',
            sorter: (a: DataType, b: DataType) => helper.parsePrice(a.sellingPrice)  - helper.parsePrice(b.sellingPrice),
        },
        {
            title: 'Tổng sản phẩm',
            dataIndex: 'quantity',
            key: 'quantity',
            sorter: (a: DataType, b: DataType) => a.quantity - b.quantity,
        },
        {
            title: 'Số lượng mua',
            dataIndex: 'amount',
            key: 'amount',
            sorter: (a: DataType, b: DataType) => a.amount - b.amount,
        },
        {
            title: 'Tổng số tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            sorter: (a: DataType, b: DataType) => helper.parsePrice(a.totalPrice) - helper.parsePrice(b.totalPrice)

        },
    ];

    

      const handleSearch = (
        selectedKeys: string[],
        confirm: FilterDropdownProps['confirm'],
        dataIndex: NewType,
      ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
      };
    
      const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
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
            fieldDateFormat: 'DD-MM-YYYY',
            fieldDateTimeFormat: 'DD-MM-YYYY HH:mm',
            yearFormat: 'YYYY',
            cellYearFormat: 'YYYY',
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

    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        return current && current < dayjs().startOf('day');
    };

    const disabledTime: DatePickerProps['disabledTime'] = (date) => {
        const currentTime = dayjs();
        const minTime = currentTime.add(20, 'minute');

        if (date && date.isSame(currentTime, 'day')) {
            // Nếu ngày được chọn là hôm nay
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
    
    return (isLoading ?
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Spin />
        </div>
        :
        <>  
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
                fontSize: 20,
                fontWeight: 600
            }}>
                <span>Giỏ hàng của tôi</span>

            </div>

            <Table 
            style={{marginTop: 50}} 
            columns={columns} 
            dataSource={dataColumn}
            pagination={{
                pageSize: pagination.pageSize,
                total: dataColumn.length,
                onChange: (page, pageSize) => handleTableChange({ current: page, pageSize }),
            }}
            />
            <div>
            <Form
                name="verify"
                autoComplete="off"
                layout="vertical"
                form={form}
                // onFinish={handleAddItemToCart}
            >

                <Form.Item
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
                </Form.Item>

                <Row gutter={16}>
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
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Hình thức thanh toán: "
                            name="paymentForm"
                        >
                            <Select
                                options={[
                                    { value: 'money', label: 'Tiền mặt' },
                                    { value: 'card', label: 'Thẻ' },
                                    { value: 'bank', label: 'Chuyển khoản' },
                                ]}>

                            </Select>
                        </Form.Item>
                    </Col>

                </Row> 

            </Form>
            </div>
        </>

        
    )
}

export default Cart;