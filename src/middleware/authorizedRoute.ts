import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

export default function authorizedRoute(req: Request, res: Response, next: NextFunction) {
  const header = req.header("authorization")
  const token = header?.split("Bearer ")[1] ?? null
  if (token === null) {
    return res.sendStatus(401)
  }
  jwt.verify(token, process.env.AUTH_TOKEN_SECRET as string, (err, user) => {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).send("Token expired")
    }
    else if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).send("Invalid token")
    }
    //@ts-ignore
    req.user = user
    return next()
  })
}