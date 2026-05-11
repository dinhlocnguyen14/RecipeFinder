import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useSignUp, useOAuth } from "@clerk/clerk-expo";
import { useAuth } from "@clerk/clerk-expo";
import { useState, useCallback } from "react";
import * as Linking from "expo-linking";
import { authStyles } from "../../assets/styles/auth.styles";
import { Image } from "expo-image";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import VerifyEmail from "./verify-email";
import { useWarmUpBrowser } from "../../hooks/useWarmUpBrowser";
import { useToast } from "../../hooks/useToast";

const SignUpScreen = () => {
  useWarmUpBrowser();
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const { showToast, ToastComponent } = useToast();

  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { startOAuthFlow: startGoogleFlow } = useOAuth({
    strategy: "oauth_google",
  });
  const { startOAuthFlow: startAppleFlow } = useOAuth({
    strategy: "oauth_apple",
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password)
      return showToast("Please fill in all fields to join us ", "warning");
    if (password.length < 6)
      return showToast(
        "A stronger password is better (min 6 chars) ",
        "warning",
      );

    if (!isLoaded) return;

    setLoading(true);

    try {
      await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      const errCode = err.errors?.[0]?.code;
      if (errCode === "form_identifier_exists") {
        showToast(
          "This email is already in our kitchen! Try logging in",
          "error",
        );
      } else {
        showToast(
          err.errors?.[0]?.message ||
            "We couldn't create your account. Let's try once more",
          "error",
        );
      }
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const onSocialSignUpPress = useCallback(
    async (strategy) => {
      if (isSignedIn) {
        // Để InitialLayout tự xử lý redirect
        return;
      }

      try {
        const { startOAuthFlow } =
          strategy === "google"
            ? { startOAuthFlow: startGoogleFlow }
            : { startOAuthFlow: startAppleFlow };

        const { createdSessionId, setActive: setOAuthActive } =
          await startOAuthFlow({
            redirectUrl: Linking.createURL("/", { scheme: "mobile" }),
          });

        if (createdSessionId) {
          await setOAuthActive({ session: createdSessionId });
          // InitialLayout sẽ tự navigate
        }
      } catch (err) {
        if (
          err.errors?.[0]?.code === "already_signed_in" ||
          err.message?.includes("already signed in")
        ) {
          return;
        }
        console.error("OAuth error", err);
        showToast(
          `Social login didn't work this time. Please try again`,
          "error",
        );
      }
    },
    [startGoogleFlow, startAppleFlow, isSignedIn],
  );

  if (pendingVerification)
    return (
      <VerifyEmail email={email} onBack={() => setPendingVerification(false)} />
    );

  return (
    <View style={authStyles.container}>
      {ToastComponent}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        style={authStyles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Image Container */}
          <View style={authStyles.imageContainer}>
            <Image
              source={require("../../assets/images/i2.png")}
              style={authStyles.image}
              contentFit="contain"
            />
          </View>

          <Text style={authStyles.title}>Create Account</Text>

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

            {/* Password Input */}
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

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[
                authStyles.authButton,
                loading && authStyles.buttonDisabled,
              ]}
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}>
                {loading ? "Creating Account..." : "Sign Up"}
              </Text>
            </TouchableOpacity>

            {/* DIVIDER */}
            <View style={authStyles.dividerContainer}>
              <View style={authStyles.dividerLine} />
              <Text style={authStyles.dividerText}>Or continue with</Text>
              <View style={authStyles.dividerLine} />
            </View>

            {/* SOCIAL BUTTONS */}
            <View style={authStyles.socialContainer}>
              <TouchableOpacity
                style={authStyles.socialButton}
                onPress={() => onSocialSignUpPress("google")}
                activeOpacity={0.7}
              >
                <Ionicons name="logo-google" size={24} color={COLORS.primary} />
                <Text style={authStyles.socialButtonText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={authStyles.socialButton}
                onPress={() => onSocialSignUpPress("apple")}
                activeOpacity={0.7}
              >
                <Ionicons name="logo-apple" size={24} color={COLORS.text} />
                <Text style={authStyles.socialButtonText}>Apple</Text>
              </TouchableOpacity>
            </View>

            {/* Sign In Link */}
            <TouchableOpacity
              style={[authStyles.linkContainer, { marginTop: 16 }]}
              onPress={() => router.back()}
            >
              <Text style={authStyles.linkText}>
                Already have an account?{" "}
                <Text style={authStyles.link}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
export default SignUpScreen;
