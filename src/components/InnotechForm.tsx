"use client";

import { FC, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { createClient } from "@/app/lib/supabase/client";
import { SupabaseError } from "@/app/types/supabase";
import { isUnique } from "@/app/helpers/supabase";
import { Separator } from "./ui/separator";
import { type FormInputSchema, formSchema } from "@/app/lib/validators/form";
import {
  teamProffesionOptions,
  teamStrengthOptions,
  userCurrentYearOfStudyOptions,
} from "@/app/helpers/innotech";
import FormInput from "./FormInput";
import TeammateInformation from "./TeammateInformation";

const InnoTechForm: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const supabase = createClient();

  const form = useForm<FormInputSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user: {
        name: "",
        age: 0,
        gender: undefined,
        mobile: "",
        email: "",
        educational_institution: "",
        current_year_of_study: undefined,
        field_of_study: "",
      },
      team: {
        name: "",
        strength: undefined,
        profession: undefined,
        company_name: "",
        company_cin: "",
        video_link: "",
      },
    },
    mode: "onSubmit",
  });

  const onSubmit = async (formData: FormInputSchema): Promise<void> => {
    setLoading(true);

    if (!(await isUnique("users", "mobile", formData.user.mobile))) {
      toast({
        title: "Error",
        description: "This mobile number is already registered",
        variant: "destructive",
      });

      setLoading(false);
      return;
    }

    if (!(await isUnique("users", "email", formData.user.email))) {
      toast({
        title: "Error",
        description: "This email is already registered",
        variant: "destructive",
      });

      setLoading(false);
      return;
    }

    if (!(await isUnique("teams", "name", formData.team.name))) {
      toast({
        title: "Error",
        description: "This team name is already registered",
        variant: "destructive",
      });

      setLoading(false);
      return;
    }

    try {
      const { data: user, error: useError } = await supabase
        .from("users")
        .insert([formData.user])
        .select()
        .single();

      if (useError) throw useError;

      const { data: team, error: teamError } = await supabase
        .from("teams")
        .insert([{ ...formData.team, user_id: user.id }])
        .select()
        .single();

      if (teamError) throw teamError;

      toast({
        title: "Success!",
        description: "Your registration has been submitted successfully.",
        variant: "default",
      });

      form.reset();
    } catch (error) {
      const errorMessage =
        (error as SupabaseError)?.message || "An unknown error occurred";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "team.members",
  });

  const handleTeamSizeChange = (value: string) => {
    const size = parseInt(value, 10) - 1;
    const currentSize = fields.length;

    console.log(size, currentSize);

    if (size > currentSize) {
      for (let i = currentSize; i < size; i++) {
        append({ name: "", email: "", role: "" });
      }
    } else if (size < currentSize) {
      for (let i = currentSize - 1; i >= size; i--) {
        remove(i);
      }
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            InnoTech
          </CardTitle>
          <CardDescription className="text-center">
            Please fill in your details to complete the InnoTech registration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Participant Details */}
              <div>
                <p className="text-lg font-bold pt-6">Participant Details</p>
              </div>

              {/* <FormField
                control={form.control}
                name="user.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Full Name<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        {...field}
                        aria-label="Full name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormInput
                control={form.control}
                name="user.name"
                label="Full Name"
                placeholder="Enter your full name"
                required
              />

              <FormField
                control={form.control}
                name="user.age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Age<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter your age"
                        {...field}
                        aria-label="Age"
                        min="16"
                        max="100"
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="user.gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Gender<span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          {field.value ? (
                            <SelectValue placeholder="Select your gender" />
                          ) : (
                            "Select your gender"
                          )}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="user.mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Mobile Number<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your mobile number"
                        {...field}
                        type="tel"
                        aria-label="Mobile number"
                        pattern="[0-9]*"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="user.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                        aria-label="Email address"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="user.educational_institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Educational Institution
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your institution name"
                        {...field}
                        aria-label="Educational institution"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="user.current_year_of_study"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Current Year of Study
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          {field.value ? (
                            <SelectValue placeholder="Select your current year" />
                          ) : (
                            "Select your current year"
                          )}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {userCurrentYearOfStudyOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="user.field_of_study"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Field of Study<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your field of study"
                        {...field}
                        aria-label="Field of study"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              {/* Team Details */}
              <div>
                <p className="text-lg font-bold pt-3">Team Details</p>
              </div>

              <FormField
                control={form.control}
                name="team.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Team Name<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your team name"
                        {...field}
                        aria-label="Team name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="team.strength"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Number of Team Members
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      // onValueChange={field.onChange}
                      // defaultValue={field.value}

                      onValueChange={(value) => {
                        field.onChange(value);
                        handleTeamSizeChange(value);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          {field.value ? (
                            <SelectValue placeholder="Select the number of members" />
                          ) : (
                            "Select the number of members"
                          )}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teamStrengthOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {fields.map((field, index) => (
                <TeammateInformation
                  key={field.id}
                  form={form}
                  index={index}
                  field={field}
                />
              ))}

              <FormField
                control={form.control}
                name="team.profession"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Profession<span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          {field.value ? (
                            <SelectValue placeholder="Select your profession" />
                          ) : (
                            "Select your profession"
                          )}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teamProffesionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="team.company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your company name"
                        {...field}
                        aria-label="Company name"
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="team.company_cin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company CIN</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your company cin"
                        {...field}
                        aria-label="Company cin"
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="team.video_link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Team Video Link<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Provide the link of your team's uploaded video"
                        {...field}
                        aria-label="Team video link"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                aria-label={
                  loading ? "Submitting form..." : "Submit registration"
                }
              >
                {loading ? "Submitting..." : "Submit Registration"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InnoTechForm;
