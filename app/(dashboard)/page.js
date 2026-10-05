import { auth } from '@/lib/auth';
import { fetchNotice, fetchPop } from "../actions/notice/data";
import { fetchAuthenticatedUser, fetchCommission } from "../actions/user/data";
import SecurityCheck from "@/components/auth/SecurityCheck";
import Dashboard from "@/components/dashboard/Dashboard";


const page = async () => {

    const { user: sessionUser } = await auth();
    const response = await fetchAuthenticatedUser(sessionUser);
    let authenticatedUser;
    if (response.status === 200) {
        authenticatedUser = response.data;
    } else {
        console.log(response.message);
    }
    const notice = await fetchNotice();

    const allCommission = await fetchCommission();

    const pop = await fetchPop() || {};

    return (
        <>
            <Dashboard
                authenticatedUser={{
                    url: authenticatedUser.url,
                    username: authenticatedUser.username,
                    membership_level: authenticatedUser.membership_level
                }}
                allCommission={allCommission}
                userCommission={authenticatedUser.membership_level}
                pop={{
                    image: pop.image,
                    username: pop.animationDuration,
                    username: pop.animationTimingFunction,
                    username: pop.animationType
                }}
                notice={notice.notice}
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