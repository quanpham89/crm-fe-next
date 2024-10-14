import { auth } from "@/auth"
import RestaurantBusiness from "@/components/business/restaurant/restaurant"

const DetailRestaurant = async()=>{
    const session = await auth()
    const user = session?.user
    return <RestaurantBusiness user={user}/>
}

export default DetailRestaurant