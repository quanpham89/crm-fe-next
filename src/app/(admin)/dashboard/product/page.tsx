import { auth } from "@/auth";
import CreateProduct from "@/components/product/product.create";

const ManageProductPage = async() => {
    const session = await auth()
    return (
        <CreateProduct user = {session?.user}/>
    )
}

export default ManageProductPage;