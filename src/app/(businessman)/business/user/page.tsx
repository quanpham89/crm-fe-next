import { auth } from "@/auth";
import AdminCard from "@/components/admin/admin.card";
import BusinessCard from "@/components/business/dashboard/businessCard";
import MeInfor from "@/components/business/user/me";
import { useState } from "react";

const DashboardBussinessUserPage = async () => {
    const session = await auth()
    const user = session?.user
    return (
        <>
            <MeInfor user = {user}/>
        </>
    )
    
    
}

export default DashboardBussinessUserPage;






