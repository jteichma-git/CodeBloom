import { SignInButton } from "@clerk/clerk-react";
import { convexQuery } from "@convex-dev/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Authenticated, Unauthenticated } from "convex/react";
import { Brain } from "lucide-react";
import { api } from "../../convex/_generated/api";
import { SuccessStrategiesApp } from "../components/MindToolsApp";

const strategiesQueryOptions = convexQuery(api.strategies.list, {});

export const Route = createFileRoute("/")({
  loader: async ({ context: { queryClient } }) =>
    await queryClient.ensureQueryData(strategiesQueryOptions),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen bg-base-200">
      <Unauthenticated>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Brain className="w-12 h-12 text-indigo-600" />
              <h1 className="text-4xl font-bold text-gray-800">Success Strategies</h1>
            </div>
            <p className="text-gray-600 text-lg mb-6">
              Research-backed cognitive strategies for wellbeing
            </p>
            <p className="text-gray-500 max-w-md mx-auto">
              Discover bite-sized strategies to improve your focus, calm, energy, and mood. Sign in to track your progress and personalize your experience.
            </p>
          </div>
          
          <div className="not-prose">
            <SignInButton mode="modal">
              <button className="btn btn-primary btn-lg">Get Started</button>
            </SignInButton>
          </div>
        </div>
      </Unauthenticated>

      <Authenticated>
        <SuccessStrategiesApp />
      </Authenticated>
    </div>
  );
}
