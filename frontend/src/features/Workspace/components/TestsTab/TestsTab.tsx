import { useTests } from "@/api/hooks/problems";
import { useWorkspaceStore } from "../../store";
import { motion } from "framer-motion";

import {
  Accordion,
} from "@/components/ui/accordion";
import { TestItem } from "./TestItem";
import { LoaderCircle } from "lucide-react";
import { EmptyTemplate } from "../EditorContainer/EmptyTemplate";
import { playTab } from "@/lib/sounds";
import { useSoundStore } from "@/stores/useSoundStore";

export function TestsTab() {
  const submissionResults = useWorkspaceStore((state) => state.submissionResults);
  const problem = useWorkspaceStore((state) => state.problem);
  const setupId = useWorkspaceStore((state) => state.setup?.id);
  const { data: tests, isLoading } = useTests(problem?.id!, setupId!);

  if (!setupId) return <EmptyTemplate />;

  if (isLoading) return (
    <div className="flex items-center justify-center gap-2 py-16 text-bb-muted-strong">
      <LoaderCircle size={14} className="animate-spin" aria-hidden="true" />
      <span className="font-mono text-[10px] uppercase tracking-[0.18em]">Loading test cases…</span>
    </div>
  );
  if (!tests || !tests.testcases.length) return (
    <div className="flex items-center justify-center py-16 text-bb-muted-strong">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em]">No test cases available</span>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <Accordion type="multiple" onValueChange={() => { if (useSoundStore.getState().enabled) playTab(); }} className="p-4 space-y-2 overflow-y-auto">
        {tests.testcases.map((testcase: any, index: any) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.16, delay: index * 0.05, ease: "easeOut" }}
          >
            <TestItem testcase={testcase} index={index} results={submissionResults?.testcases?.[index]} />
          </motion.div>
        ))}
      </Accordion>
    </div>
  );
}
