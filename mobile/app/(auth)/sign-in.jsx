import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// import { Image } from "expo-image";
import { Image } from "react-native";
import React from "react";
import { authStyles } from "../../assets/styles/auth.style";
import { COLORS } from "../../constants/colors";

const SignInScreen = () => {
  const router = useRouter();

  const { signIn, setActive, isLoaded } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!isLoaded) return;

    setLoading(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
      } else {
        Alert.alert("Error", "Sign in failed. Please try again.");
        console.warn(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      Alert.alert("Error", err.errors?.[0]?.message || "Sign in failed");
      console.warn(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={authStyles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={authStyles.imageContainer}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={authStyles.image}
              resizeMode="contain"
            />
          </View>

          <Text style={authStyles.title}>Welcome Back</Text>
          <Text style={authStyles.subtitle}>Sign in to continue your culinary journey</Text>

          {/* FORM CONTAINER */}
          <View style={authStyles.formContainer}>
            {/* Email Input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter email"
                placeholderTextColor={COLORS.textLight}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* PASSWORD INPUT */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter password"
                placeholderTextColor={COLORS.textLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={authStyles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={COLORS.textLight}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                authStyles.authButton,
                loading && authStyles.buttonDisabled,
              ]}
              onPress={handleSignIn}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}>
                {loading ? "Signing In..." : "Sign In"}
              </Text>
            </TouchableOpacity>

            {/* Separator */}
            <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 20 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
              <Text style={{ marginHorizontal: 10, color: COLORS.textLight, fontFamily: "Inter_400Regular" }}>or continue with</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
            </View>

            {/* Social Buttons */}
            <View style={{ flexDirection: "row", gap: 16, marginBottom: 30 }}>
              <TouchableOpacity style={{ flex: 1, height: 56, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, justifyContent: "center", alignItems: "center", flexDirection: "row", gap: 8 }}>
                <Ionicons name="logo-google" size={20} color={COLORS.text} />
                <Text style={{ fontFamily: "Inter_600SemiBold", color: COLORS.text }}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flex: 1, height: 56, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, justifyContent: "center", alignItems: "center", flexDirection: "row", gap: 8 }}>
                <Ionicons name="logo-apple" size={22} color={COLORS.text} />
                <Text style={{ fontFamily: "Inter_600SemiBold", color: COLORS.text }}>Apple</Text>
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <TouchableOpacity
              style={authStyles.linkContainer}
              onPress={() => router.push("/(auth)/sign-up")}
            >
              <Text style={authStyles.linkText}>
                Don&apos;t have an account?{" "}
                <Text style={authStyles.link}>Sign up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
export default SignInScreen;
