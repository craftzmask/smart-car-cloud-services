import React from "react";
import { Select, Box, Text } from "@chakra-ui/react";

/**
 * FilterDropdown - Dropdown select for filtering data
 *
 * @param {string} label - Label for the dropdown
 * @param {array} options - Array of options: [{ value: 'val', label: 'Label' }, ...]
 * @param {string} value - Currently selected value
 * @param {function} onChange - Callback when selection changes
 * @param {string} placeholder - Placeholder text (default: 'Select...')
 * @param {string} size - Select size: 'sm', 'md', 'lg' (default: 'md')
 * @param {boolean} showLabel - Whether to show label (default: true)
 */
const FilterDropdown = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select...",
  size = "md",
  showLabel = true,
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <Box>
      {/* Label */}
      {showLabel && label && (
        <Text
          as="label"
          fontSize="sm"
          fontWeight="medium"
          color="gray.700"
          mb={2}
          display="block"
        >
          {label}
        </Text>
      )}

      {/* Select */}
      <Select
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        size={size}
        bg="white"
        borderColor="gray.300"
        _hover={{ borderColor: "gray.400" }}
        _focus={{
          borderColor: "brand.500",
          boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>

      {/* Filtered indicator */}
      {value && value !== "" && (
        <Text fontSize="xs" color="gray.500" mt={1}>
          Filtered
        </Text>
      )}
    </Box>
  );
};

export default FilterDropdown;
