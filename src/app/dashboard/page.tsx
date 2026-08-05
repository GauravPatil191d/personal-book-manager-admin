import React from "react";
import { DashboardContainer } from "@/containers/dashboard-container";

export const metadata = {
  title: "Dashboard | Personal Book Manager",
  description: "Manage your personal book collection, track reading stats, and update notes in your private Woody Library.",
};

export default function DashboardPage() {
  return <DashboardContainer />;
}
