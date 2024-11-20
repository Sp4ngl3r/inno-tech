import { createClient } from "@/app/lib/supabase/client";

export const isUnique = async (
  table: string,
  column: string,
  value: string
): Promise<boolean> => {
  const supabase = createClient();

  const { data } = await supabase.from(table).select(column).eq(column, value);

  return data?.length === 0;
};
