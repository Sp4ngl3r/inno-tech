import { z } from "zod";
import { userFormSchema } from "./user";
import { teamFormSchema } from "./team";

export const formSchema = z.object({
  user: userFormSchema,
  team: teamFormSchema,
});

export type FormInputSchema = z.infer<typeof formSchema>;
