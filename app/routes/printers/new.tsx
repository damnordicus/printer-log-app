import { redirect } from "react-router";
import type { Route } from "./+types/new";
import { Header } from "~/components/layout/Header";
import { PrinterForm } from "~/components/printers/PrinterForm";
import { createPrinter } from "~/lib/data.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Add Printer - Printer Maintenance Log" },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const name = formData.get("name");
  const model = formData.get("model");
  const serialNumber = formData.get("serialNumber");
  const purchaseDate = formData.get("purchaseDate");
  const notes = formData.get("notes");

  if (!name || typeof name !== "string" || !name.trim()) {
    return { error: "Printer name is required" };
  }

  if (!model || typeof model !== "string" || !model.trim()) {
    return { error: "Printer model is required" };
  }

  await createPrinter({
    name: name.trim(),
    model: model.trim(),
    serialNumber: serialNumber && typeof serialNumber === "string" ? serialNumber.trim() || undefined : undefined,
    purchaseDate: purchaseDate && typeof purchaseDate === "string" ? purchaseDate || undefined : undefined,
    notes: notes && typeof notes === "string" ? notes.trim() || undefined : undefined,
  });

  return redirect("/");
}

export default function NewPrinter({ actionData }: Route.ComponentProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Printer</h1>
        <PrinterForm error={actionData?.error} />
      </main>
    </div>
  );
}
