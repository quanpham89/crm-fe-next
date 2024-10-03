import { auth } from "@/auth";
import MenuTable from "@/components/restaurant/menu/menu.table";
import RestaurantTable from "@/components/restaurant/restaurant.table";
import { handleGetData, handleGetDataPerPage } from "@/utils/action";
import { useRouter } from "next/router";

interface IProps {
    params: {id: string},
    searchParams: {[key: string]:string | string[] | undefined}
}

const ManageMenuPage = async(props:IProps) => {
    const session  = await auth()
    let role = session?.user?.role as string
    let access_token = session?.user?.access_token as string
    let user = session?.user
    let res = await handleGetData(`api/v1/restaurants/get-retaurant-by-id?_id=${props?.params?.id}`, access_token)
    let dataRestaurant = res?.data
    console.log(dataRestaurant)
    // const currentPage = props?.searchParams?.current ?? 1
    // const pageSize = props?.searchParams?.pageSize ?? 5
    // const nextOptions = {
    //     next : {tags : ['list-menu']}
    // }
    // const dataMenu  = await handleGetDataPerPage(`api/v1/restaurants?current=${currentPage}&pageSize=${pageSize}`, access_token, nextOptions )
    // console.log(dataMenu)
    // const meta = {
    //     current: currentPage,
    //     pageSize: pageSize,
    //     pages: dataMenu?.data?.totalPages,
    //     total: dataMenu?.data?.totalItems
    // }
    return <MenuTable 
    role = {role}
    access_token = {access_token}
    dataRestaurant = {dataRestaurant} 
    user = {user}
    />
}

export default ManageMenuPage;
