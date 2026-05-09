import { auth } from "@/auth";
import VoucherDetail from "@/components/promotion/voucher/voucher.detail";

const VoucherDetailPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const session = await auth();
  const role = session?.user?.role;
  return <VoucherDetail id={id} session={session} role={role} />;
};

export default VoucherDetailPage;
