import { auth } from "@/auth"
import Cart from "@/components/home/cart/cart.render"
import { handleGetDataRestaurantById, handleGetVoucherPerUserId } from "@/utils/action"

const Card = async()=>{
    const session = await auth()
    const user = session?.user
    const access_token = session?.user?.access_token as string
    // const response = await handleGetDataRestaurantById(`api/v1/menus/get-menu-by-id?_id=670deec28415cd57260147ba`, access_token)
    const voucher = await handleGetVoucherPerUserId(`api/v1/customers/get-voucher-create-by-admin?_id=${user?._id}`, access_token)
    const coupon = await handleGetVoucherPerUserId(`api/v1/customers/get-coupon-create-by-admin?_id=${user?._id}`, access_token)
    return <Cart
    access_token = {access_token}
    user = {user}
    vouchers = {voucher.data[0].voucher}
    coupons = {coupon.data[0].coupon}


    />
}

export default Card