import { auth } from "@/auth";
import CouponTable from "@/components/promotion/coupon/coupon.table";

const ManageCoupon = async () => {
  const session = await auth();
  const role = session?.user?.role;
  const user = session?.user;
  return <CouponTable role={role} user={user} />;
};

export default ManageCoupon;
