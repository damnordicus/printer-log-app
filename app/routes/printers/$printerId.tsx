import { useState } from "react";
import { Form, Link, redirect } from "react-router";
import type { Route } from "./+types/$printerId";
import { Header } from "~/components/layout/Header";
import { MaintenanceList } from "~/components/maintenance/MaintenanceList";
import { ErrorList } from "~/components/errors/ErrorList";
import { Button } from "~/components/ui/Button";
<<<<<<< HEAD
import { Input } from "~/components/ui/Input";
import {
  getPrinterById,
  getMaintenanceForPrinter,
  updatePrinter,
=======
import {
  getPrinterById,
  getMaintenanceForPrinter,
  getErrorsForPrinter,
  resolveErrorLog,
>>>>>>> ceaae12 (added error reporting ability)
} from "~/lib/data.server";

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

  const [maintenanceActions, errorLogs] = await Promise.all([
    getMaintenanceForPrinter(params.printerId),
    getErrorsForPrinter(params.printerId),
  ]);

  return { printer, maintenanceActions, errorLogs };
}

<<<<<<< HEAD
export async function action({ params, request }: Route.ActionArgs) {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const model = formData.get("model") as string;
  const serialNumber = (formData.get("serialNumber") as string) || undefined;
  const purchaseDate = (formData.get("purchaseDate") as string) || undefined;
  const notes = (formData.get("notes") as string) || undefined;

  if (!name || !model) {
    return { error: "Name and model are required." };
  }

  await updatePrinter(params.printerId, {
    name,
    model,
    serialNumber,
    purchaseDate,
    notes,
  });

  return redirect(`/printers/${params.printerId}`);
}

export default function PrinterDetail({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { printer, maintenanceActions } = loaderData;
  const [editing, setEditing] = useState(false);
=======
export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "resolve-error") {
    const errorId = formData.get("errorId");
    if (errorId && typeof errorId === "string") {
      await resolveErrorLog(params.printerId, errorId);
    }
  }

  return { ok: true };
}

const statusConfig = {
  online: { label: "Online", dot: "bg-green-500", text: "text-green-700", bg: "bg-green-50" },
  error: { label: "Error", dot: "bg-red-500", text: "text-red-700", bg: "bg-red-50" },
  offline: { label: "Offline", dot: "bg-gray-400", text: "text-gray-600", bg: "bg-gray-50" },
};

export default function PrinterDetail({ loaderData }: Route.ComponentProps) {
  const { printer, maintenanceActions, errorLogs } = loaderData;
  const status = statusConfig[printer.status] || statusConfig.online;
>>>>>>> ceaae12 (added error reporting ability)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Printer info header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
<<<<<<< HEAD
          {editing ? (
            <Form method="post" className="space-y-4">
              {actionData?.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {actionData.error}
                </div>
              )}

              <Input
                label="Printer Name"
                name="name"
                defaultValue={printer.name}
                required
              />
              <Input
                label="Model"
                name="model"
                defaultValue={printer.model}
                required
              />
              <Input
                label="Serial Number"
                name="serialNumber"
                defaultValue={printer.serialNumber ?? ""}
              />
              <Input
                label="Purchase Date"
                name="purchaseDate"
                type="date"
                defaultValue={printer.purchaseDate ?? ""}
              />
              <div className="space-y-1">
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700"
                >
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  defaultValue={printer.notes ?? ""}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-prusa-500 focus:border-prusa-500 transition-colors"
                  placeholder="Any additional notes about this printer..."
                />
=======
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
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold text-gray-900">{printer.name}</h1>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium ${status.bg} ${status.text}`}>
                    <span className={`w-2 h-2 rounded-full ${status.dot}`} />
                    {status.label}
                  </span>
                </div>
                <p className="text-gray-600 text-lg">{printer.model}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to={`/printers/${printer.id}/edit`}>
                  <Button variant="secondary" size="sm">Edit Printer</Button>
                </Link>
                <Link to={`/printers/${printer.id}/error/new`}>
                  <Button variant="danger" size="sm">Log Error</Button>
                </Link>
                <Link to={`/printers/${printer.id}/maintenance/new`}>
                  <Button size="sm">Log Maintenance</Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
            {printer.serialNumber && (
              <div>
                <p className="text-sm text-gray-500">Serial Number</p>
                <p className="font-medium text-gray-900">{printer.serialNumber}</p>
>>>>>>> ceaae12 (added error reporting ability)
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit">Save Changes</Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          ) : (
            <>
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
                  <h1 className="text-2xl font-bold text-gray-900">
                    {printer.name}
                  </h1>
                  <p className="text-gray-600 text-lg">{printer.model}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setEditing(true)}
                  >
                    Edit
                  </Button>
                  <Link to={`/printers/${printer.id}/maintenance/new`}>
                    <Button>Log Maintenance</Button>
                  </Link>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                {printer.serialNumber && (
                  <div>
                    <p className="text-sm text-gray-500">Serial Number</p>
                    <p className="font-medium text-gray-900">
                      {printer.serialNumber}
                    </p>
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
                  <p className="text-sm text-gray-500">
                    Total Maintenance Logs
                  </p>
                  <p className="font-medium text-gray-900">
                    {maintenanceActions.length}
                  </p>
                </div>
              </div>

              {printer.notes && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="text-gray-700 mt-1">{printer.notes}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Error log */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Error Log</h2>
        </div>

        <div className="mb-8">
          <ErrorList errors={errorLogs} />
        </div>

        {/* Maintenance history */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Maintenance History
          </h2>
        </div>

        <MaintenanceList actions={maintenanceActions} />
      </main>
    </div>
  );
}
