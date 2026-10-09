export const formatPrice = (price: number): string => {
  return `৳${Number(price || 0).toLocaleString()}`;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatDateTime = (dateString?: string | Date) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatTime = (dateString: string): string => {
  if (/^\d{1,2}:\d{2}/.test(dateString)) {
    const [rawHour, rawMinute] = dateString.split(":");
    const hour = Number(rawHour);
    const minute = Number(rawMinute);
    if (!Number.isNaN(hour) && !Number.isNaN(minute)) {
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      return `${displayHour}:${String(minute).padStart(2, "0")} ${period}`;
    }
  }
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatStopTime = (
  departureTime: string | undefined,
  offsetMinutes: number | undefined,
): string => {
  if (!departureTime || offsetMinutes === undefined || offsetMinutes === null)
    return "—";

  const timeOnlyMatch = departureTime.match(/^(\d{1,2}):(\d{2})/);
  const date = timeOnlyMatch
    ? new Date(2000, 0, 1, Number(timeOnlyMatch[1]), Number(timeOnlyMatch[2]))
    : new Date(departureTime);

  if (Number.isNaN(date.getTime())) return formatTime(departureTime);
  date.setMinutes(date.getMinutes() + Number(offsetMinutes));
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatInitials = (name: string) => {
  return name
    .toUpperCase()
    .split(" ")
    .map((word) => word.charAt(0))
    .join("");
};

export const formatName = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const formatDuration = (duration: string) => {
  return duration;
};
