import type { MaintenanceAction } from "~/types";

interface MaintenanceListProps {
  actions: MaintenanceAction[];
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

const categoryLabels: Record<string, string> = {
  cleaning: "Cleaning",
  lubrication: "Lubrication",
  calibration: "Calibration",
  repair: "Repair",
  upgrade: "Upgrade",
  inspection: "Inspection",
  other: "Other",
};

export function MaintenanceList({ actions }: MaintenanceListProps) {
  if (actions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">No maintenance actions logged yet.</p>
        <p className="text-sm text-gray-400 mt-1">
          Click "Log Maintenance" to add the first entry.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
      {actions.map((action) => (
        <div key={action.id} className="p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-medium text-gray-900">{action.description}</p>
                {action.category && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      categoryColors[action.category] || categoryColors.other
                    }`}
                  >
                    {categoryLabels[action.category] || action.category}
                  </span>
                )}
              </div>
              {action.notes && (
                <p className="text-sm text-gray-600 mt-1">{action.notes}</p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                By {action.performedBy}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-medium text-gray-900">
                {new Date(action.performedAt).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(action.performedAt).toLocaleDateString(undefined, {
                  weekday: "short",
                })}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
