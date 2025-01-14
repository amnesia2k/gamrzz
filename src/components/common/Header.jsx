import { Link, useSearchParams } from "react-router-dom";
import { Button } from "../ui/button";
import {
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { BriefcaseBusiness, Heart, PenBox } from "lucide-react";
import { useEffect, useState } from "react";

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const { user } = useUser();
  const [search, setSearch] = useSearchParams();

  useEffect(() => {
    if (search.get("sign-in")) {
      setShowSignIn(true);
    }
  }, [search]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
      setSearch({});
    }
  };

  return (
    <div>
      <nav className="flex justify-between items-center">
        <Link to="/">
          <img
            src="/logo-white.png"
            alt="logo"
            className="h-[40px] w-[140px] md:h-[60px] md:w-[200px] lg:w-[180px] lg:h-[60px]"
          />
        </Link>

        <div className="flex gap-5">
          <SignedOut>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => setShowSignIn(true)}
            >
              Login
            </Button>
          </SignedOut>
          <SignedIn>
            {user?.unsafeMetadata?.role === "recruiter" && (
              <Link to="/post-contract">
                <Button variant="destructive" className="rounded-full">
                  <PenBox size={20} />+ Contract
                </Button>
              </Link>
            )}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  // userButtonBox: { width: "40px", height: "40px" },
                  // userButtonAvatarBox: { width: "40px", height: "40px" },
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My Contracts"
                  labelIcon={<BriefcaseBusiness size={15} />}
                  href="/my-contracts"
                />
              </UserButton.MenuItems>
              <UserButton.MenuItems>
                <UserButton.Link
                  label="Saved Contracts"
                  labelIcon={<Heart size={15} />}
                  href="/saved-contracts"
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </nav>

      {showSignIn && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleOverlayClick}
        >
          <SignIn
            signUpForceRedirectUrl="/onboarding"
            fallbackRedirectUrl="/onboarding"
          />
        </div>
      )}
    </div>
  );
};

export default Header;
