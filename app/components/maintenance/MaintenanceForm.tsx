import { Form, Link } from "react-router";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Select } from "~/components/ui/Select";

interface MaintenanceFormProps {
  printerId: string;
  error?: string;
}

const categoryOptions = [
  { value: "", label: "Select category (optional)" },
  { value: "cleaning", label: "Cleaning" },
  { value: "lubrication", label: "Lubrication" },
  { value: "calibration", label: "Calibration" },
  { value: "repair", label: "Repair" },
  { value: "upgrade", label: "Upgrade" },
  { value: "inspection", label: "Inspection" },
  { value: "other", label: "Other" },
];

export function MaintenanceForm({ printerId, error }: MaintenanceFormProps) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <Form method="post" className="space-y-6 bg-white p-6 rounded-xl border border-gray-200">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <Input
        label="What was done?"
        name="description"
        placeholder="e.g., Replaced nozzle, cleaned heatbed, tightened belts"
        required
      />

      <Input
        label="Performed by"
        name="performedBy"
        placeholder="Your name"
        required
      />

      <Input
        label="Date"
        name="performedAt"
        type="date"
        defaultValue={today}
        required
      />

      <Select
        label="Category"
        name="category"
        options={categoryOptions}
      />

      <div className="space-y-1">
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700"
        >
          Additional Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-prusa-500 focus:border-prusa-500 transition-colors"
          placeholder="Any additional details..."
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          Log Maintenance
        </Button>
        <Link to={`/printers/${printerId}`}>
          <Button type="button" variant="secondary">
            Cancel
          </Button>
        </Link>
      </div>
    </Form>
  );
}
