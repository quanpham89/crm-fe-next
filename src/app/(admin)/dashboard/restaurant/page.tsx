import { auth } from "@/auth";
import CreateProduct from "@/components/product/product.create";
import RestaurantTable from "@/components/restaurant/restaurant.table";

const ManageRestaurantPage = async() => {
    const session  = await auth()
    let role = session?.user?.role as string
    return (
        <RestaurantTable role= {role}/>
    )
}

export default ManageRestaurantPage;
