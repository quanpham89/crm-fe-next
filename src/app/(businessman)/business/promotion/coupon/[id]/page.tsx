import { auth } from "@/auth";
import CouponDetail from "@/components/promotion/coupon/coupon.detail";

const CouponDetailPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const session = await auth();
  const role = session?.user?.role;
  return <CouponDetail id={id} session={session} role={role} />;
};

export default CouponDetailPage;
