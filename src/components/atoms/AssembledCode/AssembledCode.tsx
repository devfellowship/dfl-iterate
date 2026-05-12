import { title } from "process";

interface AssembledCodeProps {
  assembledCode: string;
  title: string;
}

export function AssembledCode({ assembledCode,title }: AssembledCodeProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
        {title}
      </h3>
      <div className="bg-muted/30 border border-border rounded-lg p-4">
        <pre className="text-sm font-mono text-foreground whitespace-pre-wrap overflow-x-auto">
          {assembledCode}
        </pre>
      </div>
    </div>
  );
}
