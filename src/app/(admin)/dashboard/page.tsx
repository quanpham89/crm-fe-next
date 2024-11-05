import { auth } from "@/auth";
import AdminCard from "@/components/admin/admin.card";
import { handleGetFigure } from "@/utils/action";
import { useState } from "react";

const DashboardPage = async () => {
  const session = await auth();
  let role = session?.user?.role as string;
  const access_token = session?.user?.access_token as string;
  const users = await handleGetFigure(
    "api/v1/users/get-all-figure-users",
    access_token
  );
  const restaurant = await handleGetFigure(
    "api/v1/restaurants/get-all-figure-restaurant",
    access_token
  );
  const order = await handleGetFigure(
    "api/v1/orders/get-all-figure-order",
    access_token
  );
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
