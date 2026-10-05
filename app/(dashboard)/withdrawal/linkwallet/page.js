import { fetchAuthenticatedUser } from "@/app/actions/user/data";
import { auth } from '@/lib/auth';
import SecurityCheck from "@/components/auth/SecurityCheck";
import LinkWallet from "@/components/withdrawal/LinkWallet";

const page = async () => {

    const { user: sessionUser } = await auth();
    const response = await fetchAuthenticatedUser(sessionUser);
    let authenticatedUser;
    if (response.status === 200) {
        authenticatedUser = response.data;
    } else {
        console.log(response.message);
    }

    return (
        <>
            <LinkWallet
                authenticatedUser={{
                    _id: authenticatedUser._id.toString(),
                    currency: authenticatedUser.currency,
                    network_type: authenticatedUser.network_type,
                    wallet_address: authenticatedUser.wallet_address,
                    wallet_name: authenticatedUser.wallet_name,
                    wallet_phone: authenticatedUser.wallet_phone
                }}
            />
            <SecurityCheck
                sessionUser={{
                    security_code: sessionUser.security_code
                }}
                authenticatedUser={{
                    status: authenticatedUser.status,
                    security_code: authenticatedUser.security_code
                }}
            />
        </>
    )
}

export default page