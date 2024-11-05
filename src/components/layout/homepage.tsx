"use client";

import { CrownOutlined } from "@ant-design/icons";
import { Button, Result } from "antd";
import "./Homepage.scss";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="home-page-container">
      <div className="description">
        <Result icon={<CrownOutlined />} title="Welcome" />
        <div className="route">
          <span>
            <Button>
              <Link href={"/auth/login"}>Đăng nhập</Link>
            </Button>
          </span>
          <span>
            <Button>
              <Link href={"/auth/register"}>Đăng ký</Link>
            </Button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
