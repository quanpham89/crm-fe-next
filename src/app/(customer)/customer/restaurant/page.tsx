import { auth } from "@/auth"
import Order from "@/components/business/restaurant/order/order"
import HomeRender from "@/components/home/home.render"
import { handleGetAllCouponRender, handleGetAllRestaurantRender, handleGetAllVoucherRender,  } from "@/utils/action"

const AllRestaurant = async()=>{
    const session = await auth()
    const user = session?.user
    const access_token = session?.user?.access_token as string
    const restaurants = await handleGetAllRestaurantRender(`api/v1/restaurants/get-all-restaurant`)
    const vouchers = await handleGetAllVoucherRender(`api/v1/vouchers/get-all-voucher`)
    const coupons = await handleGetAllCouponRender(`api/v1/coupons/get-all-coupon`)
    return <HomeRender
        restaurant = {restaurants?.data}
        voucher = {vouchers?.data}
        coupon  = {coupons?.data}
    />

}

export default AllRestaurant