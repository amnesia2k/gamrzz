import { getJobs } from "@/helpers/api";
import { useSession } from "@clerk/clerk-react";
import { useEffect } from "react";

const JobListing = () => {
  const { session } = useSession();

  const fetchJobs = async () => {
    const supabaseAccessToken = await session.getToken({
      template: "supabaseE",
    });
    const data = await getJobs(supabaseAccessToken);
    console.log(data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);
  return <div>JobListing</div>;
};

export default JobListing;
