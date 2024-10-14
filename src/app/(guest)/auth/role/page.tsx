import { auth } from "@/auth";
import Login from "@/components/auth/login";
import RoleCheck from "@/components/role/roleCheck";
import { Router } from "next/router";

const CheckRolePage = async () => {
    const session = await auth()
    const role = session?.user?.role
    return <RoleCheck role = {role}/>

    
}

export default CheckRolePage;