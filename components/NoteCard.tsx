import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface NoteCardProps {
  id: string;
  content: string;
  onDelete: (id: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ id, content, onDelete }) => {
  return (
    <Card className="flex  flex-row py-0 pl-4 m-0 gap-0  items-center ">
      <div className="text-sm text-muted-foreground   w-full">{content}</div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(id)}
        className=" justify-end  hover:bg-red-100 justify-center dark:hover:bg-red-900 group"
      >
        <Trash2 className="w-5 h-5 text-red-500 group-hover:text-red-600 transition" />
      </Button>
    </Card>
  );
};

export default NoteCard;
