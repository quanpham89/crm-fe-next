import { auth } from "@/auth";
import AdminCard from "@/components/admin/admin.card";
import { handleGetFigure } from "@/utils/action";
import { useState } from "react";

const DashboardPage = async () => {
  const session = await auth();
  let role = (session?.user?.role as string) || "";
  const users = await handleGetFigure("api/v1/users/get-all-figure-users");
  const restaurant = await handleGetFigure(
    "api/v1/restaurants/get-all-figure-restaurant",
  );
  const order = await handleGetFigure("api/v1/orders/get-all-figure-order");
  return (
    <div>
      <AdminCard
        role={role}
        dataFigureUser={users.data}
        // dataFigureVoucher = {voucher.data}
        dataFigureRestaurant={restaurant.data}
        dataFigureOrder={order.data}
      />
    </div>
  );
};

export default DashboardPage;
