import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { queryOne } from './db'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'manga-uz-super-secret-jwt-key-2024'
)

export interface JWTPayload {
  userId: string
  username: string
  role: string
  email: string
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET)
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as unknown as JWTPayload
  } catch {
    return null
  }
}

export async function getAuthUser(): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value
    if (!token) return null
    return verifyToken(token)
  } catch {
    return null
  }
}

export async function requireAuth(): Promise<JWTPayload> {
  const user = await getAuthUser()
  if (!user) throw new Error('Unauthorized')
  return user
}

export async function requireRole(role: string): Promise<JWTPayload> {
  const user = await requireAuth()
  if (user.role !== role && user.role !== 'admin') {
    throw new Error('Forbidden')
  }
  return user
}

export function apiError(message: string, status = 400) {
  return Response.json({ error: message }, { status })
}

export function apiSuccess<T>(data: T, status = 200) {
  return Response.json(data, { status })
}
