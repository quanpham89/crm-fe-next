import { auth } from "@/auth";

const ManageOderPage = async() => {
    const session = await auth()
    return <>order</>
}

export default ManageOderPage;