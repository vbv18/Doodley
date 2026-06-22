import { GlobalRole } from "@repo/types";


export type AuthUser = {
    id: number;
    name: string;
    email: string;
    globalRole: GlobalRole;
}