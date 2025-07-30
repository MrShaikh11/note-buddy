import SignUpForm from "@/components/form/SignUpForm";
import Image from "next/image";

export default function Page() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="relative flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-24 py-8">
        <div className="absolute top-6 left-6  items-center gap-2 hidden md:flex">
          <Image src="/logo.svg" alt="Logo" width={32} height={32} />
          <span className="text-2xl font-semibold text-[#232323]">HD</span>
        </div>

        <div className="flex items-center justify-center space-x-2 mb-8 block md:hidden">
          <Image src="/logo.svg" alt="Logo" width={24} height={24} />
          <span className="text-xl font-bold text-[#232323]">HD</span>
        </div>

        <div className="w-full max-w-sm mx-auto">
          <SignUpForm />
        </div>
      </div>

      <div className="hidden md:block p-4">
        <div
          className="h-full w-full bg-cover bg-center rounded-3xl"
          style={{ backgroundImage: "url('/blue-bg.jpg')" }}
        />
      </div>
    </div>
  );
}
