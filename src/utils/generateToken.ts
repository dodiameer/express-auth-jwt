import jwt from "jsonwebtoken"

export default function generateToken(user: object, expiresIn: string = "15m") {
  return jwt.sign(user, process.env.AUTH_TOKEN_SECRET as string, { expiresIn })
}