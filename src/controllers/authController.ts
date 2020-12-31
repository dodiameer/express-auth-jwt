import express, { Request } from "express";
import authorizedRoute from "../middleware/authorizedRoute";
import generateToken from "../utils/generateToken";
import verifyToken from "../utils/verifyToken";

const authController = express.Router()

const users = [
  {
    username: "user1",
    password: "user1p"
  },
  {
    username: "user2",
    password: "user2p"
  },
  {
    username: "user3",
    password: "user3p"
  },
  {
    username: "user4",
    password: "user4p"
  }
]

authController.post("/login", (req: Request<{}, {}, { username: string, password: string }>, res) => {
  const user = users.find(user => user.username === req.body.username && user.password === req.body.password)
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid username or password" })
  }
  const claims = { username: user.username }
  return res.status(200).json({ success: true, token: generateToken(claims) })
})

authController.post("/refresh", authorizedRoute({ignoreExpiredTokens: true}), (req, res) => {
  console.log(req.signedCookies)
  console.log(req.cookies)
  const refreshToken = req.cookies["refresh-token"]
  if (!refreshToken || !verifyToken(refreshToken, true)) {
    return res.status(400).json({ success: false, message: "Invalid refresh token" })
  }
  //@ts-ignore
  const claims = { username: req.user.username}
  const { auth } = generateToken(claims)
  return res.json({ success: true, token: { auth } })
})


export default authController