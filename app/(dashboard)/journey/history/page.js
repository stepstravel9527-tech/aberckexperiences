import { fetchJourneyHistory } from '@/app/actions/history/data';
import { fetchAuthenticatedUser, fetchMembership } from '@/app/actions/user/data';
import SecurityCheck from '@/components/auth/SecurityCheck';
import { auth } from '@/lib/auth';
import JourneyHistory from "@/components/journey/JourneyHistory";

const page = async () => {

    const { user: sessionUser } = await auth();
    const response = await fetchAuthenticatedUser(sessionUser);
    let authenticatedUser;
    if (response.status === 200) {
        authenticatedUser = response.data;
    } else {
        console.log(response.message);
    }

    const journeyHistory = await fetchJourneyHistory(authenticatedUser);
    const membership = await fetchMembership(authenticatedUser);

    return (
        <>
            <JourneyHistory membership={membership} journeyHistory={journeyHistory} />
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