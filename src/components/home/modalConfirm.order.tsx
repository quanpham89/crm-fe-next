"use client"
import { Modal, Form, Button, Input, message, notification } from "antd"
import { sendRequest } from "@/utils/api";
import { useHasMounted } from "@/utils/customHook";

const ModalConfirmOrder =  (props: any) => {
    const {isOpenModalConfirmOrder, setIsOpenModalConfirmOrder, title, data} = props
    const hasMounted = useHasMounted();
    if (!hasMounted) return <></>;

    const confirm  = () =>{

    }
    return (
        <Modal title= {title}
                open={isOpenModalConfirmOrder}
                onOk={() => setIsOpenModalConfirmOrder(false)}
                onCancel={() => setIsOpenModalConfirmOrder(false)}
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
                        <Button type="primary" htmlType="submit"  onClick={()=>setIsOpenModalConfirmOrder(false)} style={{marginRight: 20}} >
                                CANCLE
                            </Button>
                            <Button type="primary" htmlType="submit"  onClick={confirm} style={{background: "green"}}>
                                ACTIVE
                            </Button>
                            
                        </Form.Item>
                    </Form>

                    
            </Modal>
    )

}

export default ModalConfirmOrder