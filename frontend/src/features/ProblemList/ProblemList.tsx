import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useProblems } from "@/api/hooks/problems";
import type { Problem } from "@/types/Problem";
import { Link } from "react-router-dom";
import { DifficultyTag } from "./DifficultyTag";
import Fuse from "fuse.js";

export function ProblemList() {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<Problem["difficulty"] | "All">("All");
  const { data: problems } = useProblems();

  const fuse = useMemo(() => {
    if (!problems) return null;

    return new Fuse(problems, {
      keys: [
        { name: "title", weight: 0.5 },
        { name: "description", weight: 0.3 },
        { name: "statement", weight: 0.2 },
      ],
      threshold: 0.25, // lower = stricter
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
  }, [problems]);

  const filteredProblems = useMemo(() => {
    if (!problems) return [];

    const matchesDifficulty = (p: Problem) =>
      difficulty === "All" || p.difficulty === difficulty;

    if (!search.trim() || !fuse) {
      return problems.filter(matchesDifficulty);
    }

    return fuse
      .search(search)
      .map((r) => r.item)
      .filter(matchesDifficulty);
  }, [search, difficulty, fuse, problems]);

  return (
    <div className="space-y-4 w-full max-w-5xl">
      <div className="flex flex-col sm:flex-row gap-2 items-center">
        <Input
          placeholder="Search problems..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <div className="flex items-center gap-2">
          <Label htmlFor="difficulty">Difficulty:</Label>
          <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Problem["difficulty"] | "All")}>
            <SelectTrigger id="difficulty" className="w-32">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProblems.map((problem) => (
          <Link to={`/problems/${problem.id}`}>
            <Card key={problem.id} className="cursor-pointer">
              <CardHeader>
                <CardTitle>{problem.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-3 mb-4">
                  {problem.description || problem.statement}
                </CardDescription>
                <DifficultyTag difficulty={problem.difficulty} />
              </CardContent>
            </Card>
          </Link>
        ))}
        {filteredProblems.length === 0 && <p className="text-muted-foreground">No problems found.</p>}
      </div>
    </div>
  );
}
