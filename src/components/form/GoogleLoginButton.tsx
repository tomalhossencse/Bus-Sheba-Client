import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useGoogleLogin } from "@/hooks";

const GoogleLoginButton = () => {
  const router = useRouter();
  const { mutate: googleLogin } = useGoogleLogin();
  const handleGoogleSuccess = (credentialResponse: { credential?: string }) => {
    const idToken = credentialResponse.credential;
    if (!idToken) {
      toast.error("Google Login Failed");
      return;
    }
    googleLogin(
      { idToken },
      {
        onSuccess: (res) => {
          router.push("/");
          toast.success(res.message || "Login successful");
        },
        onError: (err: any) => {
          toast.error(err.message || "Google Login failed. Please try again.");
        },
      },
    );
  };

  const handleGoogleError = () => {
    toast.error("Google Login failed. Please try again.");
  };
  return (
    <GoogleLogin
      theme="outline"
      shape="pill"
      text="continue_with"
      onSuccess={handleGoogleSuccess}
      onError={handleGoogleError}
    />
  );
};

export default GoogleLoginButton;
