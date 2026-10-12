"use client";

import { useState } from "react";
import AdminResourceManager from "@/components/admin/AdminResourceManager";
import type { ResourceConfig } from "@/lib/admin/resources";

export default function ManageTabs({
  tabs,
  scopeValue,
}: {
  tabs: { label: string; resource: ResourceConfig }[];
  scopeValue: number;
}) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="flex border-b border-slate-200 mb-8">
        {tabs.map((tab, i) => (
          <button
            key={tab.resource.key}
            type="button"
            onClick={() => setActive(i)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px ${
              i === active
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <AdminResourceManager resource={tabs[active].resource} scopeValue={scopeValue} />
    </div>
  );
}
