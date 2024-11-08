import { auth } from "@/auth";
import AdminCard from "@/components/admin/admin.card";
import BusinessCard from "@/components/business/dashboard/businessCard";
import MeInfo from "@/components/business/user/me";
import { handleGetFigure } from "@/utils/action";
import { useState } from "react";

const DashboardBusinessUserPage = async () => {
  const session = await auth();
  const user = session?.user;
  const access_token = user?.access_token as string;
  const data = await handleGetFigure(
    `api/v1/order-detail/get-all-figure-order-detail-by-id?_id=${user?.restaurantId}`,
    access_token
  );

  const dataFigureOrderBelongToMenu = await handleGetFigure(
    `api/v1/order-detail/get-all-figure-order-detail-booking-belong-to-menu-by-id?_id=${user?.restaurantId}`,
    access_token
  );

  return (
    <>
      <MeInfo
        dataFigureOrder={data.data}
        user={user}
        dataFigureOrderBelongToMenu={dataFigureOrderBelongToMenu.data}
      />
    </>
  );
};

export default DashboardBusinessUserPage;
