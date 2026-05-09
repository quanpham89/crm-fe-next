import { auth } from "@/auth";
import VoucherTable from "@/components/promotion/voucher/voucher.table";

const ManageVoucherPage = async () => {
  const session = await auth();
  const role = session?.user?.role;
  const user = session?.user;
  return <VoucherTable role={role} user={user} />;
};

export default ManageVoucherPage;
