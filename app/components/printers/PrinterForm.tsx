import { Form, Link } from "react-router";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";

interface PrinterFormProps {
  error?: string;
}

export function PrinterForm({ error }: PrinterFormProps) {
  return (
    <Form method="post" className="space-y-6 bg-white p-6 rounded-xl border border-gray-200">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <Input
        label="Printer Name"
        name="name"
        placeholder="e.g., Prusa MK4 #1"
        required
      />

      <Input
        label="Model"
        name="model"
        placeholder="e.g., Prusa MK4, Prusa Mini+"
        required
      />

      <Input
        label="Serial Number"
        name="serialNumber"
        placeholder="Optional"
      />

      <Input
        label="Purchase Date"
        name="purchaseDate"
        type="date"
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
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-prusa-500 focus:border-prusa-500 transition-colors"
          placeholder="Any additional notes about this printer..."
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          Add Printer
        </Button>
        <Link to="/">
          <Button type="button" variant="secondary">
            Cancel
          </Button>
        </Link>
      </div>
    </Form>
  );
}
