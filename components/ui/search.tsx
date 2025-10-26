import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import React from "react";
import Form from "next/form";
import { useDebouncedCallback } from "use-debounce";

interface Props {
  search: string | null;
  setSearch: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function Search({ search, setSearch }: Props) {
  const handleSearch = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    500,
  );
  return (
    <div className="flex px-2 items-center space-x-2 rounded-md">
      {/*<SearchIcon />*/}
      <Input
        placeholder={"Search"}
        onChange={handleSearch}
        className="bg-none outline-none border-none"
      />
    </div>
  );
}
