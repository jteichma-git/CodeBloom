import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth as useClerkAuth,
  useUser,
} from "@clerk/clerk-react";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import {
  Authenticated,
  ConvexReactClient,
  Unauthenticated,
  useMutation,
} from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useEffect, useState } from "react";
import { Moon, Sun, MessageSquare } from "lucide-react";
import { api } from "../../convex/_generated/api";
import { Link } from "@tanstack/react-router";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  convexClient: ConvexReactClient;
}>()({
  component: RootComponent,
});

function RootComponent() {
  const { queryClient, convexClient: convex } = Route.useRouteContext();
  const [theme, setTheme] = useState<"light" | "forest">(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "light" || savedTheme === "forest") {
        return savedTheme;
      }
      // Clear invalid theme from localStorage
      localStorage.removeItem("theme");
    }
    return "light";
  });

  useEffect(() => {
    console.log(`Setting theme to: ${theme}`);
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "forest" : "light";
    console.log(`Switching theme from ${theme} to ${newTheme}`);
    setTheme(newTheme);
  };

  return (
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      afterSignOutUrl="/"
    >
      <ConvexProviderWithClerk client={convex} useAuth={useClerkAuth}>
        <QueryClientProvider client={queryClient}>
          <div className="min-h-screen flex flex-col">
            <Authenticated>
              <EnsureUser />
              <header className="navbar bg-base-100 shadow-sm border-b border-base-300">
                <div className="container mx-auto flex justify-between w-full">
                  <div className="navbar-start">
                    <Link to="/" className="font-semibold">MATS Social App</Link>
                  </div>
                  <div className="navbar-center">
                    <nav className="menu menu-horizontal">
                      <Link 
                        to="/slack" 
                        className="btn btn-ghost btn-sm"
                        activeProps={{
                          className: "btn-active"
                        }}
                      >
                        <MessageSquare className="w-4 h-4" />
                        Slack Bot
                      </Link>
                    </nav>
                  </div>
                  <div className="navbar-end gap-2">
                    <button 
                      onClick={toggleTheme}
                      className="btn btn-ghost btn-sm btn-square"
                      aria-label="Toggle theme"
                    >
                      {theme === "light" ? (
                        <Moon className="w-4 h-4" />
                      ) : (
                        <Sun className="w-4 h-4" />
                      )}
                    </button>
                    <UserButton />
                  </div>
                </div>
              </header>
              <Outlet />
            </Authenticated>
            <Unauthenticated>
              <header className="navbar bg-base-100 shadow-sm border-b border-base-300">
                <div className="container mx-auto flex justify-between w-full">
                  <div className="navbar-start">
                    <h1 className="font-semibold">MATS Social App</h1>
                  </div>
                  <div className="navbar-end gap-2">
                    <button 
                      onClick={toggleTheme}
                      className="btn btn-ghost btn-sm btn-square"
                      aria-label="Toggle theme"
                    >
                      {theme === "light" ? (
                        <Moon className="w-4 h-4" />
                      ) : (
                        <Sun className="w-4 h-4" />
                      )}
                    </button>
                    <SignInButton mode="modal">
                      <button className="btn btn-primary btn-sm">
                        Sign in
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="btn btn-ghost btn-sm">
                        Sign up
                      </button>
                    </SignUpButton>
                  </div>
                </div>
              </header>
              <main className="flex-1 container mx-auto p-4 prose prose-invert max-w-none">
                <Outlet />
              </main>
              <footer className="footer footer-center p-4 text-base-content">
                <p>© {new Date().getFullYear()} MATS Social App</p>
              </footer>
            </Unauthenticated>
          </div>
          {import.meta.env.DEV && <TanStackRouterDevtools />}
        </QueryClientProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

function EnsureUser() {
  const { isLoaded, isSignedIn, user } = useUser();
  const ensureUser = useMutation(api.users.ensureUser);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      void ensureUser();
    }
  }, [isLoaded, isSignedIn, user, ensureUser]);

  return null;
}
