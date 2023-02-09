import React from "react";
import { Navigate, Route } from "react-router-dom";
import { checkPath } from "@/utils/helpers/convert.helper";

export default interface IRoute {
  path: string;
  name: string;
  key: string;
  component?: any;
  children?: IRoute[];
  hidden?: boolean;
  icon?: any;
  redirect?: string;
}

export const createRoute = (route: IRoute, parent: string = "/"): any => {
  const realPath = checkPath(`${parent}${route.path}`);
  if (route.children && route.children.length > 0) {
    return (
      <Route path={realPath} key={realPath}>
        <Route index element={route.component ? <route.component /> : null} />
        {route?.children?.map((iRoute) => createRoute(iRoute, realPath))}
      </Route>
    );
  }

  if (route.path && route.redirect && !route.component) {
    return (
      <Route
        key={route.path}
        path={route.path}
        element={<Navigate to={route.redirect} replace />}
      />
    );
  }

  return (
    <Route
      key={realPath}
      path={realPath}
      element={route.component ? <route.component /> : null}
    />
  );
};

export const createProtectedRoute = (
  route: IRoute,
  parent: string = "/",
  isLogin: boolean
): any => {
  console.log('route', route)
  if (!isLogin) {
    return (
      <Route
        key="loginPath"
        path="*"
        element={<Navigate to="/login" replace />}
      />
    );
  }

  return createRoute(route, parent);
};

export const createUnauthenRoute = (
  route: IRoute,
  parent: string = "/",
  isLogin: boolean
): any => {
  if (!isLogin) {
    return createRoute(route, parent);
  }
};
