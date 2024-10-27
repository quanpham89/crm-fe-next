import { auth } from "@/auth"
import Cart from "@/components/home/cart/cart.render"
import { handleGetDataRestaurantById } from "@/utils/action"

const Card = async()=>{
    const session = await auth()
    const user = session?.user
    const access_token = session?.user?.access_token as string
    const response = await handleGetDataRestaurantById(`api/v1/menus/get-menu-by-id?_id=670deec28415cd57260147ba`, access_token)
    return <Cart
    data = {response?.data[0]}
    access_token = {access_token}
    />
}

export default Card