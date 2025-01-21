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
import { Country } from "country-state-city";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { BarLoader } from "react-spinners";

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const { isLoaded } = useUser();
  const countries = Country.getAllCountries();

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
    if (query) return setSearchQuery(query);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setLocation("");
    setCompany_id("");
  };

  if (!isLoaded) {
    return <BarLoader className="my-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>Gamrzz • Contracts</title>
        <meta
          name="description"
          content="Gamrzz is a platform designed for mobile gamers and team recruiters. It allows recruiters to create contracts for their teams and players to apply, fostering connections between skilled players and competitive teams."
        />
        <meta
          name="keywords"
          content="Gamrzz, mobile gaming, esports recruitment, gaming platform, team recruiters, gamers, clan contracts, player applications, competitive gaming, mobile esports"
        />
        <meta name="author" content="Gamrzz" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Gamrzz • Contracts" />
        <meta
          property="og:description"
          content="Gamrzz is a platform designed for mobile gamers and team recruiters. It allows recruiters to create contracts for their teams and players to apply, fostering connections between skilled players and competitive teams."
        />
        <meta property="og:url" content="https://gamrzz.vercel.app/" />
        <meta
          property="og:image"
          content="https://gamrzz.vercel.app/ms-icon-310x310.png"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Gamrzz • Contracts" />
        <meta
          name="twitter:description"
          content="Gamrzz is a platform designed for mobile gamers and team recruiters. It allows recruiters to create contracts for their teams and players to apply, fostering connections between skilled players and competitive teams."
        />
        <meta
          name="twitter:image"
          content="https://gamrzz.vercel.app/ms-icon-310x310.png"
        />
      </Helmet>

      <main>
        <h1 className="gradient-title font-extrabold text-3xl md:text-5xl text-center pb-3">
          Latest Contracts
        </h1>

        {/* Add Filters */}
        <form
          onSubmit={handleSearch}
          className="h-12 flex gap-3 w-full items-center mb-3"
        >
          <Input
            // value={searchQuery}
            // onChange={(e) => setSearchQuery(e.target.value)}
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
          <Select
            value={location}
            onValueChange={(value) => setLocation(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by Country..." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {countries?.map(({ isoCode, name }) => (
                  <SelectItem key={isoCode} value={name}>
                    <div className="flex items-center gap-2">
                      <img
                        src={`https://flagcdn.com/w40/${isoCode.toLowerCase()}.png`}
                        alt={`${name} flag`}
                        className="w-5"
                      />
                      <span>{name}</span>
                    </div>
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
              <SelectValue placeholder="Filter by Game..." />
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
          <BarLoader className="my-4" width={"100%"} color="#36d7b7" />
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
      </main>
    </>
  );
};

export default JobListing;
