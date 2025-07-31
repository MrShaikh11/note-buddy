import z from "zod";

export const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  dob: z.date({
    message: "A date of birth is required.",
  }),
  otp: z
    .string()
    .min(4, { message: "OTP must be at least 4 digits." })
    .max(6, { message: "OTP must be at most 6 digits." })
    .regex(/^\d+$/, { message: "OTP must contain only numbers." }),
});

export const signUpSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    dob: z.date({ message: "A date of birth is required." }),
    otp: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.otp !== undefined && data.otp !== "") {
        return data.otp.length === 6 && /^\d+$/.test(data.otp);
      }
      return true;
    },
    {
      message: "OTP must be exactly 6 digits.",
      path: ["otp"],
    }
  );

export const signInSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address." }),
    otp: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.otp !== undefined && data.otp !== "") {
        return data.otp.length === 6 && /^\d+$/.test(data.otp);
      }
      return true;
    },
    {
      message: "OTP must be exactly 6 digits and numeric.",
      path: ["otp"],
    }
  );
