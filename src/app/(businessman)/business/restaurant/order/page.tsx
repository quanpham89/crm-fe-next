import { auth } from "@/auth";
import Order from "@/components/business/restaurant/order/order";
import OrderTable from "@/components/business/restaurant/order/order.table";
import {
  handleGetDataOrderDetail,
  handleGetDataRestaurantById,
} from "@/utils/action";

const DetailOrderRestaurant = async () => {
  const session = await auth();
  const user = session?.user;
  const access_token = session?.user?.access_token as string;
  const response = await handleGetDataRestaurantById(
    `api/v1/menus/get-menu-by-id?_id=670deec28415cd57260147ba`,
    access_token
  );
  let dataOrderDetail;
  if (user?.restaurantId) {
    dataOrderDetail = await handleGetDataOrderDetail(
      `api/v1/order-detail/get-data-order-detail?_id=${user?.restaurantId}`,
      access_token
    );
    console.log(dataOrderDetail);
  }
  return (
    <Order
      data={response?.data[0]}
      access_token={access_token}
      dataOrderDetail={dataOrderDetail ? dataOrderDetail.data : {}}
    />
  );
};

export default DetailOrderRestaurant;
