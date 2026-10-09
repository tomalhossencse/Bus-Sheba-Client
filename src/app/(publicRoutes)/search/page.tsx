import { Suspense } from "react";
import { TripListing } from "@/components/modules/booking/TripListing";

export const metadata = {
  title: "Search Buses | BusSheba",
  description: "Search and compare available buses across Bangladesh",
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading search...</div>}>
      <TripListing />
    </Suspense>
  );
}
