import { auth } from "@/auth";
import ErrorMessageForAdminPage from "@/components/errorMessage/errorMessageToAdmin";
import { handleGetErrorForAdmin } from "@/utils/action";

const ManageErrorPage = async () => {
  const session = await auth();
  const user = session?.user;
  const access_token = user?.access_token as string;

  const response = await handleGetErrorForAdmin(
    "api/v1/error-message",
    access_token
  );
  if (user?.role === "ADMINS") {
    return (
      <ErrorMessageForAdminPage
        user={user}
        error={response?.data ? response.data : []}
      />
    );
  } else {
    return <>Bạn không có quyền truy cập chức năng này</>;
  }
};

export default ManageErrorPage;
