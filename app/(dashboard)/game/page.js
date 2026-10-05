import { fetchAuthenticatedUser } from "@/app/actions/user/data";
import { auth } from '@/lib/auth';
import SecurityCheck from "@/components/auth/SecurityCheck";
import EggCrack from "@/components/game/LuckySpin";
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
            <EggCrack user={{
                winning_amount: authenticatedUser.winning_amount,
                number_of_draws: authenticatedUser.number_of_draws
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