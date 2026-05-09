import { auth } from "@/auth";
import CouponTable from "@/components/promotion/coupon/coupon.table";

const ManageCoupon = async () => {
  const session = await auth();
  const role = session?.user?.role;
  const user = session?.user;
  const userCreateId = session?.user?._id;
  return <CouponTable role={role} user={user} userCreateId={userCreateId} />;
};

export default ManageCoupon;
