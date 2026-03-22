// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "paperplane": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "figure.run": "directions-run",
  "heart.fill": "favorite",
  "moon.fill": "nightlight",
  "person.fill": "person",
  "faceid": "fingerprint",
  "delete.left.fill": "backspace",
  "sparkles": "auto-awesome",
  "plus": "add",
  "calendar": "calendar-today",
  "chart.bar.fill": "bar-chart",
  "location.fill": "location-on",
  "clock.fill": "access-time",
  "flame.fill": "local-fire-department",
  "bolt.fill": "flash-on",
  "scale": "monitor-weight",
  "bed.double.fill": "hotel",
  "stethoscope": "medical-services",
  "message.fill": "message",
  "arrow.right": "arrow-forward",
  "arrow.left": "arrow-back",
  "checkmark": "check",
  "checkmark.circle.fill": "check-circle",
  "xmark": "close",
  "gear": "settings",
  "square.and.arrow.up": "share",
  "trash": "delete",
  "trash.fill": "delete",
  "pencil": "edit",
  "gearshape.fill": "settings",
  "scissors": "content-cut",
  "camera.fill": "camera-alt",
  "mic.fill": "mic",
  "video.fill": "videocam",
  "arrow.down.circle.fill": "download",
  "lock.fill": "lock",
  "lock.shield.fill": "shield",
  "chart.line.uptrend.xyaxis": "trending-up",
  "repeat": "repeat",
  "magnifyingglass": "search",
  "plus.circle.fill": "add-circle",
  "list.bullet": "list",
  "tag.fill": "label",
  "arrow.clockwise": "refresh",
  "person.2.fill": "people",
  "star.fill": "star",
  "trophy.fill": "emoji-events",
  "barcode.viewfinder": "qr-code-scanner",
  "fork.knife.circle": "restaurant",
  "info.circle": "info",
  "info.circle.fill": "info",
  "battery.100": "battery-full",
  "brain.head.profile": "psychology",
  "target": "track-changes",
  "ellipsis": "more-horiz",
  "bubble.left": "chat-bubble",
  "lightbulb.fill": "lightbulb",
  "eye.fill": "visibility",
  "eye.slash.fill": "visibility-off",
  "flag.fill": "flag",
  "figure.stand": "accessibility",
  "calendar.badge.clock": "event",
  "person.badge.clock.fill": "schedule",
  "briefcase.fill": "work",
  "shield.checkered": "verified",
  "person.crop.circle.badge.xmark": "person-off",
  "crown.fill": "workspace-premium",
  "icloud.fill": "cloud",
  "sunrise.fill": "wb-sunny",
  "sun.max.fill": "wb-sunny",
  "moon.stars.fill": "nights-stay",
  "fork.knife": "restaurant-menu",
  "dumbbell.fill": "fitness-center",
  "figure.flexibility": "self-improvement",
  "figure.mind.and.body": "self-improvement",
  "drop.fill": "water-drop",
  "play.fill": "play-arrow",
  "pause.fill": "pause",
  "cart.fill": "shopping-cart",
  "pills.fill": "medication",
  "tshirt.fill": "checkroom",
  "photo.fill": "photo-library",
  "heart": "favorite-border",
  "chevron.left": "chevron-left",
} as Partial<IconMapping>;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  // Fallback para ícones não mapeados
  const iconName = MAPPING[name] || "help-outline";
  return <MaterialIcons color={color} size={size} name={iconName} style={style} />;
}
