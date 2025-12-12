import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { capitalize } from "@/utils";
import { Search } from "lucide-react";

export type AlertSeverityFilter = "ALL" | "INFO" | "WARN" | "CRITICAL";

interface AlertsFilterBarProps {
  severity: AlertSeverityFilter;
  onChangeSeverity: (value: AlertSeverityFilter) => void;
  searchQuery: string;
  onChangeSearch: (value: string) => void;
  totalCount: number;
  filteredCount: number;
}

const severityOptions: AlertSeverityFilter[] = [
  "ALL",
  "INFO",
  "WARN",
  "CRITICAL",
];

export function AlertsFilterBar({
  severity,
  onChangeSeverity,
  onChangeSearch,
  filteredCount,
}: AlertsFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
      <Tabs
        value={severity}
        onValueChange={(value) =>
          onChangeSeverity(value as AlertSeverityFilter)
        }
      >
        <TabsList>
          {severityOptions.map((option) => (
            <TabsTrigger
              className="px-6 hover:cursor-pointer"
              key={option}
              value={option}
            >
              {capitalize(option)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <InputGroup className="w-96">
        <InputGroupInput
          placeholder="Search by type or message"
          onChange={(e) => onChangeSearch(e.target.value)}
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          {filteredCount} result{filteredCount === 1 ? "" : "s"}
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
