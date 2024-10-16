import { auth } from "@/auth"
import OrderTable from "@/components/business/restaurant/order/order.table"
import { handleGetDataRestaurantById } from "@/utils/action"

const DetailOrderRestaurant = async()=>{
    const session = await auth()
    const user = session?.user
    const access_token = session?.user?.access_token as string
    const response = await handleGetDataRestaurantById(`api/v1/menus/get-menu-by-id?_id=670deec28415cd57260147ba`, access_token)
    console.log(response)
    return <OrderTable
    data = {response?.data[0]}
    access_token = {access_token}
    />
}

export default DetailOrderRestaurant