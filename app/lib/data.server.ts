import * as fs from "node:fs/promises";
import * as path from "node:path";
import type {
  Printer,
  PrinterStatus,
  MaintenanceAction,
  RecentActivity,
  PrinterWithLastMaintenance,
  MaintenanceCategory,
  ErrorLog,
  ErrorSeverity,
} from "~/types";

const DATA_DIR = path.join(process.cwd(), "data");
const PRINTERS_FILE = path.join(DATA_DIR, "printers.json");
const MAINTENANCE_DIR = path.join(DATA_DIR, "maintenance");
const ERRORS_DIR = path.join(DATA_DIR, "errors");

// Ensure data directories exist
async function ensureDataDirs(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(MAINTENANCE_DIR, { recursive: true });
  await fs.mkdir(ERRORS_DIR, { recursive: true });
}

// Initialize empty printers file if it doesn't exist
async function ensurePrintersFile(): Promise<void> {
  await ensureDataDirs();
  try {
    await fs.access(PRINTERS_FILE);
  } catch {
    await fs.writeFile(PRINTERS_FILE, JSON.stringify([], null, 2));
  }
}

// ============ Printer Operations ============

export async function getAllPrinters(): Promise<Printer[]> {
  await ensurePrintersFile();
  const data = await fs.readFile(PRINTERS_FILE, "utf-8");
  const printers = JSON.parse(data) as Printer[];
  // Ensure status field exists for older data
  return printers.map((p) => ({
    ...p,
    status: p.status || "online",
  }));
}

export async function getPrinterById(id: string): Promise<Printer | null> {
  const printers = await getAllPrinters();
  return printers.find((p) => p.id === id) ?? null;
}

