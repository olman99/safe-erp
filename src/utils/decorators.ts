import { MetadataKeys, Methods, RouteDefinition } from "./types";
export const Controller = (basepath: string): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata(MetadataKeys.BASE_PATH, basepath, target);
  };
};

const methodDecoratorFactory = (method: Methods) => {
  return (path: string): MethodDecorator => {
    return (target, propertyKey) => {
      const currentController = target.constructor;

      const routes: RouteDefinition[] = Reflect.hasMetadata(
        MetadataKeys.ROUTES,
        currentController
      )
        ? Reflect.getMetadata(MetadataKeys.ROUTES, currentController)
        : [];

      routes.push({ method, path, handlerName: propertyKey });

      Reflect.defineMetadata(MetadataKeys.ROUTES, routes, currentController);
    };
  };
};

export const Get = methodDecoratorFactory(Methods.GET);
export const Post = methodDecoratorFactory(Methods.POST);
export const Put = methodDecoratorFactory(Methods.PUT);
export const Delete = methodDecoratorFactory(Methods.DELETE);
export const Patch = methodDecoratorFactory(Methods.PATCH);
export const Options = methodDecoratorFactory(Methods.OPTIONS);
export const Head = methodDecoratorFactory(Methods.HEAD);
