import dotenv from "dotenv"
import express, { Request } from "express";
import authorizedRoute from "./middleware/authorizedRoute";
import generateToken from "./utils/generateToken";
const app = express();

dotenv.config()

app.use(express.json())

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

app.get("/private", authorizedRoute, (req, res) => {
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
  return res.status(200).json({ success: true, token: generateToken(user) })
})

app.listen(process.env.PORT, () =>
  console.log(`Started server on http://localhost:${process.env.PORT}`)
);
