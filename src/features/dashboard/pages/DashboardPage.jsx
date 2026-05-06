import { useNavigate } from "react-router-dom";

import { PATHS } from "../../../core/routing/paths";

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="p-10">
      <h1>Dashboard</h1>

      <button
        onClick={() => navigate(PATHS.DELIVERY)}
      >
        Start Delivery
      </button>
    </div>
  );
}