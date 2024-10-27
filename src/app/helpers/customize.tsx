import { notification } from "antd";

const formatMoneyVND = (number: number) => {
    return new Intl.NumberFormat('en-US').format(number).replace(/,/g, ' ') + ' VNĐ';
}



const isExistItemInCart = (currentItem: any[], value: any) => {
    return currentItem.some((item: any) => {
        return item.menuItemId === value.menuItemId;
    });
};

const parsePrice = (priceString:any) => {
    return parseFloat(priceString.replace(/[^0-9.-]+/g, ''));
};

export const helper = {
    formatMoneyVND,
    isExistItemInCart,
    parsePrice
};
