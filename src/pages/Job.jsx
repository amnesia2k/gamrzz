import { getSingleJob, updateHiringStatus } from "@/helpers/api";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import { BriefcaseBusiness, DoorClosed, DoorOpen, MapPin } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ApplyToJob from "@/components/ui/ApplyToJob";
import ApplicationCard from "@/components/ui/ApplicationCard";

const Job = () => {
  const { isLoaded, user } = useUser();
  const { id } = useParams();

  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useFetch(getSingleJob, { job_id: id });

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateHiringStatus,
    {
      job_id: id,
    }
  );

  const handleStatusChange = (v) => {
    const isOpen = v === "open";
    fnHiringStatus(isOpen).then(() => fnJob());
  };

  useEffect(() => {
    if (isLoaded) fnJob();
  }, [isLoaded]);

  if (!isLoaded || loadingJob) {
    return <BarLoader className="my-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="flex flex-col md:gap-3 mt-5">
      <div className="flex flex-col-reverse gap-2 md:gap-6 md:flex-row justify-between items-center">
        <h1 className="gradient-title font-extrabold text-2xl md:text-4xl">
          {job?.title}
        </h1>
        <img
          src={job?.company?.logo_url}
          alt={job?.title}
          className="h-[25px] md:h-[35px]"
        />
      </div>

      <div className="flex justify-between items-center py-3 md:py-0">
        <div className="flex gap-1 md:gap-2 text-sm sm:text-base items-center">
          <MapPin size={17} />
          {job?.location}
        </div>

        <div className="flex gap-1 md:gap-2 text-sm sm:text-base items-center">
          <BriefcaseBusiness size={17} />
          {job?.applications?.length} Applicants
        </div>

        <div className="flex gap-1 md:gap-2 text-sm sm:text-base items-center">
          {job?.isOpen ? (
            <>
              <DoorOpen size={17} />
              Open
            </>
          ) : (
            <>
              <DoorClosed size={17} />
              Closed
            </>
          )}
        </div>
      </div>

      {/* Hiring Status Section */}
      {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
      {job?.recruiter_id === user?.id && (
        <Select onValueChange={handleStatusChange}>
          <SelectTrigger
            className={`w-full ${job?.isOpen ? "bg-green-950" : "bg-red-950"}`}
          >
            <SelectValue
              placeholder={
                "Hiring Status " + (job?.isOpen ? "(Open)" : "(Closed)")
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      )}

      <h2 className="text-2xl md:text-4xl font-bold">About the Job</h2>
      <p className="sm:text-lg">{job?.description}</p>

      <h2 className="text-2xl md:text-4xl font-bold">Requirements</h2>
      <MDEditor.Markdown
        source={job?.requirements}
        className="bg-transparent sm:text-lg px-0"
      />

      {/* Render Applications */}
      {job?.recruiter_id !== user?.id && (
        <ApplyToJob
          job={job}
          user={user}
          fetchJob={fnJob}
          applied={job?.applications?.find(
            (ap) => ap.candidate_id === user?.id
          )}
        />
      )}

      {job?.applications?.length > 0 && job?.recruiter_id === user?.id && (
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl md:text-3xl font-bold">Applications</h2>
          {job?.applications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Job;
