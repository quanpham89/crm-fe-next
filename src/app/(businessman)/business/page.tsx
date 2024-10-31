import { auth } from "@/auth";
import AdminCard from "@/components/admin/admin.card";
import BusinessCard from "@/components/business/dashboard/businessCard";
import { useState } from "react";

const DashboardBussinessPage = async () => {
    {/* chi tiet nha hang
            so luong menu: ten -> so luong mon an: ten
            so luong nguoi mua
            so luong voucher, coupon -> so luong tao, su dung cho san pham nao */}

    const session  = await auth()
    let role = session?.user?.role as string
    return (  
        <>
            <BusinessCard role = {role}/>
        </>      
    )
    
    
}

export default DashboardBussinessPage;






