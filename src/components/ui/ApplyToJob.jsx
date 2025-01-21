/* eslint-disable react/prop-types */
import { Controller, useForm } from "react-hook-form";
import { Button } from "./button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";
import { Input } from "./input";
import { Label } from "./label";
import { RadioGroup, RadioGroupItem } from "./radio-group";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useFetch from "@/hooks/useFetch";
import { applyToJob } from "@/helpers/api";
import { BarLoader } from "react-spinners";

const schema = z.object({
  experience: z
    .number({ message: "Number is expected" })
    .min(1, { message: "Experience must be at least 1" })
    .int(),
  skills: z.string().min(1, { message: "Skills are required" }),
  education: z.enum(["Beginner", "Intermediate", "Professional"], {
    message: "Level is required",
  }),
  resume: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "application/pdf" ||
          file[0].type === "application/msword" ||
          file[0].type === "image/png" ||
          file[0].type === "image/jpeg" ||
          file[0].type === "image/jpg"),
      { message: "files supported: PDF and images (.png, .jpeg, .jpg)" }
    ),
});

const ApplyToJob = ({ user, job, applied = false, fetchJob }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(schema) });

  const {
    loading: loadingApply,
    error: errorApply,
    fn: fnApply,
  } = useFetch(applyToJob);

  const onSubmit = (data) => {
    fnApply({
      ...data,
      job_id: job.id,
      candidate_id: user.id,
      name: user.fullName,
      status: "applied",
      resume: data.resume[0],
    }).then(() => {
      fetchJob();
      reset();
    });
  };

  return (
    <Drawer open={applied ? false : undefined}>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          variant={job?.isOpen && !applied ? "blue" : "destructive"}
          disabled={!job?.isOpen || applied}
        >
          {job?.isOpen ? (applied ? "Applied" : "Apply") : "Hiring Closed"}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            <h3>Apply for {job?.title}</h3>
            {/* at {job?.company?.name} */}
          </DrawerTitle>
          <DrawerDescription>
            Please fill the required form below
          </DrawerDescription>
        </DrawerHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-4 pb-0"
        >
          <div>
            <Input
              type="number"
              placeholder="Years of experience"
              className="flex-1"
              {...register("experience", { valueAsNumber: true })}
            />
            {errors.experience && (
              <p className="text-red-500 text-xs">
                {errors.experience.message}
              </p>
            )}
          </div>

          <div>
            <Input
              type="text"
              placeholder="Skills (Comma Separated)"
              className="flex-1"
              {...register("skills")}
            />
            {errors.experience && (
              <p className="text-red-500 text-xs">{errors.skills.message}</p>
            )}
          </div>

          <div>
            {/* <Radio */}
            <Controller
              name="education"
              control={control}
              render={({ field }) => (
                <RadioGroup onValueChange={field.onChange} {...field}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Beginner" id="beginner" />
                    <Label htmlFor="beginner">Beginner</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Intermediate" id="intermediate" />
                    <Label htmlFor="intermediate">Intermediate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Professional" id="professional" />
                    <Label htmlFor="professional">Professional</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.experience && (
              <p className="text-red-500 text-xs">{errors.education.message}</p>
            )}
          </div>

          <div>
            <Input
              type="file"
              accepts=".pdf, .doc, .docx, image/*"
              className="flex-1 file:text-gray-500"
              {...register("resume")}
            />
            <p className="text-muted-foreground text-xs md:text-base">
              *files format accepted (.png, .jpg, .jpeg, .pdf)
            </p>
            {errors.resume && (
              <p className="text-red-500 text-xs">{errors.resume.message}</p>
            )}
          </div>

          {errorApply?.message && (
            <p className="text-red-500 text-xs">{errorApply?.message}</p>
          )}
          {loadingApply && <BarLoader width={"100%"} color="#36d7b7" />}
          <Button type="submit" variant="blue" size="lg">
            Apply Now
          </Button>
        </form>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ApplyToJob;
