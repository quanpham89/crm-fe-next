const formatMoneyVND = (number: number) => {
    return new Intl.NumberFormat('en-US').format(number).replace(/,/g, ' ') + ' VNĐ';
}

export const helper = {
    formatMoneyVND
};
