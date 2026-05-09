import { auth } from "@/auth";
import AllHistoryRender from "@/components/home/history/history.render";
import { handleGetDataUserCustomer, handleGetOrderById } from "@/utils/action";

const AllHistoryPage = async () => {
  const session = await auth();
  const user = session?.user;
  const data = await handleGetDataUserCustomer(
    `api/v1/customers/get-customer-by-id?_id=${user?._id}`,
  );
  const customerId = data.data._id;
  const dataOrder = customerId
    ? await handleGetOrderById(
        `api/v1/orders/get-order-by-customer-id?_id=${customerId}`,
      )
    : [];

  return <AllHistoryRender user={user} orders={dataOrder} />;
};

export default AllHistoryPage;
