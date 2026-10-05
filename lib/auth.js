// lib/auth.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectToDB } from "@/lib/connection";
import { User } from "@/modals/User";
import { LoginHistory } from "@/modals/LogHistory";
import axios from "axios";
import { headers } from 'next/headers';
import { UAParser } from 'ua-parser-js';

const login = async (credentials) => {

    try {
        await connectToDB();
        const user = await User.findOne({
            $and: [
                {
                    $or: [
                        { username: credentials.username },
                        { phone_number: credentials.username }
                    ]
                },
                {
                    role: { $in: ['user', 'practice', 'agent'] } // Ensures the role is one of the specified roles
                }
            ]
        }).lean();


        if (!user) {
            return null;
        }

        if (!user?.status) {
            return null
        }

        if (user?.role === "user" || user?.role === "practice" || user?.role === "agent") {

        } else {
            return null
        }

        const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
        );

        if (!isPasswordCorrect) {
            return null
        }

        // const headersList = headers();
        // const xRealIp = headersList.get('x-real-ip');
        // const xRealIp = "203.144.68.208";

        // var deviceIP = xRealIp || "Unknown";

        const headersList = headers();

        const cfConnectingIp = headersList.get('cf-connecting-ip');
        const xForwardedFor = headersList.get('x-forwarded-for');
        const xRealIp = headersList.get('x-real-ip');

        let deviceIP = cfConnectingIp || (xForwardedFor ? xForwardedFor.split(',')[0].trim() : null) || xRealIp || "Unknown";

        const res = await axios.get(`http://ipwho.is/${deviceIP}`);
        // const res = await axios.get(`http://ip-api.com/json/${deviceIP}`);
        const data = res.data;

        const userAgentString = headersList.get('user-agent') || '';
        const parser = new UAParser(userAgentString);
        const uaResult = parser.getResult();

        const domain = headersList.get('host') || 'Unknown';

        if (res.status === 200) {
            await LoginHistory.create({
                username: user?.username,
                phone_number: user?.phone_number,
                ip_address: deviceIP,
                country_name: data?.country,
                region_name: data?.regionName,
                city_name: data?.city,
                device_type: uaResult.device.type || 'desktop',
                os: uaResult.os.name + ' ' + uaResult.os.version,
                browser: uaResult.browser.name + ' ' + uaResult.browser.version,
                domain: domain,
            });

            const currentDateTime = new Date();

            await User.findByIdAndUpdate(user?._id, {
                last_login: currentDateTime
            });
        }

        return user;
    } catch (err) {
        console.log(err);
    }
};

const nextAuthHandler = NextAuth({
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                try {
                    const user = await login(credentials);
                    return user;
                } catch (err) {
                    return null;
                }
            },
        }),
    ],
    // ADD ADDITIONAL INFORMATION TO SESSION
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/signin",
    },
    callbacks: {
        jwt: async ({ token, user }) => {
            user && (token.user = user)
            return token
        },
        session: async ({ session, token }) => {
            const user = token.user
            session.user = user
            return session
        }
    }
})

export const { signIn, signOut, auth } = nextAuthHandler
export default nextAuthHandler
