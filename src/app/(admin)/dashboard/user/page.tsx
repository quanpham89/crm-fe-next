import { auth } from "@/auth";
import UserTable from "@/components/admin/user.table";

const ManageUserPage = async () => {
    const session  = await auth()
    let role = session?.user?.role as string
    return (
        <div>
            <UserTable role= {role}/>
        </div>
    )
}

export default ManageUserPage;