export enum MetadataKeys {
  BASE_PATH = "base_path",
  ROUTES = "routes",
}

export enum Methods {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
  PATCH = "patch",
  OPTIONS = "options",
  HEAD = "head",
}

export interface RouteDefinition {
  method: Methods;
  path: string;
  handlerName: string | symbol;
}

export const ITYPES = {
  ILogger: Symbol.for("ILogger"),
};

export const CTYPES = {
  AuthController: "AuthController",
};

export const STYPES = {};

export const RTYPES = {};
