import { PlacesTable } from "@/features/places";

export default function PlacesPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-xl font-semibold">All Places</h1>
            <p className="text-muted-foreground text-sm">
              Manage places. Search, filter, and add new entries.
            </p>
          </div>
          <PlacesTable />
        </div>
      </div>
    </div>
  );
}
