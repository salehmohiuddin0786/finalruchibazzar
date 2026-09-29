import { NextResponse } from "next/server";

const AUTH_ROUTES = ["/login", "/signup"];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("deliveryToken")?.value;
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  if (!token && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
