import { Badge } from "@/global/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/global/components/ui/tooltip";

export function FilterSummaryChips({
  selectedCategories,
  selectedRegions,
  selectedSkills,
  namesById, // (id:number)=>string 맵 함수
}: {
  selectedCategories: number[];
  selectedRegions: number[];
  selectedSkills: number[];
  namesById: (id: number) => string;
}) {
  const renderChip = (label: string, ids: number[]) => {
    if (!ids.length) return null;
    const list = ids.map(namesById).filter(Boolean);
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="secondary" className="cursor-default">
              {label} {ids.length}
            </Badge>
          </TooltipTrigger>
          <TooltipContent className="max-w-80">
            <div className="text-xs leading-5 whitespace-pre-wrap">
              {list.join(", ")}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {renderChip("카테고리", selectedCategories)}
      {renderChip("지역", selectedRegions)}
      {renderChip("스킬", selectedSkills)}
    </div>
  );
}
