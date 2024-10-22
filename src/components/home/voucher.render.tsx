"use client";

import { Card, Carousel, Image } from "antd";
import "./Home.scss"
import dayjs from "dayjs";

const VoucherRender = (props: any) => {
    const { voucher } = props;
    return (
        <Carousel className="slider-voucher" arrows infinite={false} slidesToShow={5}  >
            {voucher && voucher.length > 0 &&
                voucher.map((item: any, index: number) => {
                    return (
                        <Card className="slide-card" key={item._id}>
                            <div className="image">
                                <Image alt="image" preview={false} src={item.image} width={140} />
                            </div>
                            <div className="slide-cad-content">
                                <h5 style={{ textAlign: "center", marginBottom: "5px 0", fontSize: 15 }}>{item.nameVoucher}</h5>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, gap: 5 }}>
                                    <div><span className="support-title">Thời gian bắt đầu: </span><b>{dayjs(item.startedDate).format("DD/MM/YYYY")}</b></div>
                                    <div><span className="support-title">Thời gian kết thúc: </span><b>{dayjs(item.endedDate).format("DD/MM/YYYY")}</b></div>
                                </div>

                            </div>
                        </Card>
                    )
                })
            }
        </Carousel>

    );
};

export default VoucherRender;
