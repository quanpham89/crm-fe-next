import { auth } from "@/auth";
import VoucherDetail from "@/components/promotion/voucher/voucher.detail"

const VoucherDetailPage = async ({params}: {params : {id : string}}) =>{
    const {id} = params
    const session = await auth()
    const role = session?.user?.role;
    const access_token = session?.user?.access_token
    return (
        <VoucherDetail 
        id = {id} 
        session = {session}
        role = {role}
        access_token = {access_token} 
        />
    )
}

export default VoucherDetailPage