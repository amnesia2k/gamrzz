import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";

const Onboarding = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const handleRoleSelection = async (role) => {
    await user
      .update({
        unsafeMetadata: { role },
      })
      .then(() => {
        navigate(role === "recruiter" ? "/post-contract" : "/contracts");
      })
      .catch((err) => {
        console.error("Error updating role:", err);
      });
  };

  useEffect(() => {
    if (user?.unsafeMetadata?.role) {
      navigate("/contracts");
    }
  }, [user, navigate]);

  if (!isLoaded) {
    return <BarLoader className="my-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="flex flex-col items-center justify-center mt-40">
      <h2 className="gradient-title font-extrabold text-7xl md:text-8xl tracking-tighter">
        I am a...
      </h2>

      <div className="mt-16 grid grid-cols-2 gap-4 w-full md:px-32">
        <Button
          variant="blue"
          onClick={() => handleRoleSelection("player")}
          className="text-2xl h-16"
        >
          Player
        </Button>
        <Button
          variant="destructive"
          onClick={() => handleRoleSelection("recruiter")}
          className="text-2xl h-16"
        >
          Recruiter
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
