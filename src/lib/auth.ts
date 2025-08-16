import { adminAuth } from "./firebaseAdmin";
import { headers } from "next/headers";

export async function getBearerToken() {
    const headerList = await headers();
    const authHeader = headerList.get('Authorization');
    if (!authHeader?.startsWith('Bearer')) {
        throw new Error('Authorization header is missing or invalid');
    }

    return authHeader.replace("Bearer ", "");
}

export async function verifyToken(token: string) {
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        return decodedToken;
    } catch (error) {
        console.error('Error verifying Firebase ID token:', error);
        throw new Error('Invalid Firebase ID token');
    }
}

export async function verifyFirebaseToken() {
    const token = await getBearerToken();
    return await verifyToken(token);
}