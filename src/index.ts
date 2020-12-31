import dotenv from "dotenv"
import express from "express";
import authorizedRoute from "./middleware/authorizedRoute";
import cookieParser from "cookie-parser"
import authController from "./controllers/authController";
const app = express();

dotenv.config()
app.use(express.json())
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use("/api/auth", authController)

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


app.listen(process.env.PORT, () =>
  console.log(`Started server on http://localhost:${process.env.PORT}`)
);
