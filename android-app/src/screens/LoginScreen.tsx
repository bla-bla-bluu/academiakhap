import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { formStyles } from "../theme/formStyles";
import { COLORS } from "../theme/colors";

const logoClean = require("../../assets/logo_clean.png");

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    if (!email || !password) {
      setError("Enter both email and password.");
      return;
    }
    setSubmitting(true);
    const { error: signInError } = await signIn(email.trim(), password);
    setSubmitting(false);
    if (signInError) setError(signInError);
  };

  return (
    <KeyboardAvoidingView
      style={formStyles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={[formStyles.scrollContent, { flexGrow: 1, justifyContent: "center" }]}>
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <Image source={logoClean} style={{ width: 72, height: 72, marginBottom: 12 }} resizeMode="contain" />
          <Text style={formStyles.title}>Member & Admin Login</Text>
          <Text style={[formStyles.subtitle, { textAlign: "center" }]}>
            Accounts are created by an Academia Khap admin. Contact academiakhap@gmail.com if you
            need access.
          </Text>
        </View>

        <View style={formStyles.card}>
          <Text style={formStyles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="you@email.com"
            placeholderTextColor={COLORS.mutedBrown}
            style={formStyles.input}
          />

          <Text style={formStyles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor={COLORS.mutedBrown}
            style={formStyles.input}
          />

          {error ? <Text style={formStyles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[formStyles.button, submitting && formStyles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
            activeOpacity={0.85}
          >
            {submitting ? <ActivityIndicator color={COLORS.white} /> : <Text style={formStyles.buttonText}>Log In</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
