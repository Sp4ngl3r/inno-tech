export interface UserFields {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  mobile: string;
  email: string;
  educational_institution: string;
  current_year: string;
  field_of_study: string;
}

export interface TeamFields {
  name: string;
  strength: string;
}

export interface User {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  mobile: string;
  email: string;
  educational_institution: string;
  current_year: number;
  field_of_study: string;
  created_at: string;
}

export interface FormInputProps {
  control: any;
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
}
