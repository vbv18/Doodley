

declare global {
    namespace Express {
        interface User {
            id: number;
            email: string;
            globalRole: GlobalRole;
        }

        interface Request {
            user?: User;
        }
    }
}