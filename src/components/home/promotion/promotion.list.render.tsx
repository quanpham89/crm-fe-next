"use client";

import {
  handleAddPromotionForCustomer,
  handleGetListCoupon,
  handleGetListVoucher,
} from "@/utils/action";
import {
  EditOutlined,
  EllipsisOutlined,
  PlusOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Carousel,
  Flex,
  Image,
  message,
  Modal,
  notification,
  Switch,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import "./PromotionListRender.scss";
import { error } from "console";

const PromotionListRender = (props: any) => {
  const { type, isOpenModal, setIsOpenModal, user } = props;
  console.log(user);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataPromotion, setDataPromotion] = useState([]);

  const getListVoucher = async () => {
    setLoading(true);
    const response = await handleGetListVoucher(
      `api/v1/vouchers/get-all-vouchers-belong-to-restaurant?_id=${user?.restaurantId}`
    );
    if (response && response.data) {
      setLoading(false);
      setDataPromotion(response.data);
    } else {
      notification.error({
        message: "Call API error",
      });
    }
  };

  const getListCoupon = async () => {
    setLoading(true);
    const response = await handleGetListCoupon(
      `api/v1/coupons/get-all-coupons-belong-to-restaurant?_id=${user?.restaurantId}`
    );
    if (response && response.data) {
      setLoading(false);
      setDataPromotion(response.data);
    } else {
      notification.error({
        message: "Call API error",
      });
    }
  };

  useEffect(() => {
    if (type === "VOUCHER") {
      getListVoucher();
    } else {
      getListCoupon();
    }
  }, [isOpenModal]);

  const handleAddPromotion = async (item: any) => {
    const data = {
      userId: user._id,
      _id: item._id,
    };
    if (!loading) {
      if (type === "VOUCHER") {
        const response = await handleAddPromotionForCustomer(
          "api/v1/customers/add-voucher-for-customer",
          data
        );
        if (response.statusCode === 201) {
          notification.success({
            message: "Thêm thành công!",
          });
        } else {
          notification.error({
            message: response.message,
          });
        }
      } else {
        const response = await handleAddPromotionForCustomer(
          "api/v1/customers/add-coupon-for-customer",
          data
        );
        if (response.statusCode === 201) {
          notification.success({
            message: "Thêm thành công!",
          });
        } else {
          notification.error({
            message: response.message,
          });
        }
      }
    }
  };

  const handleClose = () => {
    setIsOpenModal(false);
    setDataPromotion([]);
  };

  const actions = (item: any): React.ReactNode[] => [
    <PlusOutlined key="add" onClick={() => handleAddPromotion(item)} />,
  ];
  return (
    <Modal
      title="Danh sách voucher"
      centered
      open={isOpenModal}
      onCancel={() => handleClose()}
      footer={[
        <Button key="cancel" onClick={handleClose}>
          Cancel
        </Button>,
      ]}
    >
      <Flex gap="middle" align="start" vertical>
        {dataPromotion && dataPromotion.length > 0 ? (
          dataPromotion.map((item: any, index) => (
            <Card
              loading={loading}
              actions={actions(item)}
              style={{ width: "100%" }}
              key={item._id}
            >
              <Card.Meta
                avatar={<Avatar src={item.image} />}
                title={item.nameVoucher ? item.nameVoucher : item.nameCoupon}
                description={
                  <>
                    <div> {item.description}</div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: 5,
                      }}
                    >
                      <div>
                        <i>Bắt đầu từ: </i>
                        <b>{dayjs(item.startedDate).format("DD/MM/YYYY")}</b>
                      </div>
                      <div>
                        <i>Kết thúc: </i>
                        <b>{dayjs(item.endedDate).format("DD/MM/YYYY")}</b>
                      </div>
                    </div>
                  </>
                }
              />
            </Card>
          ))
        ) : (
          <>
            {type === "VOUCHER" ? (
              <h2 style={{ textAlign: "center" }}>
                Chưa có thông tin voucher.
              </h2>
            ) : (
              <h2 style={{ textAlign: "center" }}>Chưa có thông tin coupon.</h2>
            )}
          </>
        )}
      </Flex>
    </Modal>
  );
};

export default PromotionListRender;
