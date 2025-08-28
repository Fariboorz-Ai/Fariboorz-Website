import { DefaultSession, DefaultUser, Session } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import { DefaultUser } from "next-auth";
declare module "next-auth" {
    interface User {
        national_code?: string;
        role?: string;
        email?: string;
    }
    interface Session extends DefaultSession {
        user: {
            id?: string;
            name?: string;
            national_code?: string;
            role?: string;
            email?: string;
        };
    }

    interface JWT extends DefaultJWT {
        id?: string;
        name?: string;
        national_code?: string;
        role?: string;
        email?: string;
    }


}



