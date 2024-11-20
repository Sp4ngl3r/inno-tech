import { ProfessionEnum } from "@/app/helpers/enums";
import * as z from "zod";

const VIDEO_URL_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\/.+/;

export const teamFormSchema = z.object({
  name: z
    .string()
    .min(2, "Team name must be at least 2 characters")
    .max(100, "Team name cannot exceed 100 characters")
    .trim(),

  strength: z.enum(["2", "3", "4"] as const, {
    errorMap: () => ({
      message: "Please select the number of members",
    }),
  }),

  profession: z.enum(
    [
      ProfessionEnum.INDIVIDUAL,
      ProfessionEnum.STARTUP,
      ProfessionEnum.WORKING_PROFESSIONAL,
      ProfessionEnum.STUDENT,
    ] as const,
    {
      errorMap: () => ({
        message: "Please select a profession",
      }),
    }
  ),

  company_name: z.string().nullable(),

  company_cin: z.string().nullable(),

  video_link: z
    .string()
    .url("Please enter a valid URL")
    .regex(VIDEO_URL_REGEX, "Please provide a valid YouTube or Vimeo video URL")
    .trim(),
});

export type TeamFormSchema = z.infer<typeof teamFormSchema>;
