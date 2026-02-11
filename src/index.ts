import express from "express"
import dotenv from "dotenv"
import { rootRouter } from "./routes/route";
import cookieParser from "cookie-parser"


dotenv.config()
const app = express()

app.use(cookieParser());
const PORT = process.env.PORT || 3001;
app.use(express.json());

app.use("/api/v1" , rootRouter)

app.listen(PORT, () => {
    console.log(`Auth server running on ${PORT}`);
})