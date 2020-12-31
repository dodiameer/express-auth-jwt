import dotenv from "dotenv"
import express, { Request } from "express";
import authorizedRoute from "./middleware/authorizedRoute";
import generateToken from "./utils/generateToken";
import cookieParser from "cookie-parser"
import verifyToken from "./utils/verifyToken";
const app = express();

dotenv.config()

app.use(express.json())
app.use(cookieParser(process.env.COOKIE_SECRET))

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

app.get("/", (_req, res) => {
  return res.send("Welcome to public area");
});

app.get("/private", authorizedRoute(), (req, res) => {
  console.log("Private area accessed by member:")
  //@ts-ignore
  console.log(req.user)
  //@ts-ignore
  return res.send(`Welcome to private area, ${req.user.username}`);
});

app.post("/login", (req: Request<{}, {}, { username: string, password: string }>, res) => {
  const user = users.find(user => user.username === req.body.username && user.password === req.body.password)
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid username or password" })
  }
  const claims = { username: user.username }
  return res.status(200).json({ success: true, token: generateToken(claims) })
})

app.post("/refresh", authorizedRoute({ignoreExpiredTokens: true}), (req, res) => {
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

app.listen(process.env.PORT, () =>
  console.log(`Started server on http://localhost:${process.env.PORT}`)
);
