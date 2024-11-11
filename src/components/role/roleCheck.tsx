"use client";

import { Flex, Spin } from "antd";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const RoleCheck = (props: any) => {
  const router = useRouter();
  const { role } = props;
  const checkRole = (role: string) => {
    switch (role) {
      case "ADMIN":
      case "ADMINS":
        router.push("/dashboard");
        // setTimeout(() => {
        // }, 1000);
        break;
      case "BUSINESSMAN":
        router.push("/business/user");
        // setTimeout(() => {
        // }, 1000);
        break;

      case "CUSTOMER":
        router.push("/customer");
        // setTimeout(() => {
        // }, 1000);
        break;
    }
  };

  useEffect(() => {
    checkRole(role);
  }, [role]);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 50,
      }}
    >
      <h3>
        {" "}
        Lần đầu đăng nhập sẽ mất khoảng 2-3 phút, thực hiện đăng nhập lại lần
        nữa để truy cập.(Lần sau đăng nhập sau sẽ không mất thời gian để khởi
        động lại back end.){" "}
      </h3>
      <span>
        <Flex align="center" gap="middle">
          <Spin size="large" />
        </Flex>
      </span>
    </div>
  );
};

export default RoleCheck;
