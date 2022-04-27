import express, { Application, Handler } from "express";
import { MetadataKeys, RouteDefinition, ITYPES, CTYPES } from "../utils/types";
import morgan from "morgan";
import { Container } from "inversify";
import Logger, { ILogger } from "../libs/logger";
import { AuthController } from "../controllers";

const myContainer = new Container();
myContainer.bind<ILogger>(ITYPES.ILogger).to(Logger);
myContainer.bind(CTYPES.AuthController).to(AuthController);

class App {
  private readonly _httpInstance: Application;
  private _apiControllers;
  private _publicControllers;
  private httpPort: number;

  constructor(
    httPort: number,
    apiControllers: any,
    publicControllers: any = []
  ) {
    this._httpInstance = express();
    this._apiControllers = apiControllers;
    this._publicControllers = publicControllers;
    this.httpPort = httPort;
    this.setupMiddlewares();
    this.registerApiRoutes();
    this.registerPublicRoutes();
  }

  private setupHttpMiddlewares() {
    this._httpInstance.use(morgan("dev"));
  }

  private setupMiddlewares() {
    this.setupHttpMiddlewares();
  }

  private routerFactory(path: string, controllers: any) {
    const info: Array<{ api: string; handler: string }> = [];
    controllers.forEach((ctrl: any) => {
      // const ctrlInstance: { [handleName: string]: Handler } = new ctrl() as any;
      const ctrlInstance: { [handleName: string]: Handler } = myContainer.get(
        ctrl.name
      );

      const basePath: string = Reflect.getMetadata(
        MetadataKeys.BASE_PATH,
        ctrl
      );
      const routes: RouteDefinition[] = Reflect.getMetadata(
        MetadataKeys.ROUTES,
        ctrl
      );

      const router = express.Router();

      routes.forEach(({ method, path, handlerName }) => {
        router[method](
          path,
          ctrlInstance[String(handlerName)].bind(ctrlInstance)
        );

        info.push({
          api: `${method.toLocaleUpperCase()} /api${basePath + path}`,
          handler: `${ctrl.name}.${String(handlerName)}`,
        });
      });

      this._httpInstance.use("/api" + basePath, router);
    });

    console.log(path.substring(1).toLocaleUpperCase() + " Routes");

    if (process.env.NODE_ENV != "production") {
      console.table(info);
    }
  }

  private registerApiRoutes() {
    this.routerFactory("/api", this._apiControllers);
  }

  private registerPublicRoutes() {
    this.routerFactory("/public", this._publicControllers);
  }

  public listen() {
    this._httpInstance.listen(this.httpPort, () => {
      console.log(`This server is running on port ${this.httpPort}`);
    });
  }
}

export default App;
