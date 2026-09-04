import { Image, Text } from "react-native";
import { CleanView as View } from "@/components/CleanView";
import { colors, fonts, spacing } from "@/theme";
export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <View
      style={{ alignItems: "center", gap: compact ? spacing.xs : spacing.sm }}
    >
      <Image
        source={require("@/assets/images/logo.png")}
        accessibilityLabel="Logo de Rumbo Fit"
        style={{ width: compact ? 66 : 94, height: compact ? 66 : 94 }}
        resizeMode="contain"
      />
      <Text
        style={{
          color: colors.deepBlue,
          fontFamily: fonts.display,
          fontSize: compact ? 23 : 29,
        }}
      >
        Rumbo Fit
      </Text>
      {!compact && (
        <Text
          style={{ color: colors.muted, fontFamily: fonts.body, fontSize: 15 }}
        >
          Tu progreso, en un solo lugar.
        </Text>
      )}
    </View>
  );
}
