import CreatedApplications from "@/components/common/CreatedApplications";
import CreatedJobs from "@/components/common/CreatedJobs";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";

const MyJobs = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <BarLoader className="my-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-3xl md:text-5xl text-center pb-3">
        {user?.unsafeMetadata?.role === "player"
          ? "My Applications"
          : "My Contracts"}
      </h1>

      {user?.unsafeMetadata?.role === "player" ? (
        <CreatedApplications />
      ) : (
        <CreatedJobs />
      )}
    </div>
  );
};

export default MyJobs;
