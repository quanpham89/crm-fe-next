import { auth } from "@/auth";
import CreateProduct from "@/components/product/product.create";
import RestaurantTable from "@/components/restaurant/restaurant.table";
import { sendRequest } from "@/utils/api";

const ManageRestaurantPage = async () => {
  const session = await auth();
  let role = session?.user?.role as string;
  let access_token = session?.user?.access_token;
  let user = session?.user;

  // tag and revalidateTag chi o server neu dung trong client thi se khong re rendered
  // const res = await sendRequest<IBackendRes<IUserPerPage>>({
  //   url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/restaurants?current=1&pageSize=10`,
  //   method: "GET",
  //   headers: {
  //     Authorization: `Bearer ${access_token}`,
  //   },
  //   nextOption: {
  //     next: { tags: ["data-shop"] },
  //   },
  // });

  // console.log("rewssss", res?.data);
  return (
    <RestaurantTable role={role} access_token={access_token} user={user} />
  );
};

export default ManageRestaurantPage;
