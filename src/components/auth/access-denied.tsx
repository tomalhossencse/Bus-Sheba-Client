import { ShieldAlert } from "lucide-react";
import Link from "next/link";

const AccessDenied = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <ShieldAlert className="h-12 w-12 text-gray-400" />
      <h2 className="mt-2 text-lg font-semibold text-gray-900">
        Access Denied
      </h2>
      <p className="mt-1 text-sm text-gray-600">
        You do not have permission to access this page.
      </p>
      <div className="mt-6 flex justify-center">
        <Link
          href="/"
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Go back to home
        </Link>
      </div>
    </div>
  );
};

export default AccessDenied;
