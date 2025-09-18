"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface VersionSelectProps {
  versionCount: number;
  selectedVersion: string | null;
  setSelectedVersion: (v: string) => void;
}

export default function VersionSelect({
  versionCount,
  selectedVersion,
  setSelectedVersion,
}: VersionSelectProps) {
  if (versionCount === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No code versions available
      </div>
    );
  }

  return (
    <Select value={selectedVersion || ""} onValueChange={setSelectedVersion}>
      <SelectTrigger className="w-fit">
        {" "}
        {/* adjust width here */}
        <SelectValue placeholder="Select version" />
      </SelectTrigger>
      <SelectContent className="">
        {Array.from({ length: versionCount }).map((_, i) => {
          const version = `v${i + 1}`;
          return (
            <SelectItem key={version} value={version}>
              {version}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
