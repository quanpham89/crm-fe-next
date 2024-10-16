'use client'

import { createContext, useContext, useState } from "react";

interface ICustomerContext {
    collapseMenu: boolean;
    setCollapseMenu: (v: boolean) => void;
    roleUsers: string[]
    setRoleUser : (v:string) =>void
    roleUser: string
}

export const CustomerContext = createContext<ICustomerContext | null>(null);

export const CustomerContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [collapseMenu, setCollapseMenu] = useState(false);
    const roleUsers =  ["ADMIN", "ADMINS"]
    const [roleUser, setRoleUser] = useState("")


    return (
        <CustomerContext.Provider value={{ collapseMenu, setCollapseMenu, roleUsers, roleUser, setRoleUser}}>
            {children}
        </CustomerContext.Provider>
    )
};

export const useCustomerContext = () => useContext(CustomerContext);