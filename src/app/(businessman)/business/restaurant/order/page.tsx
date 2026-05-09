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

  return <Order user={user} />;
};

export default DetailOrderRestaurant;
