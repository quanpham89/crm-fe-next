import { auth } from "@/auth";
import CouponDetail from "@/components/promotion/coupon/coupon.detail";

const CouponDetailPage = async ({params}: {params : {id : string}}) =>{
    const {id} = params
    const session = await auth()
    const role = session?.user?.role;
    const access_token = session?.user?.access_token
    return (
        <CouponDetail 
        id = {id} 
        session = {session}
        role = {role}
        access_token = {access_token} 
        />
    )
}

export default CouponDetailPage