import { auth } from "@/auth";
import Cart from "@/components/home/cart/cart.render";
import {
  handleGetDataRestaurantById,
  handleGetVoucherPerUserId,
} from "@/utils/action";

const Card = async () => {
  const session = await auth();
  const user = session?.user;
  const domainUrl = process.env.DOMAIN_URL;
  const voucher = await handleGetVoucherPerUserId(
    `api/v1/customers/get-voucher-create-by-admin?_id=${user?._id}`,
  );
  const coupon = await handleGetVoucherPerUserId(
    `api/v1/customers/get-coupon-create-by-admin?_id=${user?._id}`,
  );
  const customerId = voucher.data[0]._id;
  return (
    <Cart
      user={user}
      vouchers={voucher.data[0].voucher}
      coupons={coupon.data[0].coupon}
      domainUrl={domainUrl}
      customerId={customerId}
    />
  );
};

export default Card;
