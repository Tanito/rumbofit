import { PropsWithChildren } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CleanView as View } from "@/components/CleanView";
import { colors, spacing } from "@/theme";
export function AuthLayout({ children }: PropsWithChildren) {
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.warmWhite },
  flex: { flex: 1 },
  content: { flexGrow: 1, padding: spacing.lg, justifyContent: "center" },
  card: { width: "100%", maxWidth: 460, alignSelf: "center" },
});
