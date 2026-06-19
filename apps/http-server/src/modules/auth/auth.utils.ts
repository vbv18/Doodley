import bcrypt from "bcrypt";

import { httpEnv } from "@repo/config/http-env";
import { prisma } from "@repo/db";


// Session Helpers
export async function enforceSessionCap(userId: string): Promise<void> {

    const totalSessions = await prisma.session.count({
        where: {
            userId: Number(userId),
            revoked: false
        }
    });

    if (totalSessions < httpEnv.MAX_SESSIONS_PER_USER) {
        return;
    }

    const oldestSession = await prisma.session.findFirst({
        where: {
            userId: Number(userId),
            revoked: false
        },
        orderBy: {
            createdAt: "asc"
        },
        select: {
            id: true
        }
    });

    if (!oldestSession) {
        return;
    }

    await prisma.session.delete({
        where: {
            id: oldestSession.id
        }
    });
}

// Password Helpers
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, httpEnv.SALT_ROUNDS);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}