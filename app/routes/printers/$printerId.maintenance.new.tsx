import { redirect } from "react-router";
import type { Route } from "./+types/$printerId.maintenance.new";
import { Header } from "~/components/layout/Header";
import { MaintenanceForm } from "~/components/maintenance/MaintenanceForm";
import { getPrinterById, createMaintenanceAction } from "~/lib/data.server";
import type { MaintenanceCategory } from "~/types";

export function meta({ data }: Route.MetaArgs) {
  if (!data?.printer) {
    return [{ title: "Printer Not Found - Printer Maintenance Log" }];
  }
  return [{ title: `Log Maintenance - ${data.printer.name}` }];
}

export async function loader({ params }: Route.LoaderArgs) {
  const printer = await getPrinterById(params.printerId);
  if (!printer) {
    throw new Response("Printer not found", { status: 404 });
  }

  return { printer };
}

const validCategories = [
  "cleaning",
  "lubrication",
  "calibration",
  "repair",
  "upgrade",
  "inspection",
  "other",
];

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();

  const description = formData.get("description");
  const performedBy = formData.get("performedBy");
  const performedAt = formData.get("performedAt");
  const category = formData.get("category");
  const notes = formData.get("notes");

  if (!description || typeof description !== "string" || !description.trim()) {
    return { error: "Description is required" };
  }

  if (!performedBy || typeof performedBy !== "string" || !performedBy.trim()) {
    return { error: "Performer name is required" };
  }

  if (!performedAt || typeof performedAt !== "string") {
    return { error: "Date is required" };
  }

  await createMaintenanceAction({
    printerId: params.printerId,
    description: description.trim(),
    performedBy: performedBy.trim(),
    performedAt,
    category:
      category && typeof category === "string" && validCategories.includes(category)
        ? (category as MaintenanceCategory)
        : undefined,
    notes: notes && typeof notes === "string" ? notes.trim() || undefined : undefined,
  });

  return redirect(`/printers/${params.printerId}`);
}

export default function NewMaintenance({ loaderData, actionData }: Route.ComponentProps) {
  const { printer } = loaderData;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Log Maintenance</h1>
        <p className="text-gray-600 mb-6">
          For <span className="font-medium text-gray-900">{printer.name}</span>
        </p>
        <MaintenanceForm printerId={printer.id} error={actionData?.error} />
      </main>
    </div>
  );
}
