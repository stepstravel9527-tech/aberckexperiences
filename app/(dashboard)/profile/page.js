import { fetchAuthenticatedUser } from '@/app/actions/user/data';
import { auth } from '@/lib/auth';
import SecurityCheck from '@/components/auth/SecurityCheck';
import Profile from "@/components/profile/Profile";

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
            <Profile  authenticatedUser={{
                    url: authenticatedUser.url,
                    username: authenticatedUser.username,
                    invitation_code: authenticatedUser.invitation_code,
                    credibility: authenticatedUser.credibility,
                    balance: authenticatedUser.balance
                }}/>
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