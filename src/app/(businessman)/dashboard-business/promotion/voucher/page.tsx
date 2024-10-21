import { auth } from "@/auth";
import VoucherTable from "@/components/promotion/voucher/voucher.table"

const ManageVoucherPage = async () =>{
    const session = await auth()
    const role = session?.user?.role;
    const access_token = session?.user?.access_token
    const user = session?.user
    const userCreateId = session?.user?._id
    
    return <VoucherTable 
    role = {role} 
    access_token = {access_token} 
    user = {user}
    userCreateId = {userCreateId}
    />
}

export default ManageVoucherPage