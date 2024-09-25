"use client"
import { Modal, Form, Button, Input, message, notification } from "antd"
import { sendRequest } from "@/utils/api";
import { useHasMounted } from "@/utils/customHook";

const ModalConfirmHidden =  (props: any) => {
    const {isOpenModalConfirmHidden, setOpenModalConfirmHidden, title, access_token, type, currentItem} = props
    const hasMounted = useHasMounted();
    if (!hasMounted) return <></>;

    const confirmHidden  = async() =>{
        switch(type){
            case "USER": 
                if(!currentItem.isActive){
                    notification.success({
                        message: "Hủy kích hoạt tài khoản",
                        description: "Tài khoản hiện đang không kích hoạt."
                    })
                    setOpenModalConfirmHidden(false)
                    return
                }
                const resUser = await sendRequest<IBackendRes<any>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/soft-delete?_id=${currentItem._id}`,
                    method: "PATCH",
                    headers: {
                        'Authorization': `Bearer ${access_token}`
                    }
                    
                })
        
                if(resUser?.data){          
                    notification.success({
                        message: "Hủy kích hoạt tài khoản thành công.",
                        description: resUser?.message
                    })
                    window.location.reload()
                }else{
                    notification.error({
                        message: "Call APIs error",
                        description: resUser?.message
                    })
                }
            break;
            case "RESTAURANTS":
                if(!currentItem.isShow){
                    notification.success({
                        message: "Ẩn tài khoản bán hàng",
                        description: "Tài khoản hiện đang không kích hoạt."
                    })
                    setOpenModalConfirmHidden(false)
                    return
                }
                const res = await sendRequest<IBackendRes<any>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/restaurants/soft-delete?_id=${currentItem._id}`,
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
            default:
                

        }
       

    }
    return (
        <Modal title= {title}
                open={isOpenModalConfirmHidden}
                onOk={() => setOpenModalConfirmHidden(false)}
                onCancel={() => setOpenModalConfirmHidden(false)}
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
                        <Button type="primary" htmlType="submit"  onClick={()=>setOpenModalConfirmHidden(false)} style={{marginRight: 20}} >
                                CANCLE
                            </Button>
                            <Button type="primary" htmlType="submit"  onClick={confirmHidden} style={{background: "red"}}>
                                HIDDEN
                            </Button>
                            
                        </Form.Item>
                    </Form>

                    
            </Modal>
    )

}

export default ModalConfirmHidden