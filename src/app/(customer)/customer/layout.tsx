import { auth } from "@/auth";
import AdminFooter from "@/components/layout/admin.footer";
import CustomerContent from "@/components/layout/customer.content";
import CustomerHeader from "@/components/layout/customer.header";
import CustomerSideBar from "@/components/layout/customer.sidebar";
import { CustomerContextProvider } from "@/library/customer.context";

const CustomerLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth();

  return (
    <CustomerContextProvider>
      <div style={{ display: "flex" }}>
        <div className="left-side">
          <CustomerSideBar />
        </div>
        <div className="right-side" style={{ flex: 1 }}>
          <CustomerHeader
            userName={
              session?.user?.name ? session?.user?.name : session?.user?.email
            }
          />
          <CustomerContent>{children}</CustomerContent>
          <AdminFooter />
        </div>
      </div>
    </CustomerContextProvider>
  );
};

export default CustomerLayout;
