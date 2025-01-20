import { getMyJobs } from "@/helpers/api";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import JobCard from "./JobCard";

const CreatedJobs = () => {
  const { user } = useUser();

  const {
    loading: loadingCreatedJobs,
    data: createdJobs,
    fn: fnCreatedJobs,
  } = useFetch(getMyJobs, { recruiter_id: user.id });

  useEffect(() => {
    fnCreatedJobs();
  }, []);

  if (loadingCreatedJobs) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
        {createdJobs?.length ? (
          createdJobs.map((job) => (
            <JobCard
              key={job?.id}
              job={job}
              onJobSaved={fnCreatedJobs}
              isMyJob
            />
          ))
        ) : (
          <div>No Jobs Found...😢</div>
        )}
      </div>
    </div>
  );
};

export default CreatedJobs;
