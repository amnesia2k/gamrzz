import AddCompanyDrawer from "@/components/ui/AddCompanyDrawer";
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
import { Textarea } from "@/components/ui/textarea";
import { addNewJob, getCompanies } from "@/helpers/api";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
import { Country } from "country-state-city";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a location" }),
  company_id: z.string().min(1, { message: "Select or Add a new Company" }),
  requirements: z.string().min(1, { message: "Requirements are required" }),
});

const PostJob = () => {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();
  const countries = Country.getAllCountries();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { location: "", company_id: "", requirements: "" },
    resolver: zodResolver(schema),
  });

  const {
    fn: fnCompanies,
    data: companies,
    loading: loadingCompanies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);

  const {
    loading: loadingCreateJob,
    error: errorCreateJob,
    data: dataCreateJob,
    fn: fnCreateJob,
  } = useFetch(addNewJob);

  const onSubmit = (data) => {
    fnCreateJob({ ...data, recruiter_id: user.id, isOpen: true });
  };

  useEffect(() => {
    if (dataCreateJob?.length > 0) navigate("/contracts");
  }, [loadingCreateJob]);

  if (!isLoaded || loadingCompanies) {
    return <BarLoader className="my-4" width={"100%"} color="#36d7b7" />;
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/contracts" />;
  }

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>Gamrzz • New Contract</title>
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
        <meta property="og:title" content="Gamrzz • New Contract" />
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
        <meta name="twitter:title" content="Gamrzz • New Contract" />
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
          New Contract
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input placeholder="Contract Title..." {...register("title")} />
          {errors.title && (
            <p className="text-red-500">{errors.title.message}</p>
          )}

          <Textarea
            placeholder="Contract Description..."
            {...register("description")}
          />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}

          <div className="flex items-center flex-col md:flex-row gap-4">
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a location..." />
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
              )}
            />

            <Controller
              name="company_id"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a Clan...">
                      {field?.value
                        ? companies?.find((c) => c.id === Number(field.value))
                            ?.name
                        : "Company"}
                    </SelectValue>
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
              )}
            />

            {/* Add Company Drawer */}
            <AddCompanyDrawer fetchCompanies={fnCompanies} />
          </div>
          {errors.location && (
            <p className="text-red-500">{errors.location.message}</p>
          )}
          {errors.company_id && (
            <p className="text-red-500">{errors.company_id.message}</p>
          )}

          <Controller
            name="requirements"
            control={control}
            render={({ field }) => (
              <MDEditor value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.requirements && (
            <p className="text-red-500">{errors.requirements.message}</p>
          )}
          {errorCreateJob?.message && (
            <p className="text-red-500">{errorCreateJob?.message}</p>
          )}
          {loadingCreateJob && <BarLoader width={"100%"} color="#36d7b7" />}
          <Button type="submit" variant="blue" size="lg">
            Submit
          </Button>
        </form>
      </main>
    </>
  );
};

export default PostJob;
