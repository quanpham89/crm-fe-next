import { auth } from "@/auth";
import ErrorMessageFromUserPage from "@/components/errorMessage/errorMessageFromUser";

const ManageErrorPage = async () => {
  const session = await auth();
  const user = session?.user;
  const access_token = user?.access_token;
  return <ErrorMessageFromUserPage user={user} />;
};

export default ManageErrorPage;
