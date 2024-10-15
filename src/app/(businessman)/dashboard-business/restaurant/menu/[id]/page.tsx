import { auth } from "@/auth";
import MenuRestaurantDetail from "@/components/business/restaurant/menu/menuDetail";
import { handleGetDataMenu } from "@/utils/action";

interface IProps {
    params: {id: string},
    searchParams: {[key: string]:string | string[] | undefined}
}
const DetailMenuRestaurant = async(props:IProps) => {
    const menuId = props.params.id
    const session  = await auth()
    let role = session?.user?.role as string
    let access_token = session?.user?.access_token as string
    let restaurantId = session?.user?.access_token
    let user = session?.user
   

    let res = await handleGetDataMenu(`api/v1/menus/get-menu-by-id?_id=${menuId}`, access_token)
    let {menuItem, ...rest} = res?.data[0]
    let menuInfo = {...rest, menuId}


    return (
        <MenuRestaurantDetail
        role = {role}
        access_token = {access_token}
        user = {user}
        menuInfo = {menuInfo}
        menuItems  = {menuItem}
        restaurantId= {restaurantId}
        />
    )
}

export default DetailMenuRestaurant;
