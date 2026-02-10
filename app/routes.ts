import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/dashboard.tsx"),
  route("printers/new", "routes/printers/new.tsx"),
  route("printers/:printerId", "routes/printers/$printerId.tsx"),
  route("printers/:printerId/maintenance/new", "routes/printers/$printerId.maintenance.new.tsx"),
  route("printers/:printerId/error/new", "routes/printers/$printerId.error.new.tsx"),
  route("printers/:printerId/edit", "routes/printers/$printerId.edit.tsx"),
] satisfies RouteConfig;
