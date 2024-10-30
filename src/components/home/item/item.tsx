"use client"

import { helper } from "@/app/helpers/customize";
import { Card } from "antd";

const Item = (props: any) =>{
    const{product} = props
    return (
        <Card
          key={product.menuItemId}
          title={product.nameItemMenu}
          style={{ width: "100%", marginBottom: 5 }}
        >
          <p>
            <span>{product.restaurantName} _ </span>
            <span>{product.nameMenu}</span>
          </p>
          <div
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <p>
              <span>Số lượng: </span> <span>{product.amount}</span>
            </p>
            <p>
              <span>Giá: </span>
              <span>
                {helper.formatMoneyVND(product.sellingPrice * product.amount)}
              </span>
            </p>
          </div>
        </Card>
      );
}

export default Item