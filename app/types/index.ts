// Printer model
export interface Printer {
  id: string;
  name: string;
  model: string;
  serialNumber?: string;
  purchaseDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Maintenance categories
export type MaintenanceCategory =
  | "cleaning"
  | "lubrication"
  | "calibration"
  | "repair"
  | "upgrade"
  | "inspection"
  | "other";

// Maintenance action model
export interface MaintenanceAction {
  id: string;
  printerId: string;
  description: string;
  performedBy: string;
  performedAt: string;
  category?: MaintenanceCategory;
  notes?: string;
  createdAt: string;
}

// Dashboard types
export interface RecentActivity {
  action: MaintenanceAction;
  printer: Printer;
}

export interface PrinterWithLastMaintenance extends Printer {
  lastMaintenance?: MaintenanceAction;
  totalMaintenanceCount: number;
}
