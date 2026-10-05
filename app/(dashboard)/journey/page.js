import React from 'react'
import { fetchAuthenticatedUser } from '@/app/actions/user/data';
import SecurityCheck from '@/components/auth/SecurityCheck';
import { auth } from '@/lib/auth';
import Journey from "@/components/journey/Journey";

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
      <Journey
        authenticatedUser={{
          balance: authenticatedUser.balance,
          today_commission: authenticatedUser.today_commission,
          daily_available_order: authenticatedUser.daily_available_order,
          today_order: authenticatedUser.today_order,
          allow_rob_order: authenticatedUser.allow_rob_order
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

export default page;