import { prisma } from "@/lib/prisma";
import { verifyFirebaseToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
    const decodedToken = await verifyFirebaseToken();
    if (!decodedToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { uid: firebaseUid } = decodedToken;

    const userProfile = await prisma.userProfile.upsert({
        where: { firebaseUid },
        update: {},
        create: {
            firebaseUid,
            nickname: decodedToken.name || 'Anonymous',
            ticketbalance: 3,
        }
    });

    return NextResponse.json(userProfile);
}