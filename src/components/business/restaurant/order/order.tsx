"use client";
import {
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Checkbox,
  Descriptions,
  Form,
  Input,
  InputNumber,
  InputRef,
  notification,
  Pagination,
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
  PlusOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { helper } from "@/app/helpers/customize";
import { changeStatusOrderDetailItem, handleGetDataOrderDetail } from "@/utils/action";

interface DataType {
  key: string;
  name: string;
  nameItemMenu: string;
  numberItem: number;
  orderTime: string;
  predictionTime: string;
  paymentForm: string;
  sellingPrice: string;
  totalPrice: string;
  status: any;
}

const Order = (props: any) => {
  const { user, access_token } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [dataColumn, setDataColumn] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const[totalItem, setTotalItem] = useState(1)
  type NewType = keyof DataType;
  type DataIndex = keyof DataType;
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const router = useRouter();
  const [listStatusDisable, setListDisable] = useState( [
    "SENDING",
    "COMPLETE",
    "RECEIVE",
    "DENIED",
    "CANCEL",
    "SENDING",
    "REJECT",
    "ONECANCEL"
  ])

  const getCurrentStatus = (status : string) =>{
    if(status === "PENDING"){
      return "Chờ xác nhận"
    }

    switch(status){
      case "ACCEPT":
      return   "Nhận đơn"
      case "PREPARE":
      return   "Chuẩn bị"
      case "RECEIVE":
      return   "Nhận hàng"
      case "COMPLETE":
      return   "Hoàn thành"
      case "DENIED":
      return   "Từ chối"
      case "CANCEL":
      return   "Hủy đơn"
      case "REJECT":
      return   "Giao hàng thất bại"
      case "ONECANCEL":
      return   "Shop từ chối"
      case "SENDING":
      return   "Giao hàng"
    }
  }

  const getDataOrderDetail = async() =>{
    if (user?.restaurantId) {
      const response  = await handleGetDataOrderDetail(
        `api/v1/order-detail/get-data-order-detail?_id=${user?.restaurantId}&current=${pagination.current}&pageSize=${pagination.pageSize}`,
        access_token
      );
      if(response.data){
        let dataOrderDetail  = response.data.orderDetails
        setTotalItem(response.data.totalItem)        
        const formatDataColumn = dataOrderDetail.map((item: any) => {
          return {
            key: item?._id,
            name: item?.customer?.userId?.name,
            nameItemMenu: item?.nameItemMenu,
            numberItem: item?.amount,
            sellingPrice: helper.formatMoneyVND(item?.sellingPrice),
            totalPrice: helper.formatMoneyVND(item?.sellingPrice * item?.amount),
            orderTime: item?.orderTime
              ? dayjs(item?.orderTime).format("DD-MM-YYYY")
              : "",
            predictionTime: item?.orderTime
              ? dayjs(item?.orderTime).format("DD-MM-YYYY")
              : "",
            paymentForm: item?.paymentForm === "bank" ? "chuyển khoản" : "tiền mặt",
            totalWithoutDiscount: helper.formatMoneyVND(item?.totalWithoutDiscount),
            status: (
              <Select
                defaultValue={getCurrentStatus(item?.status)}
                disabled={listStatusDisable.includes(item?.status)}
                style={{ width: "100%" }}
                options={[
                  { value: "ACCEPT", label: "Nhận đơn" },
                  { value: "PREPARE", label: "Chuẩn bị" },
                  { value: "SENDING", label: "Giao hàng" },


                ]}
                onChange={(value) => handleChangeSelectOption(item, value)}
              ></Select>
            ),
          };
        });
        setDataColumn(formatDataColumn);

      }
    }
  }
  useEffect(() => {
    getDataOrderDetail()
  }, [pagination.current]);

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

  const columns: any = [
    {
      title: "Mã yêu cầu",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Khách hàng",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "nameItemMenu",
      key: "nameItemMenu",
      ...getColumnSearchProps("nameItemMenu"),
    },
    {
      title: "Số lượng sản phẩm",
      dataIndex: "numberItem",
      key: "numberItem",
      sortDirections: ["descend", "ascend"],
      sorter: (a: any, b: any) => Number(a.numberItem) - Number(b.numberItem),
    },
    {
      title: "Giá bán",
      dataIndex: "sellingPrice",
      key: "sellingPrice",
      sortDirections: ["descend", "ascend"],
      sorter: (a: any, b: any) => Number(helper.parsePrice(a.sellingPrice)) - Number(helper.parsePrice(b.sellingPrice)),
    },
    {
      title: "Thành tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      sortDirections: ["descend", "ascend"],
      sorter: (a: any, b: any) => Number(helper.parsePrice(a.sellingPrice) * a.numberItem) - Number(helper.parsePrice(b.sellingPrice) * b.numberItem),
    },
    {
      title: "Thời gian đặt",
      dataIndex: "orderTime",
      key: "orderTime",
    },
    {
      title: "Thời gian giao hàng dự kiến",
      dataIndex: "predictionTime",
      key: "predictionTime",
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentForm",
      key: "paymentForm",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
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

  const handleTableChange = (page: any) => {
    setPagination({
      current: page,
      pageSize: 10,
    });
  };

  const handleChangeSelectOption = async (item: any, value: string) => {
    const data = {
      status: value,
      _id: item._id,
      orderId: item.order
    };
    const response = await changeStatusOrderDetailItem(
      "api/v1/order-detail/change-order-detail-status",
      data,
      access_token
    );
    if(response && response.statusCode ===201){
      notification.success({message: "Chuyển trạng thái thành công."})
      getDataOrderDetail()
    }else{
      notification.success({message: "Có lỗi xảy ra, vui lòng thử lại."})
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
        <span>Yêu cầu</span>
      </div>

      <Table
        style={{ marginTop: 50 }}
        columns={columns}
        dataSource={dataColumn}
        pagination={{
          pageSize: pagination.pageSize,
          total: totalItem ,
          onChange: (page) =>
            handleTableChange({ page }),
        }}
      />
    </>
  );
};

export default Order;
