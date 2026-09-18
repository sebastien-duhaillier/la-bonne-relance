import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const authPages = [
  "/connexion",
  "/inscription",
  "/mot-de-passe-oublie",
];

function isPublicRoute(pathname: string) {
  const isAuthPage = authPages.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`),
  );

  const isAuthCallback = pathname.startsWith("/auth/");

  return isAuthPage || isAuthCallback;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          supabaseResponse = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(
            ({ name, value, options }) => {
              supabaseResponse.cookies.set(
                name,
                value,
                options,
              );
            },
          );
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();

  const isAuthenticated = Boolean(data?.claims);
  const pathname = request.nextUrl.pathname;

  if (!isAuthenticated && !isPublicRoute(pathname)) {
    const redirectUrl = request.nextUrl.clone();

    redirectUrl.pathname = "/connexion";
    redirectUrl.search = "";

    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthenticated && authPages.includes(pathname)) {
    const redirectUrl = request.nextUrl.clone();

    redirectUrl.pathname = "/";
    redirectUrl.search = "";

    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}