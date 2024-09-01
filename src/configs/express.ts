import express, { Express } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { RootController } from "../controllers";
import { EnvConfig } from "./environment";

export class Application {
    private static app: Express = undefined;

    private static middlewares(): void {
        this.app = express();
        this.app.use(cors()); 
        this.app.use(bodyParser.text({ type: [ "text/xml", 'application/xml'] }))
        this.app.use(bodyParser.urlencoded({ extended: true, limit: "500mb" }));
        this.app.use(bodyParser.json({ limit: "500mb" }));
        this.app.use(cookieParser());
        this.app.use(morgan("combined"));
        this.app.set("trust proxy", true);
        this.app.use("/api", RootController);
        this.app.get('/', (req, res) => {
            console.log({"status":"Running","project":"Practice","port":EnvConfig.server.port})
            res.send({"status":"Running","project":"Practice","port":EnvConfig.server.port})
        })

        // if (EnvConfig.server.environment != "PROD") {
            this.app.use("/swagger", swaggerUi.serve, swaggerUi.setup(require("../../json/swagger.json")));
        // }
    }

    public static init(): Express {
        this.middlewares();
        console.log("============Initialize Express Middlewares============")
        return this.app;
    }
}
