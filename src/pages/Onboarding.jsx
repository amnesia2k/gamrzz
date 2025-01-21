import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
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
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>Gamrzz • Onboarding</title>
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
        <meta property="og:title" content="Gamrzz • Onboarding" />
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
        <meta name="twitter:title" content="Gamrzz • Onboarding" />
        <meta
          name="twitter:description"
          content="Gamrzz is a platform designed for mobile gamers and team recruiters. It allows recruiters to create contracts for their teams and players to apply, fostering connections between skilled players and competitive teams."
        />
        <meta
          name="twitter:image"
          content="https://gamrzz.vercel.app/ms-icon-310x310.png"
        />
      </Helmet>

      <main className="flex flex-col items-center justify-center mt-40">
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
      </main>
    </>
  );
};

export default Onboarding;
