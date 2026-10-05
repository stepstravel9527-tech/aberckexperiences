import { fetchAuthenticatedUser } from "@/app/actions/user/data"
import { auth } from '@/lib/auth';
import SecurityCheck from "@/components/auth/SecurityCheck";
import Recharge from "@/components/recharge/Recharge";

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
            <Recharge
                authenticatedUser={{
                    balance: authenticatedUser.balance
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