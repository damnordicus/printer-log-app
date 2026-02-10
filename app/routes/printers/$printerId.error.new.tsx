import { redirect } from "react-router";
import type { Route } from "./+types/$printerId.error.new";
import { Header } from "~/components/layout/Header";
import { ErrorForm } from "~/components/errors/ErrorForm";
import { getPrinterById, createErrorLog } from "~/lib/data.server";
import type { ErrorSeverity } from "~/types";

export function meta({ data }: Route.MetaArgs) {
  if (!data?.printer) {
    return [{ title: "Printer Not Found - Printer Maintenance Log" }];
  }
  return [{ title: `Log Error - ${data.printer.name}` }];
}

export async function loader({ params }: Route.LoaderArgs) {
  const printer = await getPrinterById(params.printerId);
  if (!printer) {
    throw new Response("Printer not found", { status: 404 });
  }

  return { printer };
}

const validSeverities = ["low", "medium", "high", "critical"];

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();

  const description = formData.get("description");
  const reportedBy = formData.get("reportedBy");
  const reportedAt = formData.get("reportedAt");
  const severity = formData.get("severity");
  const notes = formData.get("notes");

  if (!description || typeof description !== "string" || !description.trim()) {
    return { error: "Error description is required" };
  }

  if (!reportedBy || typeof reportedBy !== "string" || !reportedBy.trim()) {
    return { error: "Reporter name is required" };
  }

  if (!reportedAt || typeof reportedAt !== "string") {
    return { error: "Date is required" };
  }

  await createErrorLog({
    printerId: params.printerId,
    description: description.trim(),
    reportedBy: reportedBy.trim(),
    reportedAt,
    severity:
      severity && typeof severity === "string" && validSeverities.includes(severity)
        ? (severity as ErrorSeverity)
        : undefined,
    notes: notes && typeof notes === "string" ? notes.trim() || undefined : undefined,
  });

  return redirect(`/printers/${params.printerId}`);
}

export default function NewError({ loaderData, actionData }: Route.ComponentProps) {
  const { printer } = loaderData;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Log Error</h1>
        <p className="text-gray-600 mb-6">
          For <span className="font-medium text-gray-900">{printer.name}</span>
        </p>
        <ErrorForm printerId={printer.id} error={actionData?.error} />
      </main>
    </div>
  );
}
