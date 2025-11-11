import { Box, Text, Icon, VStack, HStack } from "@chakra-ui/react";

// Color scheme configurations
const colorConfig = {
  brand: { bg: "brand.50", iconColor: "brand.500", borderColor: "brand.200" },
  green: { bg: "green.50", iconColor: "green.500", borderColor: "green.200" },
  blue: { bg: "blue.50", iconColor: "blue.500", borderColor: "blue.200" },
  red: { bg: "red.50", iconColor: "red.500", borderColor: "red.200" },
  orange: {
    bg: "orange.50",
    iconColor: "orange.500",
    borderColor: "orange.200",
  },
  purple: {
    bg: "purple.50",
    iconColor: "purple.500",
    borderColor: "purple.200",
  },
  gray: { bg: "gray.50", iconColor: "gray.500", borderColor: "gray.200" },
};

// Trend indicators
const trendConfig = {
  up: { symbol: "↑", color: "green.500" },
  down: { symbol: "↓", color: "red.500" },
  neutral: { symbol: "→", color: "gray.500" },
};

/**
 * StatCard - Display a statistic with icon, label, and value
 *
 * @param {string} label - Stat label/title
 * @param {string|number} value - Stat value to display
 * @param {object} icon - React icon component
 * @param {string} colorScheme - Color theme: 'brand', 'green', 'blue', 'red', 'orange', 'purple' (default: 'brand')
 * @param {string} helpText - Optional help text below value
 * @param {string} trend - Optional trend indicator: 'up', 'down', 'neutral'
 */
const StatCard = ({
  label,
  value,
  icon,
  colorScheme = "brand",
  helpText,
  trend,
}) => {
  const colors = colorConfig[colorScheme] || colorConfig.brand;

  return (
    <Box
      bg="white"
      borderRadius="lg"
      borderWidth="1px"
      borderColor={colors.borderColor}
      p={5}
      transition="all 0.2s"
      _hover={{
        shadow: "md",
        transform: "translateY(-2px)",
      }}
    >
      <HStack justify="space-between" align="start">
        <VStack align="start" gap={1} flex={1}>
          {/* Label */}
          <Text fontSize="sm" fontWeight="medium" color="gray.600">
            {label}
          </Text>

          <HStack align="baseline">
            <Text fontSize="3xl" fontWeight="bold" color="gray.800">
              {value}
            </Text>
            {trend && (
              <Text
                fontSize="sm"
                fontWeight="semibold"
                color={trendConfig[trend].color}
              >
                {trendConfig[trend].symbol}
              </Text>
            )}
          </HStack>

          {helpText && (
            <Text fontSize="sx" color="gray.500">
              {helpText}
            </Text>
          )}
        </VStack>

        {icon && (
          <Box bg={colors.bg} p={3} borderRadius="lg">
            <Icon as={icon} boxSize={6} color={colors.iconColor} />
          </Box>
        )}
      </HStack>
    </Box>
  );
};

export default StatCard;
