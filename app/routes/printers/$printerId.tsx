import { Link } from "react-router";
import type { Route } from "./+types/$printerId";
import { Header } from "~/components/layout/Header";
import { MaintenanceList } from "~/components/maintenance/MaintenanceList";
import { Button } from "~/components/ui/Button";
import { getPrinterById, getMaintenanceForPrinter } from "~/lib/data.server";

export function meta({ data }: Route.MetaArgs) {
  if (!data?.printer) {
    return [{ title: "Printer Not Found - Printer Maintenance Log" }];
  }
  return [{ title: `${data.printer.name} - Printer Maintenance Log` }];
}

export async function loader({ params }: Route.LoaderArgs) {
  const printer = await getPrinterById(params.printerId);
  if (!printer) {
    throw new Response("Printer not found", { status: 404 });
  }

  const maintenanceActions = await getMaintenanceForPrinter(params.printerId);

  return { printer, maintenanceActions };
}

export default function PrinterDetail({ loaderData }: Route.ComponentProps) {
  const { printer, maintenanceActions } = loaderData;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Printer info header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <Link
                to="/"
                className="text-sm text-gray-500 hover:text-prusa-600 mb-2 inline-flex items-center gap-1"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">{printer.name}</h1>
              <p className="text-gray-600 text-lg">{printer.model}</p>
            </div>
            <Link to={`/printers/${printer.id}/maintenance/new`}>
              <Button>Log Maintenance</Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
            {printer.serialNumber && (
              <div>
                <p className="text-sm text-gray-500">Serial Number</p>
                <p className="font-medium text-gray-900">{printer.serialNumber}</p>
              </div>
            )}
            {printer.purchaseDate && (
              <div>
                <p className="text-sm text-gray-500">Purchase Date</p>
                <p className="font-medium text-gray-900">
                  {new Date(printer.purchaseDate).toLocaleDateString()}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Total Maintenance Logs</p>
              <p className="font-medium text-gray-900">{maintenanceActions.length}</p>
            </div>
          </div>

          {printer.notes && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">Notes</p>
              <p className="text-gray-700 mt-1">{printer.notes}</p>
            </div>
          )}
        </div>

        {/* Maintenance history */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Maintenance History</h2>
        </div>

        <MaintenanceList actions={maintenanceActions} />
      </main>
    </div>
  );
}
