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
import { signInSchema } from "@/lib/validation";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signIn } from "next-auth/react";

export default function SignInForm() {
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    setIsLoading(true);
    try {
      if (!otpSent) {
        const checkRes = await axios.post("/api/check-user", {
          email: values.email,
        });

        if (!checkRes.data.exists) {
          form.setError("email", {
            type: "manual",
            message: "Email not registered. Please sign up.",
          });
          setIsLoading(false);
          return;
        }

        const otpRes = await axios.post("/api/send-otp", {
          email: values.email,
        });

        if (otpRes.data.success) {
          setOtpSent(true);
          startResendCountdown();
          toast("OTP Sent", {
            description: "Please check your email for the verification code.",
          });
        } else {
          toast.warning("Error", {
            description: otpRes.data.message || "Failed to send OTP.",
          });
        }
      } else {
        const verifyRes = await axios.post("/api/verify-otp", {
          email: values.email,
          code: values.otp,
          action: "signin",
        });

        if (verifyRes.data.success) {
          toast.success("Success", {
            description: "Signed in successfully!",
          });
          router.push("/");
        } else {
          toast.error("Error", {
            description:
              verifyRes.data.message || "Invalid OTP. Please try again.",
          });
        }
      }
    } catch (err) {
      console.error("Error:", err);
      form.setError("email", {
        type: "manual",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleResendOTP = async () => {
    if (resendDisabled) return;

    setIsLoading(true);
    try {
      const values = form.getValues();
      const res = await axios.post("/api/send-otp", {
        email: values.email,
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
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <h2 className="text-3xl font-bold text-center">Sign in</h2>
          <p className="text-muted-foreground text-sm text-center">
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
            className="w-full bg-[#367AFF] hover:bg-blue-400"
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
        </form>
      </Form>

      {/* Divider */}
      <div className="flex items-center gap-2 my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="text-sm text-gray-500">or</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      {/* Google Sign In */}
      <Button
        variant="outline"
        className="w-full flex cursor-pointer hover:shadow-2xl items-center justify-center gap-2"
        onClick={() => signIn("google", { callbackUrl: "/" })}
      >
        <Image src="/google-icon.svg" alt="Google" width={20} height={20} />
        Sign in with Google
      </Button>

      <p className="text-sm text-center">
        Need an account?
        <Link href="/sign-up" className="text-blue-600 underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
