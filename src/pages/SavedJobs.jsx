import JobCard from "@/components/common/JobCard";
import { getSavedJobs } from "@/helpers/api";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
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
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>Gamrzz • Saved Contracts</title>
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
        <meta property="og:title" content="Gamrzz • Saved Contracts" />
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
        <meta name="twitter:title" content="Gamrzz • Saved Contracts" />
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
        <h1 className="gradient-title font-extrabold text-3xl md:text-5xl text-center py-3">
          Saved Contracts
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
      </main>
    </>
  );
};

export default SavedJobs;
