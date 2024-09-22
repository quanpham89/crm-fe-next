'use client'

import { Card, Col, Row, Spin } from "antd";
import { useState, useEffect } from "react";
import { Bar, Doughnut, Line, Radar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    registerables
} from 'chart.js';
import "./AdminCard.scss"
ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(...registerables);



const AdminCard = (props: any) => {
    const { role } = props;
    const [isLoading, setLoading] = useState(true);

    // Dữ liệu cho biểu đồ
    const dataDoughnut = {
        datasets: [{
            label: '% Vote',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1
        }],
    };

    const dataRadar = {
        labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding'],
        datasets: [
            {
                label: 'My First Dataset',
                data: [20, 10, 4, 2, 8],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Giả lập việc tải dữ liệu
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    if (role === "ADMIN") {
        return (
            !isLoading ?
                <Row gutter={16}>
                    <Col span={8}>
                        <Card title="Percentage user" bordered={false}>
                            <div className="custom-bar-width">

                                <Doughnut data={dataDoughnut} options={{ responsive: true }} style={{ width: "33%" }} />
                            </div>
                        </Card>

                    </Col>

                    <Col span={8}>
                        <Card title="Card title 2" bordered={false}>
                            <div className="custom-bar-width">

                                <Radar data={dataRadar} options={{ responsive: true }} style={{ width: "33%" }} />
                            </div>
                        </Card>
                    </Col>

                    <Col span={8}>
                        <Card title="Card title 2" bordered={false}>
                            <div className="custom-bar-width">

                                <Radar data={dataRadar} options={{ responsive: true }} style={{ width: "33%" }} />
                            </div>
                        </Card>
                    </Col>
                </Row> :
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: '100vh' }}>
                    <Spin />
                </div>
        );
    } else {
        return <div>Bạn không có quyền truy cập vào trang web này</div>;
    }
}

export default AdminCard;
