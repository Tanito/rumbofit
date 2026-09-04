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
import { registerSchema, type RegisterValues } from "@/validation/auth";

export default function RegisterScreen() {
  const router = useRouter();
  const { registerWithEmail, signInWithGoogle, signInWithApple } = useAuth();
  const [socialLoading, setSocialLoading] = useState("");
  const [serverError, setServerError] = useState("");
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });
  const submit = async (values: RegisterValues) => {
    setServerError("");
    const result = await registerWithEmail(
      values.name,
      values.email,
      values.password,
    );
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
        title="Registrarse con Apple"
        variant="apple"
        loading={socialLoading === "apple"}
        onPress={() => social("apple")}
      />
    ) : null;

  return (
    <AuthLayout>
      <Brand compact />
      <Text
        style={{
          color: colors.graphite,
          fontFamily: fonts.display,
          fontSize: 24,
          marginTop: spacing.xl,
        }}
      >
        Crear tu cuenta
      </Text>
      <View style={{ gap: spacing.md, marginTop: spacing.lg }}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label="Nombre"
              placeholder="Tu nombre"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.name?.message}
            />
          )}
        />
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
              placeholder="Mínimo 6 caracteres"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.password?.message}
              password
            />
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label="Confirmar contraseña"
              placeholder="Repetí tu contraseña"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.confirmPassword?.message}
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
          title="Crear cuenta"
          loading={isSubmitting}
          onPress={handleSubmit(submit)}
        />
        <AuthButton
          title="Registrarse con Google"
          variant="google"
          loading={socialLoading === "google"}
          onPress={() => social("google")}
        />
        {appleButton}
        <Text
          style={{
            color: colors.muted,
            fontFamily: fonts.body,
            fontSize: 12,
            lineHeight: 18,
          }}
        >
          Al crear una cuenta, aceptás los Términos de uso y la Política de
          privacidad.
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: spacing.sm,
          }}
        >
          <Text style={{ color: colors.muted, fontFamily: fonts.body }}>
            ¿Ya tenés una cuenta?{" "}
          </Text>
          <Pressable
            onPress={() => router.push("/(auth)/login")}
            accessibilityRole="link"
          >
            <Text style={{ color: colors.orange, fontFamily: fonts.medium }}>
              Ya tengo una cuenta
            </Text>
          </Pressable>
        </View>
      </View>
    </AuthLayout>
  );
}
