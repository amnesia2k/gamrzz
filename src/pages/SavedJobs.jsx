import JobCard from "@/components/common/JobCard";
import { getSavedJobs } from "@/helpers/api";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";

const SavedJobs = () => {
  const { isLoaded } = useUser();

  const {
    loading: loadingSavedJobs,
    data: savedJobs,
    fn: fnSavedJobs,
  } = useFetch(getSavedJobs);

  useEffect(() => {
    if (isLoaded) fnSavedJobs();
  }, [isLoaded]);

  if (!isLoaded || loadingSavedJobs) {
    return <BarLoader className="my-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl md:text-7xl text-center pb-8">
        Saved Jobs
      </h1>

      {loadingSavedJobs === false && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {savedJobs?.length ? (
            savedJobs.map((saved) => (
              <JobCard
                key={saved?.id}
                job={saved.job}
                savedInit={true}
                onJobSaved={fnSavedJobs}
              />
            ))
          ) : (
            <div>No Saved Contracts Found...👀</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
