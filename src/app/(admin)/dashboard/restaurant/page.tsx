import { auth } from "@/auth";
import CreateProduct from "@/components/product/product.create";
import RestaurantTable from "@/components/restaurant/restaurant.table";

const ManageRestaurantPage = async () => {
  const session = await auth();
  let role = session?.user?.role as string;
  let access_token = session?.user?.access_token;
  let user = session?.user;
  return (
    <RestaurantTable role={role} access_token={access_token} user={user} />
  );
};

export default ManageRestaurantPage;
