import { auth } from '@/auth';
import AdminFooter from '@/components/layout/admin.footer';
import BusinessContent from '@/components/layout/business.content';
import BusinessHeader from '@/components/layout/business.header';
import BusinessSideBar from '@/components/layout/business.sidebar';
import { BusinessContextProvider } from '@/library/business.context';

const BusinessLayout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>,) => {
    const session = await auth()
    

    return (
        <BusinessContextProvider>
            <div style={{ display: "flex" }}>
                <div className='left-side' style={{ minWidth: 80 }}>
                    <BusinessSideBar />
                </div>
                <div className='right-side' style={{ flex: 1 }}>
                    <BusinessHeader userName = {session?.user?.name ? session?.user?.name : session?.user?.email}/>
                    <BusinessContent>
                        {children}
                    </BusinessContent>
                    <AdminFooter />
                </div>
            </div>
        </BusinessContextProvider>
    )
}

export default BusinessLayout