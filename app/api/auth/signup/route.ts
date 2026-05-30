// app/api/auth/signup/route.ts
import { apiResponse } from '@/lib/api/response'
import {
    createUser,
    getUserByPhone,
} from '@/lib/db/repositories/public/user.public.repository'
import { adminAuth } from '@/lib/firebase/admin'
import { NextResponse } from 'next/server'

export const POST = async (req: Request) => {
    try {
        const { firstName, lastName, phone, firebaseToken } = await req.json()

        // 1. Validate input
        if (!firstName || !lastName || !phone || !firebaseToken) {
            return apiResponse({ error: 'Missing required fields' }, 400)
        }

        // 2. Verify Firebase token to ensure the client truly owns this phone number
        const decoded = await adminAuth.verifyIdToken(firebaseToken)
        if (decoded.phone_number !== phone) {
            return apiResponse({ error: 'Phone number mismatch' }, 403)
        }

        // 3. Check if user already exists
        const existing = await getUserByPhone(phone)
        if (existing.length) {
            return apiResponse({ error: 'User already exists' }, 400)
        }

        // 4. Create user — no password needed anymore
        const user = await createUser({
            first_name: firstName,
            last_name: lastName,
            phone,
            firebase_uid: decoded.uid,
        })

        return NextResponse.json({ success: true, user }, { status: 201 })
    } catch (error) {
        console.error('Signup error:', error)
        return apiResponse({ error: 'Internal server error' }, 500)
    }
}