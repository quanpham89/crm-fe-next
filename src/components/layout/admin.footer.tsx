"use client";
import { Layout } from "antd";

const AdminFooter = () => {
  const { Footer } = Layout;

  return (
    <>
      <Footer style={{ textAlign: "center" }}>
        ©{new Date().getFullYear()} - Tạo bởi Phạm Đình Quân
      </Footer>
    </>
  );
};

export default AdminFooter;
