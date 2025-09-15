import { useQuery } from "@tanstack/react-query";
import { fetchCategoriesLite, fetchPlacesPaged } from "./queries";

export function useCategoriesLite() {
  return useQuery({
    queryKey: ["categories", "lite"],
    queryFn: () => fetchCategoriesLite(),
    staleTime: 5 * 60 * 1000,
  });
}

import type {
  PlacesPagedResult,
  PlacesQueryParams,
} from "@/features/places/types";

export function usePlacesPaged(
  params: PlacesQueryParams
): ReturnType<typeof useQuery<PlacesPagedResult>> {
  return useQuery({
    queryKey: [
      "places",
      {
        pageIndex: params.pageIndex,
        pageSize: params.pageSize,
        search: params.search ?? "",
        categoryId: params.categoryId ?? null,
        active: params.active ?? "all",
      },
    ],
    queryFn: () => fetchPlacesPaged(params),
  });
}
