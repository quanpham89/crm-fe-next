"use client"

import { AdminContext } from "@/library/admin.context"
import { handleGetData, handleGetDataPerPage } from "@/utils/action"
import { sendRequest } from "@/utils/api"
import { BarsOutlined, CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, MinusCircleOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Col, Descriptions, Form, Input, InputNumber, notification, Row, Space, Spin, Table, Upload } from "antd"
import { usePathname, useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import "../Pagination.scss"

const MenuDetailDelete = (props: any) => {
    return <>MenuDetailDelete</>
  
}



export default MenuDetailDelete