import { GenderEnum } from "@/app/helpers/enums";
import * as z from "zod";

export const userFormSchema = z.object({
  name: z
    .string()
    .min(3, "Participant name must be at least 3 characters")
    .trim(),

  age: z.coerce
    .number()
    .refine((val) => val >= 16 && val <= 100, "Age must be between 16 and 100"),

  gender: z.enum(
    [GenderEnum.MALE, GenderEnum.FEMALE, GenderEnum.OTHER] as const,
    {
      errorMap: () => ({
        message: "Please select a profession",
      }),
    }
  ),

  mobile: z
    .string()
    .length(10, "Mobile number must be 10 digits")
    .refine(
      (val) => /^[0-9]+$/.test(val),
      "Mobile number must contain only digits"
    ),

  email: z.string().email("Invalid email address"),

  educational_institution: z.string().min(2, "Institution name is required"),

  current_year_of_study: z.string().min(1, "Please select current year"),

  field_of_study: z.string().min(2, "Field of study is required"),
});

export type UserFormSchema = z.infer<typeof userFormSchema>;
