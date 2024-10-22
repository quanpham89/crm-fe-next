import { auth } from "@/auth"
import Order from "@/components/business/restaurant/order/order"
import HomeRender from "@/components/home/home.render"
import RestaurantDetailRender from "@/components/home/detail-restaurant/restaurant.detail.render"
import {  handleGetDataMenuBelongToRender, handleGetDataRestaurantRender  } from "@/utils/action"

const RestaurantRenderDetailPage = async({params}: {params : {id : string}})=>{
    const id = params.id
    const session = await auth()
    const restaurant = await handleGetDataRestaurantRender(`api/v1/restaurants/get-retaurant-render-by-id?_id=${id}`)
    const menu = await handleGetDataMenuBelongToRender(`api/v1/menus/get-menu-belong-to-restaurant?_id=${id}`)
    return <RestaurantDetailRender
        dataRestaurant = {restaurant.data}
        dataMenu = {menu.data}
    />

}

export default RestaurantRenderDetailPage