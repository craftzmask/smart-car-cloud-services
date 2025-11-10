import { Badge } from "@chakra-ui/react";

const severityConfig = {
  critical: {
    colorScheme: "red",
    label: "Critical",
  },
  high: {
    colorScheme: "orange",
    label: "High",
  },
  medium: {
    colorScheme: "yellow",
    label: "Medium",
  },
  low: {
    colorScheme: "blue",
    label: "Low",
  },
  info: {
    colorScheme: "gray",
    label: "Info",
  },
};

/**
 * AlertBadge - Display alert severity with appropriate color
 *
 * @param {string} severity - Alert severity: 'critical', 'high', 'medium', 'low', 'info'
 * @param {string} size - Badge size: 'sm', 'md', 'lg' (default: 'md')
 * @param {string} variant - Badge variant: 'solid', 'subtle', 'outline' (default: 'subtle')
 */
const AlertBadge = ({ severity = "info", size = "md", variant = "subtle" }) => {
  const config = severityConfig[severity] || severityConfig.info;

  return (
    <Badge
      colorScheme={config.colorScheme}
      variant={variant}
      size={size}
      textTransform="capitalize"
      fontWeight="semibold"
    >
      {config.label}
    </Badge>
  );
};

export default AlertBadge;
