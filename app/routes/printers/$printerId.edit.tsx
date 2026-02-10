import { redirect } from "react-router";
import type { Route } from "./+types/$printerId.edit";
import { Header } from "~/components/layout/Header";
import { PrinterForm } from "~/components/printers/PrinterForm";
import { getPrinterById, updatePrinter } from "~/lib/data.server";
import type { PrinterStatus } from "~/types";

export function meta({ data }: Route.MetaArgs) {
  if (!data?.printer) {
    return [{ title: "Printer Not Found - Printer Maintenance Log" }];
  }
  return [{ title: `Edit ${data.printer.name} - Printer Maintenance Log` }];
}

export async function loader({ params }: Route.LoaderArgs) {
  const printer = await getPrinterById(params.printerId);
  if (!printer) {
    throw new Response("Printer not found", { status: 404 });
  }

  return { printer };
}

const validStatuses = ["online", "error", "offline"];

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();

  const name = formData.get("name");
  const model = formData.get("model");
  const serialNumber = formData.get("serialNumber");
  const purchaseDate = formData.get("purchaseDate");
  const notes = formData.get("notes");
  const status = formData.get("status");

  if (!name || typeof name !== "string" || !name.trim()) {
    return { error: "Printer name is required" };
  }

  if (!model || typeof model !== "string" || !model.trim()) {
    return { error: "Printer model is required" };
  }

  await updatePrinter(params.printerId, {
    name: name.trim(),
    model: model.trim(),
    serialNumber: serialNumber && typeof serialNumber === "string" ? serialNumber.trim() || undefined : undefined,
    purchaseDate: purchaseDate && typeof purchaseDate === "string" ? purchaseDate || undefined : undefined,
    notes: notes && typeof notes === "string" ? notes.trim() || undefined : undefined,
    status:
      status && typeof status === "string" && validStatuses.includes(status)
        ? (status as PrinterStatus)
        : undefined,
  });

  return redirect(`/printers/${params.printerId}`);
}

export default function EditPrinter({ loaderData, actionData }: Route.ComponentProps) {
  const { printer } = loaderData;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Printer</h1>
        <PrinterForm printer={printer} error={actionData?.error} />
      </main>
    </div>
  );
}
