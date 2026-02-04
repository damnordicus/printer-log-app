import { Link } from "react-router";
import type { PrinterWithLastMaintenance } from "~/types";

interface PrinterCardProps {
  printer: PrinterWithLastMaintenance;
}

export function PrinterCard({ printer }: PrinterCardProps) {
  return (
    <Link
      to={`/printers/${printer.id}`}
      className="block bg-white rounded-xl border border-gray-200 p-6 hover:border-prusa-500 hover:shadow-lg transition-all group"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-prusa-600 transition-colors">
            {printer.name}
          </h3>
          <p className="text-gray-600">{printer.model}</p>
        </div>
        <div className="bg-prusa-100 text-prusa-700 px-3 py-1 rounded-full text-sm font-medium">
          {printer.totalMaintenanceCount} {printer.totalMaintenanceCount === 1 ? "log" : "logs"}
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
