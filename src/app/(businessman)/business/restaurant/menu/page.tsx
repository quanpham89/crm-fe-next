import { auth } from "@/auth";
import MenuRestaurant from "@/components/business/restaurant/menu/menu";
import { IUser } from "@/types/next-auth";
import { handleGetDataMenu, handleGetDataRestaurantById } from "@/utils/action";
const MenuBusiness = async () => {
  const session = await auth();
  const role = session?.user?.role;
  const access_token = session?.user?.access_token as string;
  const response = await handleGetDataRestaurantById(
    `api/v1/restaurants/get-restaurant-by-id?_id=${session?.user?._id}`,
    access_token
  );
  if (response.data && response.data.length > 0) {
    const { menu, ...rest } = response?.data[0];
    return (
      <MenuRestaurant
        role={role}
        access_token={access_token}
        dataRestaurant={response?.data[0]}
        menu={menu}
      />
    );
  } else {
    return <h4 style={{ textAlign: "center" }}>Tạo shop trước khi tạo menu</h4>;
  }
};

export default MenuBusiness;
