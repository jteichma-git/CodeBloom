import { useState } from "react";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMutation } from "convex/react";
import { 
  Brain, 
  Heart, 
  Filter, 
  Star, 
  RotateCcw, 
  ArrowLeft, 
  BookOpen, 
  Calendar 
} from "lucide-react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

type FilterType = "category" | "emotion";

interface Strategy {
  _id: Id<"strategies">;
  title: string;
  description: string;
  instructions: string;
  researchSupport: "high" | "medium" | "low";
  categories: string[];
  emotions: string[];
  isActive: boolean;
  _creationTime: number;
}

interface UserLog {
  _id: Id<"userLogs">;
  userId: Id<"users">;
  strategyId: Id<"strategies">;
  rating: number;
  note?: string;
  selectedFilter?: string;
  filterType?: FilterType;
  strategyTitle: string;
  _creationTime: number;
}

const strategiesQueryOptions = convexQuery(api.strategies.list, {});
const userLogsQueryOptions = convexQuery(api.userLogs.getUserLogs, {});

export function MindToolsApp() {
  const { data: strategies } = useSuspenseQuery(strategiesQueryOptions);
  const { data: userLogs } = useSuspenseQuery(userLogsQueryOptions);
  const createLog = useMutation(api.userLogs.createLog);
  
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>("category");
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [userRating, setUserRating] = useState(0);
  const [userNote, setUserNote] = useState("");
  const [hasViewedInstructions, setHasViewedInstructions] = useState(false);
  const [currentView, setCurrentView] = useState<"main" | "log">("main");

  const categories = ["Focus", "Calm", "Energy", "Mood", "Sleep", "Stress"];
  const emotions = ["Tired", "Anxious", "Frazzled", "Sad", "Overwhelmed", "Restless"];

  // Calculate global average rating for each strategy
  const getStrategyAverageRating = (strategyId: string) => {
    const strategyLogs = userLogs.filter(log => log.strategyId === strategyId);
    if (strategyLogs.length === 0) return null;
    
    const totalRating = strategyLogs.reduce((sum, log) => sum + log.rating, 0);
    return totalRating / strategyLogs.length;
  };

  const filteredStrategies = selectedFilter
    ? strategies.filter((s) =>
        filterType === "category" ? s.categories.includes(selectedFilter) : s.emotions.includes(selectedFilter)
      )
    : strategies;

  const handleStrategySelect = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
    setIsFlipped(true);
    setHasViewedInstructions(true);
    setUserRating(0);
    setUserNote("");
  };

  const handleViewInstructions = () => {
    setIsFlipped(true);
    setHasViewedInstructions(true);
  };

  const handleBackToOverview = () => {
    setIsFlipped(false);
  };

  const handleSaveLog = async () => {
    if (!selectedStrategy || userRating === 0) return;

    try {
      await createLog({
        strategyId: selectedStrategy._id,
        rating: userRating,
        note: userNote || undefined,
        selectedFilter: selectedFilter || undefined,
        filterType,
      });

      setUserRating(0);
      setUserNote("");
      alert("Your experience has been logged!");
    } catch (error) {
      console.error("Error saving log:", error);
      alert("Failed to save log. Please try again.");
    }
  };

  const getResearchBadgeColor = (level: string) => {
    switch (level) {
      case "high":
        return "badge-success";
      case "medium":
        return "badge-warning";
      case "low":
        return "badge-error";
      default:
        return "badge-ghost";
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (currentView === "log") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <BookOpen className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-800">Your Practice Log</h1>
            </div>
            <p className="text-gray-600 text-sm">Track your cognitive strategy journey</p>
          </div>

          <button 
            className="btn btn-ghost btn-sm mb-4"
            onClick={() => setCurrentView("main")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Strategies
          </button>

          {userLogs.length === 0 ? (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <p className="text-gray-500">No practice sessions logged yet.</p>
                <p className="text-sm text-gray-400 mt-2">Try some strategies and rate your experience!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-lg">Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Sessions</p>
                      <p className="text-2xl font-bold">{userLogs.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Average Rating</p>
                      <div className="flex items-center gap-1">
                        <p className="text-2xl font-bold">
                          {(userLogs.reduce((sum, log) => sum + log.rating, 0) / userLogs.length).toFixed(1)}
                        </p>
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {userLogs
                .sort((a, b) => b._creationTime - a._creationTime)
                .map((log) => (
                  <div key={log._id} className="card bg-base-100 shadow-xl border-l-4 border-l-indigo-400">
                    <div className="card-body p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800">{log.strategyTitle}</h4>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= log.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {log.note && (
                        <p className="text-gray-600 text-sm mb-2 italic">"{log.note}"</p>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(log._creationTime)}
                        </div>
                        {log.selectedFilter && (
                          <div className="badge badge-secondary badge-sm">
                            {log.selectedFilter}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Brain className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-800">MindTools</h1>
          </div>
          <p className="text-gray-600 text-sm">Bite-sized cognitive strategies for wellbeing</p>
        </div>

        {userLogs.length > 0 && !selectedStrategy && (
          <div className="bg-base-100 rounded-lg p-3 mb-4 flex justify-between items-center text-sm">
            <span className="text-gray-600">
              {userLogs.length} strategies tried • {(userLogs.reduce((sum, log) => sum + log.rating, 0) / userLogs.length).toFixed(1)}★ avg
            </span>
            <button 
              className="btn btn-ghost btn-xs"
              onClick={() => setCurrentView("log")}
            >
              <BookOpen className="w-3 h-3 mr-1" />
              View Log
            </button>
          </div>
        )}

        <div className="flex gap-2 mb-4">
          <button
            className={`btn flex-1 ${filterType === "category" ? "btn-primary" : "btn-outline"}`}
            onClick={() => {
              setFilterType("category");
              setSelectedFilter("");
              setSelectedStrategy(null);
            }}
          >
            <Filter className="w-4 h-4 mr-1" />
            Categories
          </button>
          <button
            className={`btn flex-1 ${filterType === "emotion" ? "btn-primary" : "btn-outline"}`}
            onClick={() => {
              setFilterType("emotion");
              setSelectedFilter("");
              setSelectedStrategy(null);
            }}
          >
            <Heart className="w-4 h-4 mr-1" />
            Emotions
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6">
          {(filterType === "category" ? categories : emotions).map((item) => (
            <button
              key={item}
              className={`btn btn-sm ${selectedFilter === item ? "btn-primary" : "btn-outline"}`}
              onClick={() => {
                setSelectedFilter(selectedFilter === item ? "" : item);
                setSelectedStrategy(null);
              }}
            >
              {item}
            </button>
          ))}
        </div>

        {!selectedStrategy && (
          <div className="grid grid-cols-1 gap-3 mb-6">
            {filteredStrategies.map((strategy) => (
              <div
                key={strategy._id}
                className="card bg-base-100 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow border-l-4 border-l-indigo-400"
                onClick={() => handleStrategySelect(strategy)}
              >
                <div className="card-body p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="card-title text-sm">{strategy.title}</h3>
                    <div className="flex items-center gap-1">
                      <div className={`badge ${getResearchBadgeColor(strategy.researchSupport)} min-w-16 justify-center`}>
                        {strategy.researchSupport}
                      </div>
                      <span className="text-xs text-gray-500">Credibility</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-xs mb-2">{strategy.description}</p>
                  <div className="flex justify-between items-end">
                    <div className="flex flex-wrap gap-1">
                      {(filterType === "category" ? strategy.categories : strategy.emotions)
                        .slice(0, 2)
                        .map((tag) => (
                          <div key={tag} className="badge badge-secondary badge-xs">
                            {tag}
                          </div>
                        ))}
                    </div>
                    {(() => {
                      const avgRating = getStrategyAverageRating(strategy._id);
                      return avgRating ? (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{avgRating.toFixed(1)}</span>
                        </div>
                      ) : null;
                    })()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedStrategy && (
          <div className="mb-6">
            <button 
              className="btn btn-ghost btn-sm mb-4"
              onClick={() => setSelectedStrategy(null)}
            >
              ← Back to strategies
            </button>

            <div className="relative h-80">
              <div className="card bg-base-100 shadow-xl h-full">
                <div className="card-body h-full flex flex-col">
                  {!isFlipped ? (
                    <>
                      <div className="flex justify-between items-start mb-4">
                        <h2 className="card-title text-lg">{selectedStrategy.title}</h2>
                        <div className="flex items-center gap-1">
                          <div className={`badge ${getResearchBadgeColor(selectedStrategy.researchSupport)} min-w-16 justify-center`}>
                            {selectedStrategy.researchSupport}
                          </div>
                          <span className="text-xs text-gray-500">Credibility</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3 flex-1">{selectedStrategy.description}</p>
                      <div className="space-y-2 mb-4">
                        <div className="flex flex-wrap gap-1">
                          <span className="text-xs font-medium text-gray-500">Categories:</span>
                          {selectedStrategy.categories.map((cat) => (
                            <div key={cat} className="badge badge-secondary badge-xs">
                              {cat}
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          <span className="text-xs font-medium text-gray-500">Emotions:</span>
                          {selectedStrategy.emotions.map((emotion) => (
                            <div key={emotion} className="badge badge-outline badge-xs">
                              {emotion}
                            </div>
                          ))}
                        </div>
                      </div>
                      <button className="btn btn-primary w-full" onClick={handleViewInstructions}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Try It
                      </button>
                    </>
                  ) : (
                    <>
                      <h3 className="card-title text-lg mb-4">{selectedStrategy.title} - Instructions</h3>
                      <div className="flex-1 overflow-y-auto">
                        <p className="text-gray-700 whitespace-pre-line">{selectedStrategy.instructions}</p>
                      </div>
                      <button 
                        className="btn btn-outline w-full mt-4"
                        onClick={handleBackToOverview}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Back to Overview
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {hasViewedInstructions && (
              <div className="card bg-base-100 shadow-xl mt-6">
                <div className="card-body">
                  <h3 className="card-title text-lg mb-3">How did this help?</h3>

                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-6 h-6 cursor-pointer ${
                          star <= userRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                        onClick={() => setUserRating(star)}
                      />
                    ))}
                  </div>

                  <textarea
                    className="textarea textarea-bordered w-full mb-4"
                    placeholder="Add a note about your experience..."
                    value={userNote}
                    onChange={(e) => setUserNote(e.target.value)}
                    rows={3}
                  />

                  <button 
                    className="btn btn-primary w-full"
                    disabled={userRating === 0}
                    onClick={handleSaveLog}
                  >
                    Save to Log
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}