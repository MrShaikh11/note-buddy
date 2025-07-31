"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signUpSchema } from "@/lib/validation";

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      dob: undefined,
      otp: "",
    },
    mode: "onChange",
  });
  const onSubmit = async (values: SignUpFormData) => {
    setIsLoading(true);

    try {
      if (!otpSent) {
        // send OTP
        const res = await axios.post("/api/send-otp", {
          email: values.email,
          name: values.name,
          dob: values.dob,
        });

        if (res.data.success) {
          setOtpSent(true);
          startResendCountdown();
          toast("OTP Sent", {
            description: "Please check your email for the verification code.",
          });
        } else {
          toast.warning("Error", {
            description: res.data.message || "Failed to send OTP.",
          });
        }
      } else {
        console.log("kya ree");
        // verify OTP
        const res = await axios.post("/api/verify-otp", {
          email: values.email,
          code: values.otp, // Changed from 'otp' to 'code' to match your API
          name: values.name,
          dob: values.dob,
          action: "signup",
        });

        console.log("Verify OTP response:", res.data);

        if (res.data.success) {
          toast.success("Success", {
            description: "Your account has been created successfully!",
          });
          router.push("/");
        } else {
          toast.error("Error", {
            description: res.data.message || "Invalid OTP. Please try again.",
          });
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error:", error);
      toast.warning("Error", {
        description:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP resend
  const handleResendOTP = async () => {
    if (resendDisabled) return;

    setIsLoading(true);
    try {
      const values = form.getValues();
      const res = await axios.post("/api/send-otp", {
        email: values.email,
        name: values.name,
        dob: values.dob,
      });

      if (res.data.success) {
        startResendCountdown();
        toast("OTP Resent", {
          description: "A new verification code has been sent to your email.",
        });
      } else {
        toast.warning("Error", {
          description: res.data.message || "Failed to resend OTP.",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.warning("Error", {
        description: error.response?.data?.message || "Failed to resend OTP.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Start countdown for OTP resend
  const startResendCountdown = () => {
    setResendDisabled(true);
    setCountdown(30);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <h2 className="text-3xl font-bold text-center">Sign up</h2>
          <p className="text-muted-foreground text-center text-sm">
            Sign up to enjoy the features of HD
          </p>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    {...field}
                    disabled={otpSent && isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start pl-3 pr-2 py-2 text-left font-normal gap-2",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={otpSent && isLoading}
                      >
                        <CalendarIcon className="h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      captionLayout="dropdown"
                      fromYear={1900}
                      toYear={new Date().getFullYear()}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
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
                    {...field}
                    className="focus-visible:ring-0 focus-visible:ring-offset-0"
                    disabled={otpSent && isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {otpSent && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter Verification Code</FormLabel>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        value={field.value}
                        onChange={field.onChange}
                      >
                        <InputOTPGroup className="flex w-full gap-2">
                          {[...Array(6)].map((_, i) => (
                            <InputOTPSlot
                              key={i}
                              index={i}
                              className="flex-1 h-10 text-center text-lg border rounded-md"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={handleResendOTP}
                  disabled={resendDisabled || isLoading}
                  className="text-sm text-[#367AFF]"
                >
                  {resendDisabled
                    ? `Resend OTP in ${countdown}s`
                    : "Didn't receive code? Resend"}
                </Button>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#367AFF] hover:bg-blue-400 cursor-pointer"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Image
                  src="/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="animate-spin"
                />
                <span>Loading...</span>
              </div>
            ) : otpSent ? (
              "Verify OTP"
            ) : (
              "Get OTP"
            )}
          </Button>

          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-[#367AFF] hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
}
