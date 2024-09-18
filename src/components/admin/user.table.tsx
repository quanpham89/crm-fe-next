'use client'
import { Button, Table } from "antd"
import ModalCreateUser from "./user.create";
import { useState } from "react";

const UserTable = () => {
    const [isOpenModal, setIsOpenModal] = useState(false)
    const dataSource = [
        {
            key: '1',
            name: 'Mike',
            age: 32,
            address: '10 Downing Street',
        },
        {
            key: '2',
            name: 'John',
            age: 42,
            address: '10 Downing Street',
        },
    ];

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
    ];

    return (
        <>
            <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20
            }}>
                <span>Manager Users</span>
                <Button onClick={() => setIsOpenModal(true)}>Create User</Button>
            </div>
            <Table
                bordered
                dataSource={dataSource}
                columns={columns}
            />
            <ModalCreateUser
                isOpenModal = {isOpenModal}
                setIsOpenModal = {setIsOpenModal}
            />
        </>
    )
}

export default UserTable;