"use client";
import { Modal, Form, Button, Input, message, notification } from "antd";
import { sendRequest } from "@/utils/api";
import { useHasMounted } from "@/utils/customHook";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const ModalConfirmHidden = (props: any) => {
  const {
    isOpenModalConfirmHidden,
    setOpenModalConfirmHidden,
    title,
    access_token,
    type,
    currentItem,
  } = props;
  const router = useRouter();
  const hasMounted = useHasMounted();
  if (!hasMounted) return <></>;

  const confirmHidden = async () => {
    switch (type) {
      case "USER":
        if (!currentItem.isActive) {
          notification.success({
            message: "Hủy kích hoạt tài khoản",
            description: "Tài khoản hiện đang không kích hoạt.",
          });
          setOpenModalConfirmHidden(false);
          return;
        }
        const resUser = await sendRequest<IBackendRes<any>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/soft-delete?_id=${currentItem._id}`,
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        if (resUser?.data) {
          notification.success({
            message: "Hủy kích hoạt tài khoản thành công.",
            description: resUser?.message,
          });
          window.location.reload();
        } else {
          notification.error({
            message: "Call APIs error",
            description: resUser?.message,
          });
        }
        break;
      case "CUSTOMER":
        if (!currentItem?.user.isActive) {
          notification.success({
            message: "Hủy kích hoạt tài khoản",
            description: "Tài khoản hiện đang không kích hoạt.",
          });
          setOpenModalConfirmHidden(false);
          return;
        }
        const resCustomer = await sendRequest<IBackendRes<any>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/soft-delete?_id=${currentItem?.user._id}`,
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        if (resCustomer?.data) {
          notification.success({
            message: "Hủy kích hoạt tài khoản thành công.",
            description: resCustomer?.message,
          });
          await signOut({ redirect: false });
          router.push("/auth/login");
        } else {
          notification.error({
            message: "Call APIs error",
            description: resCustomer?.message,
          });
        }
        break;
      case "RESTAURANTS":
        if (!currentItem.isShow) {
          notification.success({
            message: "Ẩn tài khoản bán hàng",
            description: "Tài khoản hiện đang không kích hoạt.",
          });
          setOpenModalConfirmHidden(false);
          return;
        }
        const res = await sendRequest<IBackendRes<any>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/restaurants/soft-delete?_id=${currentItem._id}`,
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        if (res?.data) {
          notification.success({
            message: "Hủy kích hoạt tài khoản thành công.",
            description: res?.message,
          });
          window.location.reload();
        } else {
          notification.error({
            message: "Call APIs error",
            description: res?.message,
          });
        }
        break;

      case "MENU":
        if (!currentItem.status) {
          notification.success({
            message: "Ẩn menu",
            description: "Menu hiện đang được ẩn.",
          });
          setOpenModalConfirmHidden(false);
          return;
        }
        const resMenu = await sendRequest<IBackendRes<any>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menus/soft-delete?_id=${currentItem._id}`,
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        if (resMenu?.data) {
          notification.success({
            message: "Ẩn menu thành công.",
            description: resMenu?.message,
          });
          window.location.reload();
        } else {
          notification.error({
            message: "Call APIs error",
            description: resMenu?.message,
          });
        }
        break;

      case "VOUCHER":
        if (currentItem.status === "HIDDEN") {
          notification.success({
            message: "Ẩn voucher",
            description: "Voucher hiện đang không kích hoạt.",
          });
          setOpenModalConfirmHidden(false);
          return;
        }
        const voucher = await sendRequest<IBackendRes<any>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/vouchers/soft-delete?_id=${currentItem._id}`,
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        if (voucher?.data) {
          notification.success({
            message: "Hủy kích hoạt voucher thành công.",
            description: voucher?.message,
          });
          window.location.reload();
        } else {
          notification.error({
            message: "Call APIs error",
            description: voucher?.message,
          });
        }
        break;

      case "COUPON":
        if (currentItem.status === "HIDDEN") {
          notification.success({
            message: "Ẩn coupon",
            description: "Coupon hiện đang không kích hoạt.",
          });
          setOpenModalConfirmHidden(false);
          return;
        }
        const coupon = await sendRequest<IBackendRes<any>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/coupons/soft-delete?_id=${currentItem._id}`,
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        if (coupon?.data) {
          notification.success({
            message: "Hủy kích hoạt coupon thành công.",
            description: coupon?.message,
          });
          window.location.reload();
        } else {
          notification.error({
            message: "Call APIs error",
            description: coupon?.message,
          });
        }
        break;

      case "CANCEL":
        console.log(currentItem);
        if (currentItem) {
          const cancleOrder = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders/close-order?_id=${currentItem}`,
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });
          if (cancleOrder?.data) {
            console.log(cancleOrder);
            notification.success({
              message: "Hủy đơn hàng thành thành công.",
              description: cancleOrder?.message,
            });
            window.location.reload();
          } else {
            notification.error({
              message: "Call APIs error",
              description: cancleOrder?.message,
            });
          }
        } else {
          notification.error({
            message: "Không xác định được _id",
          });
        }
        break;
      default:
    }
  };
  return (
    <Modal
      title={title}
      open={isOpenModalConfirmHidden}
      onOk={() => setOpenModalConfirmHidden(false)}
      onCancel={() => setOpenModalConfirmHidden(false)}
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
            onClick={() => setOpenModalConfirmHidden(false)}
            style={{ marginRight: 20 }}
          >
            Đóng
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            onClick={confirmHidden}
            style={{ background: "red" }}
          >
            Đồng ý
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalConfirmHidden;
