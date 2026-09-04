import { forwardRef, useState } from "react";
import { Pressable, Text, TextInput, type TextInputProps } from "react-native";
import { CleanView as View } from "@/components/CleanView";
import { colors, fonts, radius, spacing } from "@/theme";
export const FormField = forwardRef<
  TextInput,
  TextInputProps & { label: string; error?: string; password?: boolean }
>(({ label, error, password, style, ...props }, ref) => {
  const [visible, setVisible] = useState(false);
  return (
    <View style={{ gap: spacing.xs }}>
      <Text
        style={{
          color: colors.graphite,
          fontFamily: fonts.medium,
          fontSize: 14,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: error ? colors.danger : colors.border,
          borderRadius: radius.sm,
          backgroundColor: colors.white,
        }}
      >
        <TextInput
          ref={ref}
          {...props}
          secureTextEntry={password && !visible}
          placeholderTextColor="#9AA1AE"
          style={[
            {
              flex: 1,
              minHeight: 52,
              paddingHorizontal: spacing.md,
              color: colors.graphite,
              fontFamily: fonts.body,
              fontSize: 16,
            },
            style,
          ]}
          accessibilityLabel={label}
        />
        {password && (
          <Pressable
            onPress={() => setVisible((value) => !value)}
            hitSlop={10}
            accessibilityLabel={
              visible ? "Ocultar contraseña" : "Mostrar contraseña"
            }
          >
            <Text
              style={{
                color: colors.deepBlue,
                fontFamily: fonts.medium,
                paddingRight: spacing.md,
              }}
            >
              {visible ? "Ocultar" : "Mostrar"}
            </Text>
          </Pressable>
        )}
      </View>
      {error && (
        <Text
          style={{ color: colors.danger, fontFamily: fonts.body, fontSize: 13 }}
        >
          {error}
        </Text>
      )}
    </View>
  );
});
FormField.displayName = "FormField";
