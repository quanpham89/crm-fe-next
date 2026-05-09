import { auth } from "@/auth";
import MenuDetail from "@/components/restaurant/menu/menu.detail";
import { handleGetDataMenu } from "@/utils/action";

interface IProps {
  params: { id: string; menuId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}
const DetailMenu = async (props: IProps) => {
  const menuId = props.params.menuId;
  const restaurantId = props.params.id;
  const session = await auth();
  let role = session?.user?.role as string;
  let user = session?.user;

  let res = await handleGetDataMenu(
    `api/v1/menus/get-menu-by-id?_id=${menuId}`,
  );
  let { menuItem, ...rest } = res?.data[0];
  let menuInfo = { ...rest, menuId };

  return (
    <MenuDetail
      role={role}
      user={user}
      menuInfo={menuInfo}
      menuItems={menuItem}
      restaurantId={restaurantId}
    />
  );
};

export default DetailMenu;
