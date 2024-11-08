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
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
        break;
      case "BUSINESSMAN":
        setTimeout(() => {
          router.push("/business/user");
        }, 1000);
        break;

      case "CUSTOMER":
        setTimeout(() => {
          router.push("/customer");
        }, 1000);
        break;
    }
  };

  useEffect(() => {
    checkRole(role);
  }, [role]);

  const [percent, setPercent] = useState(-50);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const totalUpdates = 20;
    const incrementValue = 5;
    const updateInterval = 1000 / totalUpdates;

    let updatesCount = 0;

    const updatePercent = () => {
      setPercent((v) => {
        const nextPercent = v + incrementValue;
        return nextPercent > 150 ? -50 : nextPercent;
      });

      updatesCount += 1;
      if (updatesCount < totalUpdates) {
        timerRef.current = setTimeout(updatePercent, updateInterval);
      }
    };

    updatePercent();
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Flex align="center" gap="middle">
        <Spin percent={percent} size="large" />
      </Flex>
    </div>
  );
};

export default RoleCheck;
