"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function HomePage() {
  const [notes, setNotes] = useState(["Note 1", "Note 2"]);

  const handleDelete = (index: number) => {
    const updated = [...notes];
    updated.splice(index, 1);
    setNotes(updated);
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-6 pb-10 bg-white">
      {/* Header */}
      <div className="w-full flex justify-between items-center max-w-md mb-6">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Logo" width={32} height={32} />
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>
        <Button variant="link" className="text-blue-600 p-0 h-auto">
          Sign Out
        </Button>
      </div>

      {/* Welcome Card */}
      <Card className="w-full max-w-md shadow">
        <CardContent className="py-4">
          <p className="text-lg font-semibold">Welcome, Jonas Kahnwald !</p>
          <p className="text-sm text-muted-foreground">
            Email: xxxxxx@xxxx.com
          </p>
        </CardContent>
      </Card>

      {/* Create Note Button */}
      <Button className="mt-6 w-full max-w-md">Create Note</Button>

      {/* Notes Section */}
      <div className="w-full max-w-md mt-8">
        <h2 className="text-lg font-medium mb-3">Notes</h2>
        <div className="flex flex-col gap-3">
          {notes.map((note, index) => (
            <Card
              key={index}
              className="flex items-center justify-between px-4 py-3"
            >
              <span>{note}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(index)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
