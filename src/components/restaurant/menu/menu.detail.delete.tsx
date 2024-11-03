"use client";

import { AdminContext } from "@/library/admin.context";
import {
  handleActiveItemDataMenu,
  handleDeleteDataMenu,
  handleGetData,
  handleGetDataMenu,
  handleGetDataPerPage,
  handleSoftDeleteDataMenu,
} from "@/utils/action";
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
  Space,
  Spin,
  Table,
  TableColumnsType,
  Upload,
  Image,
} from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import "../Pagination.scss";
import { TableRowSelection } from "antd/es/table/interface";
import ModalConfirmDelete from "@/components/modalConfirm/modalConfirm.delete";

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
  image: any;
}
const MenuDetailDelete = (props: any) => {
  const { menuInfo, role, access_token } = props;
  const [dataSource, setDataSource] = useState<any>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenModalConfirmDelete, setOpenModalConfirmDelete] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 4,
  });

  const getMenuItem = async () => {
    const response = await handleGetDataMenu(
      `api/v1/menus/get-menu-by-id?_id=${menuInfo.menuId}`,
      access_token
    );
    if (response) {
      const formatData = response?.data[0]?.menuItem.map(
        (item: any, index: number) => {
          return {
            key: item._id,
            nameItemMenu: item.nameItemMenu,
            image: <Image alt="image" width={60} src={`${item.image}`} />,
            sellingPrice: item.sellingPrice,
            fixedPrice: item.fixedPrice,
            description: item.description,
            status: item.status === "HIDDEN" ? "Ẩn" : "Hiển thị",
          };
        }
      );
      setDataSource(formatData);
      setIsLoading(false);
    } else {
      setTimeout(() => {
        setIsLoading(false);
        notification.error({
          message: "Có lõi xảy ra, vui lòng thử lại sau.",
        });
      }, 1000);
    }
  };
  useEffect(() => {
    getMenuItem();
  }, [pagination]);

  const columns: TableColumnsType<DataType> = [
    {
      title: "Tên sản phẩm",
      dataIndex: "nameItemMenu",
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
    },
    {
      title: "Giá bán",
      dataIndex: "sellingPrice",
    },
    {
      title: "Giá gốc",
      dataIndex: "fixedPrice",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
    },
  ];

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [Table.SELECTION_NONE],
  };

  const handleTableChange = (pagination: any) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  const handleMenuItem = async (type: string) => {
    let itemHandle = [...selectedRowKeys];
    switch (type) {
      case "DELETE":
        setOpenModalConfirmDelete(true);
        break;

      case "HIDDEN":
        if (itemHandle.length > 0) {
          await handleSoftDeleteDataMenu(
            `api/v1/menu-items/soft-delete`,
            itemHandle,
            access_token,
            "menuItem"
          );
          setIsLoading(true);
          setSelectedRowKeys([]);
          getMenuItem();
        } else {
          notification.error({
            message: "Vui lòng lựa chọn ít nhất 1 giá trị để thao tác.",
          });
        }
        break;

      case "ACTIVE":
        if (itemHandle.length > 0) {
          await handleActiveItemDataMenu(
            `api/v1/menu-items/active-item`,
            itemHandle,
            access_token,
            "menuItem"
          );
          setIsLoading(true);
          setSelectedRowKeys([]);
          getMenuItem();
        } else {
          notification.error({
            message: "Vui lòng lựa chọn ít nhất 1 giá trị để thao tác.",
          });
        }
        break;
    }
  };

  return !isLoading ? (
    <>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowSelection={rowSelection}
        pagination={{
          pageSize: pagination.pageSize,
          total: dataSource.length,
          onChange: (page, pageSize) =>
            handleTableChange({ current: page, pageSize }),
        }}
      />
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        <Button onClick={() => handleMenuItem("DELETE")}>Xóa vĩnh viễn</Button>
        <Button onClick={() => handleMenuItem("HIDDEN")}>Ẩn sản phẩm</Button>
        <Button onClick={() => handleMenuItem("ACTIVE")}>
          Kích hoạt sản phẩm
        </Button>
      </div>

      <ModalConfirmDelete
        isOpenModalConfirmDelete={isOpenModalConfirmDelete}
        setOpenModalConfirmDelete={setOpenModalConfirmDelete}
        title={`Bạn chắc chắn muốn xóa vĩnh viễn ?`}
        currentItem={[...selectedRowKeys]}
        access_token={access_token}
        type="MENUITEM"
        setIsLoading={setIsLoading}
      />
    </>
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spin />
    </div>
  );
};

export default MenuDetailDelete;
