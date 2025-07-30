"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "../ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

const formSchema = z.object({
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

export default function SignInForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      dob: undefined,
      email: "",
      otp: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h2 className="text-3xl font-bold justify-center flex">Sign in</h2>
        <p className="text-muted-foreground  flex justify-center text-sm">
          Please login to continue to your account
        </p>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="jonas_kahnwald@gmail.com"
                  className="focus-visible:ring-0 focus-visible:ring-offset-0"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OTP</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  {...field}
                  className="w-full flex gap-2"
                >
                  <InputOTPGroup className="flex w-full gap-2">
                    {[...Array(6)].map((_, i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="flex-1  h-10 text-center text-lg border rounded-md"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-[#367AFF]">
          Get OTP
        </Button>

        <p className="text-sm text-center">
          Need an account?
          <Link href="/sign-up" className="text-blue-600 underline">
            Create one
          </Link>
        </p>
      </form>
    </Form>
  );
}
