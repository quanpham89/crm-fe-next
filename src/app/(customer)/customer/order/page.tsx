import { auth } from "@/auth";
import AllOrder from "@/components/home/order/all.order.render";
import { handleGetDataUserCustomer, handleGetOrderById } from "@/utils/action";

const AllOrderPage = async () => {
  const session = await auth();
  const user = session?.user;
  const data = await handleGetDataUserCustomer(
    `api/v1/customers/get-customer-by-id?_id=${user?._id}`,
  );
  const customerId = data.data._id;
  const dataOrder = customerId
    ? await handleGetOrderById(
        `api/v1/orders/get-order-by-id?_id=${customerId}`,
      )
    : [];
  return <AllOrder user={user} orders={dataOrder} />;
};

export default AllOrderPage;
