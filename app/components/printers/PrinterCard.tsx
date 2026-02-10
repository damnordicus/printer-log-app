import { Link } from "react-router";
import type { PrinterWithLastMaintenance } from "~/types";

interface PrinterCardProps {
  printer: PrinterWithLastMaintenance;
}

const statusConfig = {
  online: { label: "Online", dot: "bg-green-500", text: "text-green-700", bg: "bg-green-50" },
  error: { label: "Error", dot: "bg-red-500", text: "text-red-700", bg: "bg-red-50" },
  offline: { label: "Offline", dot: "bg-gray-400", text: "text-gray-600", bg: "bg-gray-50" },
};

export function PrinterCard({ printer }: PrinterCardProps) {
  const status = statusConfig[printer.status] || statusConfig.online;
  const hasErrors = printer.activeErrorCount > 0;

  return (
    <Link
      to={`/printers/${printer.id}`}
      className={`block bg-white rounded-xl border p-6 hover:shadow-lg transition-all group ${
        hasErrors
          ? "border-red-300 hover:border-red-400"
          : "border-gray-200 hover:border-prusa-500"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-prusa-600 transition-colors">
              {printer.name}
            </h3>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          </div>
          <p className="text-gray-600">{printer.model}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="bg-prusa-100 text-prusa-700 px-3 py-1 rounded-full text-sm font-medium">
            {printer.totalMaintenanceCount} {printer.totalMaintenanceCount === 1 ? "log" : "logs"}
          </div>
          {hasErrors && (
            <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
              {printer.activeErrorCount} {printer.activeErrorCount === 1 ? "error" : "errors"}
            </div>
          )}
        </div>
      </div>

      {printer.serialNumber && (
        <p className="text-sm text-gray-500 mt-2">S/N: {printer.serialNumber}</p>
      )}

      {printer.lastMaintenance ? (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">Last maintenance</p>
          <p className="text-sm font-medium text-gray-900 truncate">
            {printer.lastMaintenance.description}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(printer.lastMaintenance.performedAt).toLocaleDateString()} by{" "}
            {printer.lastMaintenance.performedBy}
          </p>
        </div>
      ) : (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-400 italic">No maintenance logged yet</p>
        </div>
      )}
    </Link>
  );
}
