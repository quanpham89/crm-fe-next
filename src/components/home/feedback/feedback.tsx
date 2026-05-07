import {
  handleGetDataFeedbackById,
  handlePatchDataFeedback,
  handlePostDataFeedback,
} from "@/utils/action";
import { useHasMounted } from "@/utils/customHook";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Rate,
  Row,
  Select,
  Space,
} from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import { useContext, useEffect, useState } from "react";

const FeedbackModal = (props: any) => {
  const {
    openModalFeedback,
    setOpenModalFeedback,
    title,
    user,
    order,
    option,
  } = props;
  const [form] = Form.useForm();
  const hasMounted = useHasMounted();
  const [initialFeedbacks, setInitialFeedbacks] = useState<any[]>([]);
  const [updateFeedBack, setUpdateFeedback] = useState<any[]>([]);
  const getDataFeedback = async () => {
    const response = await handleGetDataFeedbackById(
      `api/v1/feedbacks/get-feedback-by-order-id/${order._id}`,
      user?.access_token
    );

    if (response && response.data) {
      const initial = response.data.map((item: any) => ({
        menuItemId: item.menuItemId,
        feedback: {
          rate: item.rate,
          comment: item.comment,
          _id: item._id,
        },
      }));
      console.log(">>>>>>>>>>>>>initial", initial);
      setInitialFeedbacks(initial);
    } else {
      notification.error({ message: "Có lỗi xảy ra, vui lòng thử lại sau." });
    }
  };
  useEffect(() => {
    if (openModalFeedback && option === "update") {
      getDataFeedback();
    }
  }, [order, openModalFeedback, option]);

  const handleOnChangeValue = (changedValues: any, allValues: any) => {
    const feedbackChanged = changedValues.feedbacks;
    if (!feedbackChanged || option !== "update") return;

    const _feedback = [...updateFeedBack];
    const idxFeedbackChange = feedbackChanged.length - 1;

    const feedback: any[] = [];

    initialFeedbacks.forEach((item: any) => {
      if (
        item.menuItemId === allValues.feedbacks[idxFeedbackChange].menuItemId
      ) {
        feedback.push({
          menuItemId: item.menuItemId,
          feedback: {
            _id: allValues.feedbacks[idxFeedbackChange].id,
            comment: allValues.feedbacks[idxFeedbackChange].comment,
            rate: allValues.feedbacks[idxFeedbackChange].rate,
          },
        });
      }
    });

    const merged = [..._feedback];

    feedback.forEach((fb) => {
      const idx = merged.findIndex(
        (item) => item.feedback._id === fb.feedback._id
      );
      if (idx !== -1) {
        merged[idx] = fb;
      } else {
        merged.push(fb);
      }
    });

    setUpdateFeedback(merged);
  };

  if (!hasMounted) return <></>;

  const handleSubmitFeedback = async (values: any) => {
    setOpenModalFeedback(false);
    if (option === "update" && updateFeedBack.length > 0) {
      const response = await handlePatchDataFeedback(
        "api/v1/feedbacks/bulk-update",
        user?.access_token,
        updateFeedBack
      );

      if (response && response.statusCode === 200) {
        notification.success({ message: "Cập nhập thành công" });
        window.location.reload();
      } else {
        notification.error({ message: "Có lỗi xảy ra, vui lòng thử lại sau." });
      }
    } else {
      const response = await handlePostDataFeedback(
        "api/v1/feedbacks",
        user?.access_token,
        values
      );
      if (response && response.statusCode === 201) {
        notification.success({ message: "Đánh giá thành công" });
        window.location.reload();
      } else {
        notification.error({ message: "Có lỗi xảy ra, vui lòng thử lại sau." });
      }
    }
  };
  const handleCloseModalFeedback = () => {
    setOpenModalFeedback(false);
    window.location.reload();
  };
  return order ? (
    <Modal
      title={title}
      open={openModalFeedback}
      onClose={() => setOpenModalFeedback(false)}
      onCancel={() => setOpenModalFeedback(false)}
      footer={null}
      width={"40vw"}
      maskClosable={false}
    >
      <Form
        name="verify"
        autoComplete="off"
        layout="vertical"
        form={form}
        onFinish={handleSubmitFeedback}
        onValuesChange={(value, allValues) =>
          handleOnChangeValue(value, allValues)
        }
      >
        <div className="cart-container">
          <Form.Item
            label={""}
            name={"customerId"}
            hidden
            rules={[
              {
                required: true,
                message: "CustomerId không được để trống!",
              },
            ]}
            initialValue={order.customer}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={""}
            name={"restaurantId"}
            hidden
            rules={[
              {
                required: true,
                message: "restaurantId không được để trống!",
              },
            ]}
            initialValue={order.restaurant}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={""}
            name={"orderId"}
            hidden
            rules={[
              {
                required: true,
                message: "orderId không được để trống!",
              },
            ]}
            initialValue={order._id}
          >
            <Input />
          </Form.Item>

          {(option !== "update" ? order?.orderDetail : initialFeedbacks).map(
            (item: any, index: number) => (
              <Card
                title={item?.nameItemMenu || item?.menuItemId?.nameItemMenu}
                key={index}
                style={{ marginBottom: "10px", padding: 8 }}
              >
                {option === "update" ? (
                  <Form.Item
                    label="feedBackId"
                    name={["feedbacks", index, "id"]}
                    hidden
                    style={{ marginBottom: 0 }}
                    initialValue={item?.feedback?._id || ""}
                  >
                    <Input disabled />
                  </Form.Item>
                ) : null}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    marginBottom: 10,
                  }}
                >
                  <Avatar
                    src={item?.menuItem?.image || item?.menuItemId?.image}
                    shape="square"
                    style={{
                      width: 60,
                      height: 60,
                    }}
                  />

                  <Form.Item
                    label="Đánh giá"
                    name={["feedbacks", index, "rate"]}
                    style={{ marginBottom: 0 }}
                    initialValue={
                      option === "update" ? item?.feedback?.rate : 5
                    }
                  >
                    <Rate defaultValue={5} style={{ color: "#f1f131" }} />
                  </Form.Item>
                </div>

                <Form.Item
                  label="Bình luận"
                  name={["feedbacks", index, "comment"]}
                  style={{ margin: 0 }}
                  initialValue={
                    option === "update" ? item?.feedback?.comment : ""
                  }
                >
                  <TextArea rows={3} placeholder="Nhập bình luận..." />
                </Form.Item>

                <Form.Item
                  name={["feedbacks", index, "menuItemId"]}
                  initialValue={item?.menuItem?._id || item?.menuItemId}
                  hidden
                >
                  <Input />
                </Form.Item>
              </Card>
            )
          )}
        </div>

        <Form.Item
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 20,
            marginTop: 10,
            marginBottom: 0,
          }}
        >
          <Button
            style={{ marginRight: 10 }}
            onClick={handleCloseModalFeedback}
          >
            Đóng
          </Button>

          <Button type="primary" htmlType="submit">
            Gửi phản hồi
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  ) : (
    <>xsxs</>
  );
};

export default FeedbackModal;
