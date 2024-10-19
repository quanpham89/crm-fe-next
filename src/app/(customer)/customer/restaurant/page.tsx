import { auth } from "@/auth"
import Order from "@/components/business/restaurant/order/order"
import HomePage from "@/components/home/home.render"
import { handleGetAllRestaurantRender,  } from "@/utils/action"

const AllRestaurant = async()=>{
    const session = await auth()
    const user = session?.user
    const access_token = session?.user?.access_token as string
    const response = await handleGetAllRestaurantRender(`api/v1/restaurants/get-all-restaurant`)
    return <HomePage
    restaurant = {response?.data}
    />
}

export default AllRestaurant