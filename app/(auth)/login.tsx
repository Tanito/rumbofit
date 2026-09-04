import { useRouter } from "expo-router";
import { useState } from "react";
import { Platform, Pressable, Text } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthButton } from "@/components/AuthButton";
import { AuthLayout } from "@/components/AuthLayout";
import { Brand } from "@/components/Brand";
import { CleanView as View } from "@/components/CleanView";
import { FormField } from "@/components/FormField";
import { useAuth } from "@/context/AuthContext";
import { colors, fonts, spacing } from "@/theme";
import { loginSchema, type LoginValues } from "@/validation/auth";

export default function LoginScreen() {
  const router = useRouter();
  const { signInWithEmail, signInWithGoogle, signInWithApple } = useAuth();
  const [socialLoading, setSocialLoading] = useState("");
  const [serverError, setServerError] = useState("");
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const submit = async (values: LoginValues) => {
    setServerError("");
    const result = await signInWithEmail(values.email, values.password);
    if (!result.ok) setServerError(result.message);
  };
  const social = async (kind: "google" | "apple") => {
    setServerError("");
    setSocialLoading(kind);
    const result =
      kind === "google" ? await signInWithGoogle() : await signInWithApple();
    setSocialLoading("");
    if (!result.ok && !result.cancelled) setServerError(result.message);
  };
  const appleButton =
    Platform.OS === "ios" ? (
      <AuthButton
        title="Continuar con Apple"
        variant="apple"
        loading={socialLoading === "apple"}
        onPress={() => social("apple")}
      />
    ) : null;

  return (
    <AuthLayout>
      <Brand />
      <View style={{ gap: spacing.md, marginTop: spacing.xl }}>
        <AuthButton
          title="Continuar con Google"
          variant="google"
          loading={socialLoading === "google"}
          onPress={() => social("google")}
        />
        {appleButton}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.sm,
            marginVertical: spacing.xs,
          }}
        >
          <View
            style={{ flex: 1, height: 1, backgroundColor: colors.border }}
          />
          <Text
            style={{
              color: colors.muted,
              fontFamily: fonts.body,
              fontSize: 13,
            }}
          >
            o continuá con tu email
          </Text>
          <View
            style={{ flex: 1, height: 1, backgroundColor: colors.border }}
          />
        </View>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label="Email"
              placeholder="tu@email.com"
              autoCapitalize="none"
              keyboardType="email-address"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.email?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label="Contraseña"
              placeholder="Tu contraseña"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.password?.message}
              password
            />
          )}
        />
        {serverError && (
          <Text style={{ color: colors.danger, fontFamily: fonts.body }}>
            {serverError}
          </Text>
        )}
        <AuthButton
          title="Iniciar sesión"
          loading={isSubmitting}
          onPress={handleSubmit(submit)}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Text style={{ color: colors.muted, fontFamily: fonts.body }}>
            ¿Todavía no tenés una cuenta?{" "}
          </Text>
          <Pressable
            onPress={() => router.push("/(auth)/register")}
            accessibilityRole="link"
          >
            <Text style={{ color: colors.orange, fontFamily: fonts.medium }}>
              Crear cuenta
            </Text>
          </Pressable>
        </View>
        <Text
          style={{
            color: colors.muted,
            fontFamily: fonts.body,
            fontSize: 12,
            lineHeight: 18,
            textAlign: "center",
            marginTop: spacing.md,
          }}
        >
          Tus comidas, entrenamientos y medidas permanecerán en tu dispositivo.
        </Text>
      </View>
    </AuthLayout>
  );
}
