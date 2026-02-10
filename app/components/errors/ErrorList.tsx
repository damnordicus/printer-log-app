import { Form } from "react-router";
import type { ErrorLog } from "~/types";
import { Button } from "~/components/ui/Button";

interface ErrorListProps {
  errors: ErrorLog[];
}

const severityColors: Record<string, string> = {
  low: "bg-yellow-100 text-yellow-700",
  medium: "bg-orange-100 text-orange-700",
  high: "bg-red-100 text-red-700",
  critical: "bg-red-200 text-red-900",
};

const severityLabels: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export function ErrorList({ errors }: ErrorListProps) {
  if (errors.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">No errors logged yet.</p>
        <p className="text-sm text-gray-400 mt-1">
          Click "Log Error" to report an issue with this printer.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
      {errors.map((error) => (
        <div key={error.id} className="p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-medium text-gray-900">{error.description}</p>
                {error.severity && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      severityColors[error.severity] || severityColors.low
                    }`}
                  >
                    {severityLabels[error.severity] || error.severity}
                  </span>
                )}
                {error.resolved ? (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    Resolved
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                    Unresolved
                  </span>
                )}
              </div>
              {error.notes && (
                <p className="text-sm text-gray-600 mt-1">{error.notes}</p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Reported by {error.reportedBy}
              </p>
              {error.resolved && error.resolvedAt && (
                <p className="text-xs text-green-600 mt-1">
                  Resolved on {new Date(error.resolvedAt).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="text-right shrink-0 flex flex-col items-end gap-2">
              <p className="text-sm font-medium text-gray-900">
                {new Date(error.reportedAt).toLocaleDateString()}
              </p>
              {!error.resolved && (
                <Form method="post">
                  <input type="hidden" name="intent" value="resolve-error" />
                  <input type="hidden" name="errorId" value={error.id} />
                  <Button type="submit" size="sm" variant="primary">
                    Resolve
                  </Button>
                </Form>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
