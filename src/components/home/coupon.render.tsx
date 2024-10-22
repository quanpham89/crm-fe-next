"use client";

import { Card, Carousel, Image } from "antd";
import "./Home.scss"
import dayjs from "dayjs";

const CouponRender = (props: any) => {
    const { coupon } = props;
    return (
        <Carousel className="slider-coupon" arrows infinite={false} slidesToShow={5}  >
            {coupon && coupon.length > 0 &&
                coupon.map((item: any, index: number) => {
                    return (
                        <Card className="slide-card" key={item._id}>
                                <Image alt="image" preview={false} src={item.image} width={140}  />
                                <h5 style={{ textAlign: "center", margin: " 5px 0", fontSize: 15 }}>{item.nameCoupon}</h5>
                                <div style={{display: "flex", justifyContent: "space-between", fontSize: 12, gap: 5}}>
                                    <div><span className="support-title">Thời gian bắt đầu: </span><b>{dayjs(item.startedDate).format("DD/MM/YYYY")}</b></div>
                                    <div><span className="support-title">Thời gian kết thúc: </span><b>{dayjs(item.endedDate).format("DD/MM/YYYY")}</b></div>
                                </div>
                            </Card>
                    )
                })
            }
        </Carousel>

    );
};

export default CouponRender;
