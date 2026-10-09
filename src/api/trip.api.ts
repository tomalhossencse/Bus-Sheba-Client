import apiClient from "@/lib/apiClient";
import type { ITrip } from "@/lib/types";
import type { ApiResponse, TripSearchParams } from "@/types";

export const search = async (
  params: TripSearchParams,
): Promise<ApiResponse<ITrip[]>> => {
  const aliases = (value?: string) => {
    if (!value) return [value];
    const variants = [value];
    if (value.includes(" Bus Terminal")) {
      variants.push(value.replace(" Bus Terminal", " Terminal"));
    } else if (value.includes(" Terminal")) {
      variants.push(value.replace(" Terminal", " Bus Terminal"));
    }
    return [...new Set(variants)];
  };

  const sources = aliases(params.source);
  const destinations = aliases(params.destination);
  const requests = sources.flatMap((source) =>
    destinations.map((destination) =>
      apiClient<ApiResponse<ITrip[]>>("/trip/search", {
        params: { ...params, source, destination },
      }),
    ),
  );

  const responses = await Promise.allSettled(requests);
  const successfulResponses = responses.filter(
    (response) => response.status === "fulfilled",
  );
  const trips = successfulResponses.flatMap(
    (response) => response.value.data || [],
  );

  const uniqueTrips = [
    ...new Map(trips.map((trip) => [trip.id, trip])).values(),
  ];
  const firstSuccessful = successfulResponses[0];

  if (!firstSuccessful) {
    const failed = responses.find((response) => response.status === "rejected");
    throw failed?.reason;
  }

  return {
    ...firstSuccessful.value,
    data: uniqueTrips,
  };
};
