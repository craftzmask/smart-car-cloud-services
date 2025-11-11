import React, { useState, useEffect } from "react";
import { Input, InputGroup } from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";

/**
 * SearchBar - Search input with debouncing
 *
 * @param {string} placeholder - Input placeholder text
 * @param {function} onSearch - Callback function when search value changes (debounced)
 * @param {number} debounceMs - Debounce delay in milliseconds (default: 300)
 * @param {string} size - Input size: 'sm', 'md', 'lg' (default: 'md')
 */
const SearchBar = ({
  placeholder = "Search...",
  onSearch,
  debounceMs = 300,
  size = "md",
}) => {
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearch) {
        onSearch(searchValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchValue, debounceMs, onSearch]);

  return (
    <InputGroup size={size} startElement={<FiSearch color="gray" />}>
      <Input
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        bg="white"
        color="gray.800"
        borderColor="gray.300"
        _hover={{ borderColor: "gray.400" }}
        _focus={{
          borderColor: "brand.500",
          boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
        }}
      />
    </InputGroup>
  );
};

export default SearchBar;
