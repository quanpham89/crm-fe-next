import { auth } from "@/auth";
import UserTable from "@/components/admin/user.table";

const ManageUserPage = async () => {
    const session  = await auth()
    let role = session?.user?.role as string
    let access_token = session?.user?.access_token as string
    let user = session?.user?.name as string
    
    return (
        <div>
            <UserTable role= {role} access_token = {access_token} />
        </div>
    )
}

export default ManageUserPage;