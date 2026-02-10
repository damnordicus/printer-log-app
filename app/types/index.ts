// Printer status
export type PrinterStatus = "online" | "error" | "offline";

// Printer model
export interface Printer {
  id: string;
  name: string;
  model: string;
  serialNumber?: string;
  purchaseDate?: string;
  notes?: string;
  status: PrinterStatus;
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

// Error severity
export type ErrorSeverity = "low" | "medium" | "high" | "critical";

// Error log model
export interface ErrorLog {
  id: string;
  printerId: string;
  description: string;
  reportedBy: string;
  reportedAt: string;
  severity?: ErrorSeverity;
  resolved: boolean;
  resolvedAt?: string;
  notes?: string;
  createdAt: string;
}

// Dashboard types
export interface RecentActivity {
  type: "maintenance" | "error";
  printer: Printer;
  action?: MaintenanceAction;
  errorLog?: ErrorLog;
}

export interface PrinterWithLastMaintenance extends Printer {
  lastMaintenance?: MaintenanceAction;
  totalMaintenanceCount: number;
  activeErrorCount: number;
}
