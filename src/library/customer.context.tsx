'use client'

import { createContext, useContext, useState } from "react";

interface ICustomerContext {
    collapseMenu: boolean;
    setCollapseMenu: (v: boolean) => void;
    roleUsers: string[]
    setRoleUser : (v:string) =>void
    roleUser: string,
    currentCart : any,
    setCurrentCart : (v: any) => void;
}

export const CustomerContext = createContext<ICustomerContext | null>(null);

export const CustomerContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [collapseMenu, setCollapseMenu] = useState(false);
    const roleUsers =  ["ADMIN", "ADMINS"]
    const [roleUser, setRoleUser] = useState("")
    const [currentCart, setCurrentCart] = useState([])


    return (
        <CustomerContext.Provider value={{ collapseMenu, setCollapseMenu, roleUsers, roleUser, setRoleUser, currentCart, setCurrentCart}}>
            {children}
        </CustomerContext.Provider>
    )
};

export const useCustomerContext = () => useContext(CustomerContext);