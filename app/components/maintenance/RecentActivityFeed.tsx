import { Link } from "react-router";
import type { RecentActivity } from "~/types";

interface RecentActivityFeedProps {
  activities: RecentActivity[];
}

const categoryColors: Record<string, string> = {
  cleaning: "bg-blue-100 text-blue-700",
  lubrication: "bg-yellow-100 text-yellow-700",
  calibration: "bg-purple-100 text-purple-700",
  repair: "bg-red-100 text-red-700",
  upgrade: "bg-green-100 text-green-700",
  inspection: "bg-gray-100 text-gray-700",
  other: "bg-gray-100 text-gray-700",
};

export function RecentActivityFeed({ activities }: RecentActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">No maintenance activity yet.</p>
        <p className="text-sm text-gray-400 mt-1">
          Activity will appear here when you log maintenance on your printers.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
      {activities.map(({ action, printer }) => (
        <Link
          key={action.id}
          to={`/printers/${printer.id}`}
          className="block p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-prusa-600 font-medium">{printer.name}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-700">{action.description}</span>
                {action.category && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      categoryColors[action.category] || categoryColors.other
                    }`}
                  >
                    {action.category}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                By {action.performedBy}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm text-gray-600">
                {new Date(action.performedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
