"use client"
import { Modal, Form, Button, Input, message, notification } from "antd"
import { sendRequest } from "@/utils/api";
import { useHasMounted } from "@/utils/customHook";

const ModalConfirmActive =  (props: any) => {
    const {isOpenModalConfirmActive, setOpenModalConfirmActive, title, access_token, type, currentItem} = props
    const hasMounted = useHasMounted();
    if (!hasMounted) return <></>;

    const confirmHidden  = async() =>{
        switch(type){
            case "RESTAURANTS":
                if(!currentItem.isShow){
                    notification.success({
                        message: "Ẩn tài khoản bán hàng",
                        description: "Tài khoản hiện đang không kích hoạt."
                    })
                    setOpenModalConfirmActive(false)
                    return
                }
                const res = await sendRequest<IBackendRes<any>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/restaurants/active-restaurant?_id=${currentItem._id}`,
                    method: "PATCH",
                    headers: {
                        'Authorization': `Bearer ${access_token}`
                    }
                })
                if(res?.data){          
                    notification.success({
                        message: "Hủy kích hoạt tài khoản thành công.",
                        description: res?.message
                    })
                    window.location.reload()
                }else{
                    notification.error({
                        message: "Call APIs error",
                        description: res?.message
                    })
                }
            break;

            case "VOUCHER":
                if(currentItem.status === "PUBLIC"){
                    notification.success({
                        message: "Kích hoạt voucher",
                        description: "Voucher hiện đang được kích hoạt."
                    })
                    setOpenModalConfirmActive(false)
                    return
                }
                const voucher = await sendRequest<IBackendRes<any>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/vouchers/active-voucher?_id=${currentItem._id}`,
                    method: "PATCH",
                    headers: {
                        'Authorization': `Bearer ${access_token}`
                    }
                })
                if(voucher?.data){          
                    notification.success({
                        message: "Kích hoạt voucher thành công.",
                        description: voucher?.message
                    })
                    window.location.reload()
                }else{
                    notification.error({
                        message: "Call APIs error",
                        description: voucher?.message
                    })
                }
            break;
            case "COUPON":
                if(currentItem.status === "PUBLIC"){
                    notification.success({
                        message: "Kích hoạt coupon",
                        description: "Coupon hiện đang được kích hoạt."
                    })
                    setOpenModalConfirmActive(false)
                    return
                }
                const coupon = await sendRequest<IBackendRes<any>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/coupons/active-coupon?_id=${currentItem._id}`,
                    method: "PATCH",
                    headers: {
                        'Authorization': `Bearer ${access_token}`
                    }
                })
                if(coupon?.data){          
                    notification.success({
                        message: "Kích hoạt coupon thành công.",
                        description: coupon?.message
                    })
                    window.location.reload()
                }else{
                    notification.error({
                        message: "Call APIs error",
                        description: coupon?.message
                    })
                }
            break;
            default:
                

        }
       

    }
    return (
        <Modal title= {title}
                open={isOpenModalConfirmActive}
                onOk={() => setOpenModalConfirmActive(false)}
                onCancel={() => setOpenModalConfirmActive(false)}
                maskClosable={false}
                footer={null}
                forceRender={true}

            >
                <Form
                    name = "delete" 
                    autoComplete="off"
                    layout="vertical"
                    >
                        <Form.Item
                            label="Id"
                            name="_id"
                            hidden
                            rules={[
                                {
                                    required: true,
                                    message: 'Chưa xác nhận id của người dùng.',
                                },
                            ]}
                        >
                            <Input  disabled/>
                        </Form.Item>
                        <Form.Item style={{display: "flex", justifyContent: "flex-end", alignItems: "flex-end", marginTop: 40, marginBottom: 0}}>
                        <Button type="primary" htmlType="submit"  onClick={()=>setOpenModalConfirmActive(false)} style={{marginRight: 20}} >
                                CANCLE
                            </Button>
                            <Button type="primary" htmlType="submit"  onClick={confirmHidden} style={{background: "green"}}>
                                ACTIVE
                            </Button>
                            
                        </Form.Item>
                    </Form>

                    
            </Modal>
    )

}

export default ModalConfirmActive