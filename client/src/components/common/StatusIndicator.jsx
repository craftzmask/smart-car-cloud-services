import { Box, HStack, Text } from "@chakra-ui/react";

const statusConfig = {
  online: { color: "green.500", bg: "green.100", label: "Online" },
  offline: { color: "gray.400", bg: "gray.100", label: "Offline" },
  active: { color: "green.500", bg: "green.100", label: "Active" },
  inactive: { color: "gray.400", bg: "gray.100", label: "Inactive" },
  warning: { color: "orange.500", bg: "orange.100", label: "Warning" },
  error: { color: "red.500", bg: "red.100", label: "Error" },
  connected: { color: "blue.500", bg: "blue.100", label: "Connected" },
  disconnected: { color: "red.500", bg: "red.100", label: "Disconnected" },
};

const sizeConfig = {
  sm: { dotSize: "8px", fontSize: "xs", spacing: 1.5 },
  md: { dotSize: "10px", fontSize: "sm", spacing: 2 },
  lg: { dotSize: "12px", fontSize: "md", spacing: 2.5 },
};

/**
 * StatusIndicator - Display status with colored dot and label
 *
 * @param {string} status - Status type: 'online', 'offline', 'active', 'inactive', 'warning', 'error'
 * @param {string} label - Optional custom label (defaults to status)
 * @param {string} size - Size of the indicator: 'sm', 'md', 'lg' (default: 'md')
 */
const StatusIndicator = ({ status = "offline", label, size = "md" }) => {
  const config = statusConfig[status] || statusConfig.offline;
  const sizeStyles = sizeConfig[size];

  return (
    <HStack gap={sizeStyles.spacing}>
      {/* Pulsing dot indicator */}
      <Box
        position="relative"
        width={sizeStyles.dotSize}
        height={sizeStyles.dotSize}
      >
        {/* Background pulse effect for active statuses */}
        {(status === "online" ||
          status === "active" ||
          status === "connected") && (
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            width="100%"
            height="100%"
            borderRadius="full"
            bg={config.bg}
            animation="pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
            css={{
              "@keyframes pulse": {
                "0%, 100%": { opacity: 1 },
                "50%": { opacity: 0.5 },
              },
            }}
          />
        )}
        {/* Status dot */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          width="100%"
          height="100%"
          borderRadius="full"
          bg={config.color}
        />
      </Box>
      <Text fontSize={sizeStyles.fontSize} fontWeight="medium" color="gray.700">
        {label || config.label}
      </Text>
    </HStack>
  );
};

export default StatusIndicator;
