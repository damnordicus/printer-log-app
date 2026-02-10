import type { Route } from "./+types/dashboard";
import { Header } from "~/components/layout/Header";
import { PrinterCard } from "~/components/printers/PrinterCard";
import { RecentActivityFeed } from "~/components/maintenance/RecentActivityFeed";
import {
  getPrintersWithLastMaintenance,
  getRecentActivity,
} from "~/lib/data.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Printer Maintenance Log" },
    { name: "description", content: "Track maintenance for your 3D printers" },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  const [printers, recentActivity] = await Promise.all([
    getPrintersWithLastMaintenance(),
    getRecentActivity(10),
  ]);

  return { printers, recentActivity };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { printers, recentActivity } = loaderData;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Printers section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your Printers
            </h2>
            {printers.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-prusa-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-prusa-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No printers yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Add your first printer to start tracking maintenance.
                </p>
                <a
                  href="/printers/new"
                  className="inline-flex items-center gap-2 bg-prusa-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-prusa-600 transition-colors"
                >
                  Add Printer
                </a>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {printers.map((printer) => (
                  <PrinterCard key={printer.id} printer={printer} />
                ))}
              </div>
            )}
          </div>

          {/* Recent activity section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Recent Activity
            </h2>
            <RecentActivityFeed activities={recentActivity} />
          </div>
        </div>
      </main>
    </div>
  );
}
