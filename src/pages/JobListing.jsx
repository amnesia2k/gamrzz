import JobCard from "@/components/common/JobCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCompanies, getJobs } from "@/helpers/api";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import { State } from "country-state-city";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const { isLoaded } = useUser();

  const {
    fn: fnJobs,
    data: jobs,
    loading: loadingJobs,
  } = useFetch(getJobs, { location, company_id, searchQuery });

  const { fn: fnCompanies, data: companies } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) fnJobs();
  }, [isLoaded, location, company_id, searchQuery]);

  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);

  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);

    const query = formData.get("search-query");
    if (query) setSearchQuery(query);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setLocation("");
    setCompany_id("");
  };

  if (!isLoaded) {
    return <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl md:text-7xl text-center pb-8">
        Latest Jobs
      </h1>

      {/* Add Filters */}
      <form
        onSubmit={handleSearch}
        className="h-12 flex gap-3 w-full items-center mb-3"
      >
        <Input
          type="text"
          placeholder="Search Jobs by Title"
          name="search-query"
          className="h-full flex-1 px-4 text-lg"
        />
        <Button variant="blue" type="submit" className="h-full md:w-28">
          Search
        </Button>
      </form>

      <div className="flex flex-col md:flex-row gap-2">
        <Select value={location} onValueChange={(value) => setLocation(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by location..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {State.getStatesOfCountry("NG")?.map(({ isoCode, name }) => (
                <SelectItem key={isoCode} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          value={company_id}
          onValueChange={(value) => setCompany_id(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by company..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {companies?.map(({ name, id }) => (
                <SelectItem key={id} value={id}>
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          onClick={clearFilters}
          variant="destructive"
          className="md:w-1/2"
        >
          Clear Filters
        </Button>
      </div>

      {loadingJobs && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}

      {loadingJobs === false && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {jobs?.length ? (
            jobs.map((job) => (
              <JobCard
                key={job?.id}
                job={job}
                savedInit={job?.saved?.length > 0}
              />
            ))
          ) : (
            <div>No Jobs Found...😢</div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListing;
