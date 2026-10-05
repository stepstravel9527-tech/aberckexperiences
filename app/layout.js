import '@fortawesome/fontawesome-free/css/all.min.css';
import '@/styles/globals.scss'
import '@/styles/appLayout.scss';
import '@/styles/common.scss';
import AppToaster from '@/components/AppToaster';
import NextTopLoader from 'nextjs-toploader';
import LiveSupport from '@/components/support/LiveSupport';
import { fetchSupport } from '@/app/actions/support/data';


export const metadata = {
    title: "Welcome",
    description: "",
    icons: "/favicon.ico"
}

export default async function RootLayout({ children }) {
    let licenseId = process.env.NEXT_PUBLIC_LIVECHAT_LICENSE_ID;
    try {
        const support = await fetchSupport() || {};
        licenseId = support?.live_chat || licenseId;
    } catch (error) {
        console.error('Using fallback LiveChat license:', error);
    }

    return (
        <html lang="en">
            <body>
                <AppToaster />
                <div className="platformLayout">
                    <div className="platformContent">
                        {children}
                    </div>
                </div>
                <NextTopLoader />
                {licenseId && <LiveSupport license={licenseId} />}
            </body>
        </html>
    );
}
