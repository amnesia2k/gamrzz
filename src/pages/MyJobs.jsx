import CreatedApplications from "@/components/common/CreatedApplications";
import CreatedJobs from "@/components/common/CreatedJobs";
import { useUser } from "@clerk/clerk-react";
import { Helmet } from "react-helmet";
import { BarLoader } from "react-spinners";

const MyJobs = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <BarLoader className="my-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{`Gamrzz • ${
          user?.unsafeMetadata?.role === "player"
            ? "My Applications"
            : "My Contracts"
        }`}</title>
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
        <meta
          property="og:title"
          content={`Gamrzz • ${
            user?.unsafeMetadata?.role === "player"
              ? "My Applications"
              : "My Contracts"
          }`}
        />
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
        <meta
          name="twitter:title"
          content={`Gamrzz • ${
            user?.unsafeMetadata?.role === "player"
              ? "My Applications"
              : "My Contracts"
          }`}
        />
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
          {user?.unsafeMetadata?.role === "player"
            ? "My Applications"
            : "My Contracts"}
        </h1>

        {user?.unsafeMetadata?.role === "player" ? (
          <CreatedApplications />
        ) : (
          <CreatedJobs />
        )}
      </main>
    </>
  );
};

export default MyJobs;
