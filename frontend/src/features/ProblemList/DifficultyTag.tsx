import { Badge } from "@/components/ui/badge";

export function DifficultyTag({ difficulty }: { difficulty: string }) {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return (
        <Badge variant="outline" className="bg-emerald-500/20 text-emerald-300 border-none">
          Easy
        </Badge>
      );
    case "medium":
      return (
        <Badge variant="outline" className="bg-amber-600/20 text-amber-200 border-none">
          Medium
        </Badge>
      );
    case "hard":
      return (
        <Badge variant="outline" className="bg-rose-500/20 text-rose-300 border-none">
          Hard
        </Badge>
      );
    default:
      return null;
  }
}
