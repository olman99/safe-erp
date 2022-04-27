import "reflect-metadata";
require("dotenv").config();
import App from "./app/app";
import { AuthController } from "./controllers";

const app = new App(Number(process.env.PORT), [AuthController]);
app.listen();
