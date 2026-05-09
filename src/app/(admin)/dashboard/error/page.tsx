import { auth } from "@/auth";
import ErrorMessageForAdminPage from "@/components/errorMessage/errorMessageToAdmin";
import { handleGetErrorForAdmin } from "@/utils/action";

const ManageErrorPage = async () => {
  const session = await auth();
  const user = session?.user;

  const response = await handleGetErrorForAdmin("api/v1/error-message");
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
