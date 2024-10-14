'use client'

import { createContext, useContext, useState } from "react";

interface IBusinessContext {
    collapseMenu: boolean;
    setCollapseMenu: (v: boolean) => void;
    roleUsers: string[]
    setRoleUser : (v:string) =>void
    roleUser: string
}

export const BusinessContext = createContext<IBusinessContext | null>(null);

export const BusinessContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [collapseMenu, setCollapseMenu] = useState(false);
    const roleUsers =  ["ADMIN", "ADMINS"]
    const [roleUser, setRoleUser] = useState("")


    return (
        <BusinessContext.Provider value={{ collapseMenu, setCollapseMenu, roleUsers, roleUser, setRoleUser}}>
            {children}
        </BusinessContext.Provider>
    )
};

export const useBusinessContext = () => useContext(BusinessContext);