export async function createPrinter(
  printer: Omit<Printer, "id" | "createdAt" | "updatedAt" | "status">
): Promise<Printer> {
  const printers = await getAllPrinters();
  const newPrinter: Printer = {
    ...printer,
    id: crypto.randomUUID(),
    status: "online",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  printers.push(newPrinter);
  await fs.writeFile(PRINTERS_FILE, JSON.stringify(printers, null, 2));
  return newPrinter;
}

export async function updatePrinter(
  id: string,
  updates: Partial<Omit<Printer, "id" | "createdAt">>
): Promise<Printer | null> {
  const printers = await getAllPrinters();
  const index = printers.findIndex((p) => p.id === id);
  if (index === -1) return null;

  printers[index] = {
    ...printers[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await fs.writeFile(PRINTERS_FILE, JSON.stringify(printers, null, 2));
  return printers[index];
}

export async function deletePrinter(id: string): Promise<boolean> {
  const printers = await getAllPrinters();
  const filtered = printers.filter((p) => p.id !== id);
  if (filtered.length === printers.length) return false;

  await fs.writeFile(PRINTERS_FILE, JSON.stringify(filtered, null, 2));
  // Also delete maintenance and error files
  const maintenanceFile = path.join(MAINTENANCE_DIR, `${id}.json`);
  const errorsFile = path.join(ERRORS_DIR, `${id}.json`);
  try {
    await fs.unlink(maintenanceFile);
  } catch {
    // File may not exist, that's ok
  }
  try {
    await fs.unlink(errorsFile);
  } catch {
    // File may not exist, that's ok
  }
  return true;
}

// ============ Maintenance Operations ============

function getMaintenanceFile(printerId: string): string {
  return path.join(MAINTENANCE_DIR, `${printerId}.json`);
}

export async function getMaintenanceForPrinter(
  printerId: string
): Promise<MaintenanceAction[]> {
  await ensureDataDirs();
  const file = getMaintenanceFile(printerId);
  try {
    const data = await fs.readFile(file, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function createMaintenanceAction(action: {
  printerId: string;
  description: string;
  performedBy: string;
  performedAt: string;
  category?: MaintenanceCategory;
  notes?: string;
}): Promise<MaintenanceAction> {
  const actions = await getMaintenanceForPrinter(action.printerId);
  const newAction: MaintenanceAction = {
    ...action,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  actions.push(newAction);
  // Sort by performedAt descending (most recent first)
  actions.sort(
    (a, b) =>
      new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime()
  );
  await fs.writeFile(
    getMaintenanceFile(action.printerId),
    JSON.stringify(actions, null, 2)
  );
  return newAction;
}

export async function deleteMaintenanceAction(
  printerId: string,
  actionId: string
): Promise<boolean> {
  const actions = await getMaintenanceForPrinter(printerId);
  const filtered = actions.filter((a) => a.id !== actionId);
  if (filtered.length === actions.length) return false;

  await fs.writeFile(
    getMaintenanceFile(printerId),
    JSON.stringify(filtered, null, 2)
  );
  return true;
}

// ============ Error Operations ============

function getErrorsFile(printerId: string): string {
  return path.join(ERRORS_DIR, `${printerId}.json`);
}

export async function getErrorsForPrinter(
  printerId: string
): Promise<ErrorLog[]> {
  await ensureDataDirs();
  const file = getErrorsFile(printerId);
  try {
    const data = await fs.readFile(file, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function createErrorLog(error: {
  printerId: string;
  description: string;
  reportedBy: string;
  reportedAt: string;
  severity?: ErrorSeverity;
  notes?: string;
}): Promise<ErrorLog> {
  const errors = await getErrorsForPrinter(error.printerId);
  const newError: ErrorLog = {
    ...error,
    id: crypto.randomUUID(),
    resolved: false,
    createdAt: new Date().toISOString(),
  };
  errors.push(newError);
  // Sort by reportedAt descending (most recent first)
  errors.sort(
    (a, b) =>
      new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
  );
  await fs.writeFile(
    getErrorsFile(error.printerId),
    JSON.stringify(errors, null, 2)
  );

  // Auto-set printer status to "error"
  await updatePrinter(error.printerId, { status: "error" });

  return newError;
}

export async function resolveErrorLog(
  printerId: string,
  errorId: string
): Promise<boolean> {
  const errors = await getErrorsForPrinter(printerId);
  const index = errors.findIndex((e) => e.id === errorId);
  if (index === -1) return false;

  errors[index] = {
    ...errors[index],
    resolved: true,
    resolvedAt: new Date().toISOString(),
  };

  await fs.writeFile(
    getErrorsFile(printerId),
    JSON.stringify(errors, null, 2)
  );

  // If all errors are now resolved, auto-set printer status back to "online"
  const hasUnresolved = errors.some((e) => !e.resolved);
  if (!hasUnresolved) {
    await updatePrinter(printerId, { status: "online" });
  }

  return true;
}

export async function deleteErrorLog(
  printerId: string,
  errorId: string
): Promise<boolean> {
  const errors = await getErrorsForPrinter(printerId);
  const filtered = errors.filter((e) => e.id !== errorId);
  if (filtered.length === errors.length) return false;

  await fs.writeFile(
    getErrorsFile(printerId),
    JSON.stringify(filtered, null, 2)
  );
  return true;
}

// ============ Dashboard Operations ============

export async function getRecentActivity(
  limit: number = 10
): Promise<RecentActivity[]> {
  const printers = await getAllPrinters();
  const allActivity: RecentActivity[] = [];

  for (const printer of printers) {
    const actions = await getMaintenanceForPrinter(printer.id);
    for (const action of actions) {
      allActivity.push({ type: "maintenance", action, printer });
    }

    const errors = await getErrorsForPrinter(printer.id);
    for (const errorLog of errors) {
      allActivity.push({ type: "error", errorLog, printer });
    }
  }

  return allActivity
    .sort((a, b) => {
      const dateA =
        a.type === "maintenance"
          ? new Date(a.action!.performedAt).getTime()
          : new Date(a.errorLog!.reportedAt).getTime();
      const dateB =
        b.type === "maintenance"
          ? new Date(b.action!.performedAt).getTime()
          : new Date(b.errorLog!.reportedAt).getTime();
      return dateB - dateA;
    })
    .slice(0, limit);
}

export async function getPrintersWithLastMaintenance(): Promise<
  PrinterWithLastMaintenance[]
> {
  const printers = await getAllPrinters();
  const result: PrinterWithLastMaintenance[] = [];

  for (const printer of printers) {
    const actions = await getMaintenanceForPrinter(printer.id);
    const errors = await getErrorsForPrinter(printer.id);
    const activeErrorCount = errors.filter((e) => !e.resolved).length;
    result.push({
      ...printer,
      lastMaintenance: actions[0], // Already sorted descending
      totalMaintenanceCount: actions.length,
      activeErrorCount,
    });
  }

  return result;
}
