"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import NoteCard from "./NoteCard";

export default function HomePage() {
  const [notes, setNotes] = useState<{ _id: string; content: string }[]>([]);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const router = useRouter();

  // Fetch user and notes on mount
  useEffect(() => {
    async function fetchUserAndNotes() {
      setIsLoading(true);
      try {
        // Fetch user
        const userRes = await fetch("/api/get-user");
        const userData = await userRes.json();
        if (userData.success) {
          setUser(userData.user);
        } else {
          router.push("/sign-in");
          return;
        }
        // Fetch notes
        const notesRes = await fetch("/api/add-note");
        const notesData = await notesRes.json();
        if (notesData.success) {
          setNotes(notesData.notes);
        }
      } catch (err) {
        router.push("/sign-in");
      } finally {
        setIsLoading(false);
      }
    }
    fetchUserAndNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add note to DB
  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setAddingNote(true);
    try {
      const res = await fetch("/api/add-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newNote }),
      });
      const data = await res.json();
      if (data.success) {
        setNotes((prev) => [data.note, ...prev]);
        setNewNote("");
      }
    } finally {
      setAddingNote(false);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch("/api/delete-note", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (data.success) {
      setNotes((prev) => prev.filter((note) => note._id !== id));
    }
  };

  const handleSignOut = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/sign-in");
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-6 pb-10 bg-white">
      {/* Header */}
      <div className="w-full flex justify-between items-center max-w-md mb-6">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Logo" width={32} height={32} />
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>
        <Button
          variant="link"
          className="text-blue-600 p-0 h-auto cursor-pointer"
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </div>

      {/* Welcome Card */}
      <Card className="w-full max-w-md shadow">
        <CardContent className="py-4">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Image
                src="/logo.svg"
                alt="loader"
                width={24}
                height={24}
                className="animate-spin"
              />
              <span>Loading...</span>
            </div>
          ) : (
            <>
              <p className="text-lg font-semibold">
                Welcome, {user ? user.name : "Unknown"}!
              </p>
              <p className="text-sm text-muted-foreground">
                Email: {user ? user.email : "Unknown"}
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Create Note Button with Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-6 w-full max-w-md">Create Note</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new note</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Enter note"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="my-4"
            disabled={addingNote}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button
                onClick={handleAddNote}
                disabled={!newNote.trim() || addingNote}
                className="w-full"
              >
                {addingNote ? (
                  <span className="flex items-center gap-2">
                    <Image
                      src="/logo.svg"
                      alt="loader"
                      width={20}
                      height={20}
                      className="animate-spin"
                    />
                    Adding...
                  </span>
                ) : (
                  "Add Note"
                )}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notes Section */}
      <div className="w-full max-w-md mt-8">
        <h2 className="text-lg font-medium mb-3">Notes</h2>
        <div className="flex flex-col gap-3">
          {notes.map((note, index) => (
            <NoteCard
              id={note._id}
              key={note._id}
              content={note.content}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
