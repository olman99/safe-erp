import { Request, Response } from "express";
import { Controller, Get, Post, Put } from "../utils/decorators";
import { ILogger } from "../libs/logger";
import { inject, injectable } from "inversify";
import { ITYPES } from "../utils/types";

@injectable()
@Controller("/auth")
class AuthController {
  private _logger: ILogger;
  constructor(@inject(ITYPES.ILogger) logger: ILogger) {
    this._logger = logger;
  }

  @Post("/login")
  public login(_req: Request, res: Response) {
    res.send("Log In!!!");
  }

  @Put("/logout")
  public logout(_req: Request, _res: Response) {}

  @Get("/ping")
  public ping(_req: Request, res: Response) {
    this._logger.info("Here");
    res.send("pong");
  }
}

export default AuthController;
