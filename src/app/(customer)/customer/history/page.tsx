import { auth } from "@/auth"
import AllHistoryRender from "@/components/home/history/history.render"
import { handleGetDataUserCustomer, handleGetOrderById } from "@/utils/action"

const AllHistoryPage = async()=>{
    const session = await auth()
    const user = session?.user
    const access_token = session?.user?.access_token as string
    const data = await handleGetDataUserCustomer(`api/v1/customers/get-customer-by-id?_id=${user?._id}`,access_token ); 
    const customerId = data.data._id
    const dataOrder = customerId ? await handleGetOrderById(`api/v1/orders/get-order-by-id?_id=${customerId}`,access_token ) : []; 

    return <AllHistoryRender
    access_token = {access_token}
    user = {user}
    orders = {dataOrder}
    />
}

export default AllHistoryPage