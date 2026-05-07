import { auth } from "@/auth";
import { handleGetDataMenu, handleGetDataRestaurantById } from "@/utils/action";
const FeedbackBusiness = async () => {
  const session = await auth();
  const role = session?.user?.role;
  const access_token = session?.user?.access_token as string;
  const response = await handleGetDataRestaurantById(
    `api/v1/restaurants/get-restaurant-by-id?_id=${session?.user?._id}`,
    access_token
  );
  return "Feedback"
};

export default FeedbackBusiness;
