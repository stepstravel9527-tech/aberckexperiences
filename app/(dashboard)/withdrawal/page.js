import { fetchAuthenticatedUser } from '@/app/actions/user/data';
import { auth } from '@/lib/auth';
import SecurityCheck from '@/components/auth/SecurityCheck';
import Withdrawal from "@/components/withdrawal/Withdrawal";

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
            <Withdrawal
                authenticatedUser={{
                    balance: authenticatedUser.balance,
                    username: authenticatedUser.username,
                    wallet_phone: authenticatedUser.wallet_phone,
                    wallet_address: authenticatedUser.wallet_address,
                    network_type: authenticatedUser.network_type,
                    currency: authenticatedUser.currency,
                    allow_withdrawal: authenticatedUser.allow_withdrawal
                }} />
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