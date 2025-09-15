import { PlacesTable } from "@/features/places";

export default function PlacesPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col ">
        <div className="flex flex-col py-4 md:py-6">
          <div className="px-4 lg:px-6">
            <PlacesTable />
          </div>
        </div>
      </div>
    </div>
  );
}
