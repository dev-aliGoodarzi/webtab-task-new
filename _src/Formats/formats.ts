type T_Formats = "email" | "password" | "oneOrTwo";

export const formats: Record<T_Formats, RegExp> = {
  email: /^\S+@\S+\.\S+$/,
  password: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  oneOrTwo: /^[12]$/,
};
