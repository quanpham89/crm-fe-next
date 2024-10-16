import { auth } from "@/auth"
import Order from "@/components/business/restaurant/order/order"
import Customer from "@/components/customer/customer"
import { handleGetDataRestaurantById, handleGetDataUserCustomer } from "@/utils/action"

const CustomerPage = async()=>{
    const session = await auth()
    const user = session?.user
    const access_token = session?.user?.access_token as string
    const data = await handleGetDataUserCustomer(`api/v1/custormers/get-customer-by-id?_id=${user?._id}`, access_token)
    return  <Customer
    dataUser = {data?.data}
    user
    />
}

export default CustomerPage