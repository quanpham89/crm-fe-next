import { auth } from "@/auth";

const Restaurant = async () => {
  const session = await auth();
  let role = session?.user?.role as string;
  return <></>;
};

export default Restaurant;
