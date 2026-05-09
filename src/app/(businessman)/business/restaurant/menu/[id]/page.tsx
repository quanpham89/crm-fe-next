import { auth } from "@/auth";
import MenuRestaurantDetail from "@/components/business/restaurant/menu/menuDetail";
import { handleGetDataMenu } from "@/utils/action";

interface IProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}
const DetailMenuRestaurant = async (props: IProps) => {
  const menuId = props.params.id;
  const session = await auth();
  let role = session?.user?.role as string;
  let user = session?.user;

  let res = await handleGetDataMenu(
    `api/v1/menus/get-menu-by-id?_id=${menuId}`,
  );
  let { menuItem, ...rest } = res?.data[0];
  let menuInfo = { ...rest, menuId };

  return (
    <MenuRestaurantDetail
      role={role}
      user={user}
      menuInfo={menuInfo}
      menuItems={menuItem}
      restaurantId={res?.data[0]?.restaurant?._id}
    />
  );
};

export default DetailMenuRestaurant;
