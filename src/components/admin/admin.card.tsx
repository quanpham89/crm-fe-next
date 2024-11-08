"use client";

import { Card, Col, Row, Spin } from "antd";
import { useState, useEffect, useContext } from "react";
import { Bar, Doughnut, Line, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  registerables,
} from "chart.js";
import "./AdminCard.scss";
import { AdminContext } from "@/library/admin.context";
ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(...registerables);

const AdminCard = (props: any) => {
  console.log("dashboard");
  const {
    role,
    dataFigureUser,
    dataFigureVoucher,
    dataFigureRestaurant,
    dataFigureOrder,
  } = props;
  const [isLoading, setLoading] = useState(false);
  const { roleUsers, roleUser, setRoleUser } = useContext(AdminContext)!;
  const [dataVoucher, setDataVoucher] = useState();
  setRoleUser(role);
  // config doughnut
  const optionConfigDoughnut = {
    responsive: true,
    maintainAspectRatio: false, // Cho phép thay đổi tỷ lệ
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const dataDoughnutUser = {
    labels: dataFigureUser.map((item: any) => {
      return item.count > 0 && item.label;
    }),
    datasets: [
      {
        data: dataFigureUser.map((item: any) => item.count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const generateNoteRestaurant = (label: string) => {
    switch (label) {
      case "food":
        return "Đồ ăn";
      case "drink":
        return "Đồ uống";
      case "fastfood":
        return "Đồ ăn nhanh";
      case "all":
        return "Tất cả";
      default:
        return "";
    }
  };

  const dataDoughnutRestaurant = {
    labels: dataFigureRestaurant.map((item: any) => {
      return item.count > 0 && generateNoteRestaurant(item.label);
    }),

    datasets: [
      {
        data: dataFigureRestaurant.map((item: any) => item.count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const generateNoteOrder = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "accept":
        return "Nhận đơn";
      case "prepare":
        return "Chuẩn bị";
      case "receive":
        return "Nhận hàng";
      case "cancel":
        return "Hủy";
      case "reject":
        return "Từ chối";
      case "sending":
        return "Giao hàng";

      default:
        return "";
    }
  };

  const dataDoughnutOrder = {
    labels: dataFigureOrder.map((item: any) => {
      return item.count > 0 && generateNoteOrder(item.status);
    }),
    datasets: [
      {
        data: dataFigureOrder.map((item: any) => item.count),

        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(153, 255, 51, 0.6)",
          "rgba(255, 99, 71, 0.6)",
          "rgba(0, 204, 204, 0.6)",
          "rgba(255, 0, 255, 0.6)",
        ],
        borderColor: "rgba(255, 255, 255, 1)",
        borderWidth: 2,
      },
    ],
  };

  const filteredLabelsUser = dataDoughnutUser.labels.filter(
    (_: any, index: number) => {
      return dataDoughnutUser.datasets[0].data[index] > 0;
    }
  );

  const filteredColorsUser =
    dataDoughnutUser.datasets[0].backgroundColor.filter(
      (_: any, index: number) => {
        return dataDoughnutUser.datasets[0].data[index] > 0;
      }
    );

  const filteredLabelsOrder = dataDoughnutOrder.labels.filter(
    (_: any, index: number) => {
      return dataDoughnutOrder.datasets[0].data[index] > 0;
    }
  );

  const filteredColorsOrder =
    dataDoughnutOrder.datasets[0].backgroundColor.filter((_, index) => {
      return dataDoughnutOrder.datasets[0].data[index] > 0;
    });

  const filteredLabelsRestaurant = dataDoughnutRestaurant.labels.filter(
    (_: any, index: number) => {
      return dataDoughnutRestaurant.datasets[0].data[index] > 0;
    }
  );

  const filteredColorsRestaurant =
    dataDoughnutRestaurant.datasets[0].backgroundColor.filter((_, index) => {
      return dataDoughnutRestaurant.datasets[0].data[index] > 0;
    });

  if (roleUsers.includes(roleUser)) {
    return !isLoading ? (
      <div className="dashboard-container">
        <div className="card">
          <h3>Tổng số người dùng</h3>
          <div className="chart-container">
            <div className="doughnut-chart">
              <Doughnut
                data={dataDoughnutUser}
                options={optionConfigDoughnut}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            <ul className="chart-legend">
              {filteredLabelsUser.map((label: string, index: number) => (
                <li key={index} className="legend-item">
                  <span
                    className="legend-color"
                    style={{
                      backgroundColor: filteredColorsUser[index],
                    }}
                  ></span>
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card">
          <h3>Shop</h3>
          <div className="chart-container">
            <div className="doughnut-chart">
              <Doughnut
                data={dataDoughnutRestaurant}
                options={optionConfigDoughnut}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            <ul className="chart-legend">
              {filteredLabelsRestaurant.length > 0 ? (
                <ul className="chart-legend">
                  {filteredLabelsRestaurant.map(
                    (label: string, index: number) => (
                      <li key={index} className="legend-item">
                        <span
                          className="legend-color"
                          style={{
                            backgroundColor: filteredColorsRestaurant[index],
                          }}
                        ></span>
                        {label}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <div className="no-data-message">
                  Không có dữ liệu để hiển thị
                </div>
              )}
            </ul>
          </div>
        </div>

        <div className="card">
          <h3>Yêu cầu</h3>
          <div className="chart-container">
            <div className="doughnut-chart">
              <Doughnut
                data={dataDoughnutOrder} // Kiểm tra lại biến này
                options={optionConfigDoughnut}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            <ul className="chart-legend">
              {filteredLabelsOrder.length > 0 ? (
                <ul className="chart-legend">
                  {filteredLabelsOrder.map((label: string, index: number) => (
                    <li key={index} className="legend-item">
                      <span
                        className="legend-color"
                        style={{
                          backgroundColor: filteredColorsOrder[index],
                        }}
                      ></span>
                      {label}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="no-data-message">
                  Không có dữ liệu để hiển thị
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>
    ) : (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin />
      </div>
    );
  } else {
    return <div>Bạn không có quyền truy cập vào trang web này</div>;
  }
};

export default AdminCard;
