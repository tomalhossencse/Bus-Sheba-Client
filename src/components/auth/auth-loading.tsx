import { LoaderIcon } from "lucide-react";

const AuthLoading = ({ label = "verifying..." }: { label?: string }) => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex gap-3">
        <LoaderIcon className="size-6 animate-spin" />
        <p className="ml-2 text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
};

export default AuthLoading;
