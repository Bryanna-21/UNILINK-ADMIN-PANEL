"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Settings
          </h1>

          <p className="text-gray-400 mt-2">
            Manage admin preferences.
          </p>
        </div>

        <div className="card max-w-[700px]">
          <div className="mb-6">
            <label className="block mb-2">
              Platform Name
            </label>

            <input
              defaultValue="UniLink"
              className="
              w-full
              p-4
              rounded-xl
              bg-white/5
              border
              border-white/10
            "
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2">
              Support Email
            </label>

            <input
              defaultValue="support@unilink.com"
              className="
              w-full
              p-4
              rounded-xl
              bg-white/5
              border
              border-white/10
            "
            />
          </div>

          <button
            className="
            bg-violet-600
            hover:bg-violet-700
            px-5
            py-3
            rounded-xl
          "
          >
            Save Changes
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
