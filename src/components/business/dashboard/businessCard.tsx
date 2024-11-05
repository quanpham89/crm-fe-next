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
import "./BusinessCard.scss";
ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(...registerables);

const BusinessCard = (props: any) => {
  const { role, dataFigureOrder } = props;
  const [isLoading, setLoading] = useState(false);

  // config doughnut
  const optionConfigDoughnut = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
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

  const filteredLabelsOrder = dataDoughnutOrder.labels.filter(
    (_: any, index: number) => {
      return dataDoughnutOrder.datasets[0].data[index] > 0;
    }
  );

  const filteredColorsOrder =
    dataDoughnutOrder.datasets[0].backgroundColor.filter((_, index) => {
      return dataDoughnutOrder.datasets[0].data[index] > 0;
    });

  return !isLoading ? (
    <div className="dashboard-container">
      {/* <div className="card">
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
            </div> */}
      {dataFigureOrder && dataFigureOrder.length > 0 && (
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
      )}
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
};

export default BusinessCard;
