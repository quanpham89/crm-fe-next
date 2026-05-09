import { auth } from "@/auth";
import Order from "@/components/business/restaurant/order/order";
import Customer from "@/components/customer/customer";
import {
  handleGetDataRestaurantById,
  handleGetDataUserCustomer,
} from "@/utils/action";

const CustomerPage = async () => {
  const session = await auth();
  const user = session?.user;

  return <Customer user={user} />;
};

export default CustomerPage;
