import { auth } from "@/auth";
import ErrorMessageFromUserPage from "@/components/errorMessage/errorMessageFromUser";

const ManageErrorBusinessmanPage = async () => {
  const session = await auth();
  const user = session?.user;
  return <ErrorMessageFromUserPage user={user} />;
};

export default ManageErrorBusinessmanPage;
