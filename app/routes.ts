import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/dashboard.tsx"),
  route("printers/new", "routes/printers/new.tsx"),
  route("printers/:printerId", "routes/printers/$printerId.tsx"),
  route("printers/:printerId/maintenance/new", "routes/printers/$printerId.maintenance.new.tsx"),
] satisfies RouteConfig;
