import { auth } from "@/auth"
import RestaurantBusiness from "@/components/business/restaurant/restaurant"
import { handleGetDataRestaurantById } from "@/utils/action"

const DetailRestaurant = async()=>{
    const session = await auth()
    const user = session?.user
    const access_token = user?.access_token as string
    
    return <RestaurantBusiness 
    user={user}
    />
}

export default DetailRestaurant