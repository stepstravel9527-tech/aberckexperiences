// lib/auth.config.js
export const authConfig = {
    providers: [],
    pages: {
        signIn: "/welcome",
    },
    callbacks: {
        authorized({ auth, request }) {
            const isLoggedIn = !!auth?.user;
            const { pathname } = request.nextUrl;
            
            const publicPaths = ["/welcome", "/signin", "/signup", "/forgot-password"];
            
            if (publicPaths.includes(pathname)) {
                if (isLoggedIn && pathname !== "/welcome") {
                    return Response.redirect(new URL("/", request.nextUrl));
                }
                return true;
            }
            
            return isLoggedIn;
        },
    },
};