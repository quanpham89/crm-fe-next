"use client";
import { Modal, Form, Button, Input, message, notification } from "antd";
import { sendRequest } from "@/utils/api";
import { useHasMounted } from "@/utils/customHook";
import {
  handleDeleteDataMenu,
  handleRemoveCouponById,
  handleRemoveMenu,
  handleRemoveRestaurantById,
  handleRemoveUserById,
  handleRemoveVoucherById,
} from "@/utils/action";

const ModalConfirmDelete = (props: any) => {
  const {
    isOpenModalConfirmDelete,
    setOpenModalConfirmDelete,
    title,
    currentItem,
    type,
    setIsLoading,
  } = props;
  const hasMounted = useHasMounted();
  if (!hasMounted) return <></>;

  const confirmDelete = async () => {
    switch (type) {
      case "USER":
        const resUser = await handleRemoveUserById(
          `api/v1/users/remove-user?_id=${currentItem._id}`,
        );

        if (resUser?.data) {
          notification.success({
            message: "Xóa người dùng thành công.",
            description: resUser?.message,
          });
          window.location.reload();
        } else {
          notification.error({
            message: "Có lỗi xảy ra, vui lòng thử lại",
            description: resUser?.message,
          });
        }
        break;
      case "RESTAURANTS":
        const resRestaurant = await handleRemoveRestaurantById(
          `api/v1/restaurants/remove-restaurant?_id=${currentItem._id}`,
        );

        if (resRestaurant?.data) {
          notification.success({
            message: "Xóa tài khoản thành công.",
            description: resRestaurant?.message,
          });
          window.location.reload();
        } else {
          notification.error({
            message: "Có lỗi xảy ra, vui lòng thử lại",
            description: resRestaurant?.message,
          });
        }
        break;
      case "MENU":
        const resMenu = await handleRemoveMenu(
          `api/v1/menus/remove-menu?_id=${currentItem._id}`,
        );

        if (resMenu?.data) {
          notification.success({
            message: "Xóa menu thành công.",
            description: resMenu?.message,
          });
          window.location.reload();
        } else {
          notification.error({
            message: "Có lỗi xảy ra, vui lòng thử lại",
            description: resMenu?.message,
          });
        }
        break;
      case "VOUCHER":
        const voucher = await handleRemoveVoucherById(
          `api/v1/vouchers/remove?_id=${currentItem._id}`,
        );

        if (voucher?.data) {
          notification.success({
            message: "Xóa voucher thành công.",
            description: voucher?.message,
          });
          window.location.reload();
        } else {
          notification.error({
            message: "Có lỗi xảy ra, vui lòng thử lại",
            description: voucher?.message,
          });
        }
        break;
      case "COUPON":
        const coupon = await handleRemoveCouponById(
          `api/v1/coupons/remove?_id=${currentItem._id}`,
        );

        if (coupon?.data) {
          notification.success({
            message: "Xóa coupon thành công.",
            description: coupon?.message,
          });
          window.location.reload();
        } else {
          notification.error({
            message: "Có lỗi xảy ra, vui lòng thử lại",
            description: coupon?.message,
          });
        }
        break;

      case "MENUITEM":
        if (currentItem.length > 0) {
          const response = await handleDeleteDataMenu(
            `api/v1/menu-items/delete-item-menu`,
            currentItem,
            "menuItem",
          );
          if (response.data.EC === 0) {
          } else {
            notification.error({
              message: "Có lỗi xảy ra, vui lòng thử lại",
            });
          }
        } else {
          notification.error({
            message: "Please choose at least 1 item to delete.",
          });
        }
        break;
      default:
    }
  };
  return (
    <Modal
      title={title}
      open={isOpenModalConfirmDelete}
      onOk={() => setOpenModalConfirmDelete(false)}
      onCancel={() => setOpenModalConfirmDelete(false)}
      maskClosable={false}
      footer={null}
      forceRender={true}
    >
      <Form name="delete" autoComplete="off" layout="vertical">
        <Form.Item
          label="Id"
          name="_id"
          hidden
          rules={[
            {
              required: true,
              message: "Chưa xác nhận id của người dùng.",
            },
          ]}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            marginTop: 40,
            marginBottom: 0,
          }}
        >
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => setOpenModalConfirmDelete(false)}
            style={{ marginRight: 20 }}
          >
            Đóng
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            onClick={confirmDelete}
            style={{ background: "red" }}
          >
            Xoá
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalConfirmDelete;
