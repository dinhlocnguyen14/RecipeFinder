import { useSignIn } from "@clerk/clerk-expo";
import { useRouter, useLocalSearchParams } from "expo-router";
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
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";
import React from "react";
import { authStyles } from "../../assets/styles/auth.style";
import { COLORS } from "../../constants/colors";

const ResetPasswordScreen = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const { signIn, setActive, isLoaded } = useSignIn();

  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleReset = async () => {
    if (!code || !password) {
      Alert.alert("Error", "Please enter verification code and new password");
      return;
    }

    if (!isLoaded) return;

    setLoading(true);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        setShowSuccessModal(true);
      } else {
        console.warn(result);
        Alert.alert("Error", "Failed to reset password. Please try again.");
      }
    } catch (err) {
      Alert.alert("Error", err.errors?.[0]?.message || "Password reset failed");
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

          <Text style={authStyles.title}>Set New Password</Text>
          <Text style={authStyles.subtitle}>
            Enter the 6-digit code sent to {email}
          </Text>

          <View style={authStyles.formContainer}>
            {/* Code Input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="6-digit verification code"
                placeholderTextColor={COLORS.textLight}
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>

            {/* New Password Input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter new password"
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
                { marginTop: 10 }
              ]}
              onPress={handleReset}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}>
                {loading ? "Resetting..." : "Reset Password"}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={authStyles.linkContainer}
              onPress={() => router.push("/(auth)/sign-in")}
            >
              <Text style={authStyles.linkText}>
                <Text style={authStyles.link}>Back to Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center", padding: 24 }}>
          <View style={{ backgroundColor: COLORS.white, borderRadius: 24, padding: 32, alignItems: "center", width: "100%" }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: "rgba(255, 140, 0, 0.1)", justifyContent: "center", alignItems: "center", marginBottom: 24 }}>
              <Ionicons name="checkmark-circle" size={64} color={COLORS.primary} />
            </View>
            <Text style={{ fontFamily: "Outfit_700Bold", fontSize: 24, color: COLORS.text, marginBottom: 12 }}>Password Changed</Text>
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 16, color: COLORS.textLight, textAlign: "center", marginBottom: 32 }}>
              Your password has been changed successfully.
            </Text>
            
            <TouchableOpacity
              style={[authStyles.authButton, { marginTop: 0 }]}
              onPress={() => {
                setShowSuccessModal(false);
                router.replace("/(tabs)");
              }}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}>Start Cooking</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ResetPasswordScreen;
