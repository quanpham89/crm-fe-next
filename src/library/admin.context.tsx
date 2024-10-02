'use client'

import { createContext, useContext, useState } from "react";

interface IAdminContext {
    collapseMenu: boolean;
    setCollapseMenu: (v: boolean) => void;
    roleUsers: string[]
    setRoleUser : (v:string) =>void
    roleUser: string
}

export const AdminContext = createContext<IAdminContext | null>(null);

export const AdminContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [collapseMenu, setCollapseMenu] = useState(false);
    const roleUsers =  ["ADMIN", "ADMINS"]
    const [roleUser, setRoleUser] = useState("")


    return (
        <AdminContext.Provider value={{ collapseMenu, setCollapseMenu, roleUsers, roleUser, setRoleUser}}>
            {children}
        </AdminContext.Provider>
    )
};

export const useAdminContext = () => useContext(AdminContext);