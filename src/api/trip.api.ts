import apiClient from "@/lib/apiClient";
import type { ITrip } from "@/lib/types";
import type { ApiResponse, PaginatedData, TripSearchParams } from "@/types";

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

export const getAllTrips = async (params?: {
  source?: string;
  destination?: string;
  page?: number;
  limit?: number;
  status?: string;
}) => {
  return apiClient<ApiResponse<ITrip[]>>("/trip", {
    params: { page: 1, limit: 20, ...params },
  });
};

// operator
export const getMyTrips = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<ApiResponse<ITrip[]>> => {
  return apiClient<ApiResponse<ITrip[]>>("/trip/my-trips", {
    params: { page: 1, limit: 20, ...params },
  });
};

export const createTrip = async (payload: {
  busId: string;
  routeId: string;
  travelDate: string;
  departureTime: string;
  arrivalTime: string;
  fare: number;
}): Promise<ApiResponse<ITrip>> => {
  return apiClient<ApiResponse<ITrip>>("/trip/create", {
    method: "POST",
    body: payload,
  });
};

export const updateTrip = async (
  id: string,
  payload: Partial<ITrip>,
): Promise<ApiResponse<ITrip>> => {
  return apiClient<ApiResponse<ITrip>>(`/trip/update/${id}`, {
    method: "PUT",
    body: payload,
  });
};

export const cancelTrip = async (id: string): Promise<ApiResponse<ITrip>> => {
  return apiClient<ApiResponse<ITrip>>(`/trip/cancel/${id}`, {
    method: "PATCH",
  });
};

export const setTripStatus = async (
  id: string,
  status: ITrip["status"],
): Promise<ApiResponse<ITrip>> => {
  return apiClient<ApiResponse<ITrip>>(`/trip/status/${id}`, {
    method: "PATCH",
    body: { status },
  });
};
