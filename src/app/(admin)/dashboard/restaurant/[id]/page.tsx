import { auth } from "@/auth";


const Restaurant = async() => {
    const session  = await auth()
    let role = session?.user?.role as string
    let access_token = session?.user?.access_token
    return (
        <></>
    )
}

export default Restaurant;
