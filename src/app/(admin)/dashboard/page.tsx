import { auth } from "@/auth";
import AdminCard from "@/components/admin/admin.card";
import { useState } from "react";

const DashboardPage = async () => {
    
    const session  = await auth()
    let role = session?.user?.role as string
    return (
        <div>
            <AdminCard role = {role} />
        </div>
    )
    
    
}

export default DashboardPage;






