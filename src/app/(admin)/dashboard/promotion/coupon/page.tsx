import { auth } from "@/auth";
import CouponTable from "@/components/promotion/coupon/coupon.table"

const ManageCoupon = async () =>{
    const session = await auth()
    const role = session?.user?.role;
    const access_token = session?.user?.access_token
    const user = session?.user
    return <CouponTable role={role} access_token = {access_token} user = {user}/>
}

export default ManageCoupon