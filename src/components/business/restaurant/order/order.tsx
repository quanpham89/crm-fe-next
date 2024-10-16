'use client'
import { Avatar, Badge, Breadcrumb, Button, Checkbox, Descriptions, Form, Input, InputNumber, InputRef, notification, Pagination, Select, Space, Spin, Table, TableColumnsType, TableColumnType } from "antd"
import { Children, use, useContext, useEffect, useRef, useState } from "react";
import { sendRequest } from "@/utils/api";
import { BusinessContext } from "@/library/business.context";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { PlusOutlined, SearchOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";


interface DataType {
    key: string;
    name: string;
    price: number;
    description: string;
    numberOfProduct: string,
    quantity: any
    add: any
  }

const Order = (props: any) => {
    const { user, data } = props
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [isOpenModalUpdateRestaurant, setIsOpenUpdateRestaurant] = useState(false)

    const [currentRestaurant, setCurrentRestaurant] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const [dataRestaurant, setDataRestaurant] = useState<any>([])
    console.log(data )
    const [form] = Form.useForm()
    const router = useRouter()
    useEffect(() => {
        const formatData = [
            {
                label: "Name",
                children: data?.restaurant?.restaurantName
            },
            {
                label: "Address",
                children: data?.restaurant?.address
            },
            {
                label: "Phone",
                children: data?.restaurant?.phone
            },
            {
                label: "Rating",
                children: data?.restaurant?.rating
            },

            {
                label: "Menu",
                children: data?.nameMenu
            },
            {
                label: "Product Type",
                children: data?.restaurant?.productType
            },
            {
                label: "Description Menu",
                children: data?.description
            },

        ]
        setDataRestaurant(formatData)
    }, [data])

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

    const dataColumn = [
        {
          key: '1',
          name: 'John Brown',
          age: 32,
          address: 'New York No. 1 Lake Park',
          numberOfProduct: "10000",
          quantity: <InputNumber min={1}/>,
          add: <PlusOutlined/>
        },
        {
          key: '2',
          name: 'Joe Black',
          age: 42,
          address: 'London No. 1 Lake Park',
          numberOfProduct: "10000",
          quantity: <InputNumber min={1}/>,
          add: <PlusOutlined/>

        },
        {
          key: '3',
          name: 'Jim Green',
          age: 32,
          address: 'Sydney No. 1 Lake Park',
          numberOfProduct: "10000",
          quantity: <InputNumber min={1}/>,
          add: <PlusOutlined/>

        },
        {
          key: '4',
          name: 'Jim Red',
          age: 32,
          address: 'London No. 2 Lake Park',
          numberOfProduct: "10000",
          quantity: <InputNumber min={1}/>,
          add: <PlusOutlined/>

        },
    ];
    const columns : any = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          width: '30%',
          ...getColumnSearchProps('name'),
        },
        {
          title: 'Price',
          dataIndex: 'price',
          key: 'price',
          width: '20%',
          ...getColumnSearchProps('price'),
          sortDirections: ['descend', 'ascend'],
          sorter: (a :any, b : any) => Number(a) - Number(b),


        },
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
        },
        {
            title: 'Number Of Product',
            dataIndex: 'numberOfProduct',
            key: 'numberOfProduct',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Add To Cart',
            dataIndex: 'add',
            key: 'add',
        },
      ];

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    
    type NewType =  keyof DataType;
    type DataIndex = keyof DataType;

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
    
    return (isLoading ?
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Spin />
        </div>
        :
        <>
            <Breadcrumb
                items={[
                    {
                        title: 'Home',
                    },
                    {
                        title: data?.restaurant?.restaurantName,
                    },
                    {
                        title: data?.nameMenu,
                    },
                ]}
            />
            <div style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                marginBottom: 20,
                fontSize: 20,
                fontWeight: 600
            }}>
                <Badge count={5}>
                    <Avatar shape="square" icon={<ShoppingCartOutlined />} />
                </Badge>
            </div>
            
            
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
                fontSize: 20,
                fontWeight: 600
            }}>
                <span>Order</span>

            </div>

            <Descriptions items={dataRestaurant} bordered />
            <Table style={{marginTop: 50}} columns={columns} dataSource={dataColumn}/>
        </>

        
    )
}

export default Order;