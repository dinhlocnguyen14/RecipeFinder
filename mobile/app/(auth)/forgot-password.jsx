import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { authStyles } from "../../assets/styles/auth.styles";
import { forgotPasswordStyles } from "../../assets/styles/forgot-password.styles";
import { COLORS } from "../../constants/colors";
import { useToast } from "../../hooks/useToast";

const STEP = {
  EMAIL: "email", // Bước 1: Nhập email
  OTP: "otp", // Bước 2: Nhập mã OTP
  NEW_PASSWORD: "new_password", // Bước 3: Nhập mật khẩu mới
  SUCCESS: "success", // Bước 4: Thành công
};

const ForgotPasswordScreen = () => {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { showToast, ToastComponent } = useToast();
  const [step, setStep] = useState(STEP.EMAIL);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ── BƯỚC 1: Gửi mã OTP đến email ──
  const handleSendCode = async () => {
    if (!email.trim()) {
      showToast("Please enter your email so we can help ", "warning");
      return;
    }
    if (!isLoaded) return;

    setLoading(true);
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email.trim(),
      });
      setStep(STEP.OTP);
    } catch (err) {
      const errCode = err.errors?.[0]?.code;
      if (errCode === "form_identifier_not_found") {
        showToast("We couldn't find an account with that email", "error");
      } else {
        showToast(
          err.errors?.[0]?.message ||
            "Something went wrong. Please try sending the code again",
          "error",
        );
      }
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  // ── BƯỚC 2: Xác nhận mã OTP (kiểm tra format rồi chuyển bước) ──
  const handleVerifyCode = () => {
    if (!code.trim()) {
      showToast("Don't forget to enter the code! ", "warning");
      return;
    }
    if (code.trim().length < 6) {
      showToast("The code should be exactly 6 digits ", "warning");
      return;
    }
    setStep(STEP.NEW_PASSWORD);
  };

  // ── BƯỚC 3: Đặt mật khẩu mới (gửi cả OTP + password cùng lúc) ──
  const handleResetPassword = async () => {
    if (!newPassword) {
      showToast("Almost there! Please enter a new password ", "warning");
      return;
    }
    if (newPassword.length < 8) {
      showToast("Let's make it secure (min 8 chars) ", "warning");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Wait, those passwords don't match! ", "warning");
      return;
    }
    if (!isLoaded) return;

    setLoading(true);
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: code.trim(),
        password: newPassword,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        setStep(STEP.SUCCESS);
      } else {
        showToast("Reset failed. Let's try one more time ", "error");
        console.error(JSON.stringify(result, null, 2));
      }
    } catch (err) {
      const errCode = err.errors?.[0]?.code;

      if (
        errCode === "form_code_incorrect" ||
        errCode === "verification_failed" ||
        errCode === "incorrect_code"
      ) {
        showToast("That code didn't work. Let's try a fresh one ", "error");
        setTimeout(() => setStep(STEP.OTP), 1800);
      } else {
        showToast(
          err.errors?.[0]?.message || "Password reset failed.",
          "error",
        );
      }
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  // ── Helper: Nút Back theo từng bước ──
  const handleBack = () => {
    if (step === STEP.OTP) {
      setCode("");
      setStep(STEP.EMAIL);
    } else if (step === STEP.NEW_PASSWORD) {
      setStep(STEP.OTP);
    } else {
      router.back();
    }
  };

  // ── STEP SUCCESS ──
  if (step === STEP.SUCCESS) {
    return (
      <View style={authStyles.container}>
        <View style={forgotPasswordStyles.successContainer}>
          <View style={forgotPasswordStyles.successIcon}>
            <Ionicons
              name="checkmark-circle"
              size={80}
              color={COLORS.primary}
            />
          </View>
          <Text style={forgotPasswordStyles.successTitle}>Password Reset!</Text>
          <Text style={forgotPasswordStyles.successSubtitle}>
            Your password has been successfully updated.{"\n"}You are now signed
            in.
          </Text>
          <TouchableOpacity
            style={[authStyles.authButton, forgotPasswordStyles.successButton]}
            onPress={() => router.replace("/(tabs)")}
            activeOpacity={0.8}
          >
            <Text style={authStyles.buttonText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={authStyles.container}>
      {ToastComponent}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={authStyles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Nút Back */}
          <TouchableOpacity
            style={forgotPasswordStyles.backButton}
            onPress={handleBack}
          >
            <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
            <Text style={forgotPasswordStyles.backText}>Back</Text>
          </TouchableOpacity>

          {/* Step indicator */}
          <View style={forgotPasswordStyles.stepIndicator}>
            {[STEP.EMAIL, STEP.OTP, STEP.NEW_PASSWORD].map((s, idx) => (
              <View key={s} style={forgotPasswordStyles.stepRow}>
                <View
                  style={[
                    forgotPasswordStyles.stepDot,
                    step === s && forgotPasswordStyles.stepDotActive,
                    (step === STEP.OTP && idx === 0) ||
                    (step === STEP.NEW_PASSWORD && idx <= 1)
                      ? forgotPasswordStyles.stepDotDone
                      : null,
                  ]}
                >
                  {(step === STEP.OTP && idx === 0) ||
                  (step === STEP.NEW_PASSWORD && idx <= 1) ? (
                    <Ionicons name="checkmark" size={12} color={COLORS.white} />
                  ) : (
                    <Text style={forgotPasswordStyles.stepNumber}>
                      {idx + 1}
                    </Text>
                  )}
                </View>
                {idx < 2 && <View style={forgotPasswordStyles.stepLine} />}
              </View>
            ))}
          </View>

          {/* Image */}
          <View style={authStyles.imageContainer}>
            <Image
              source={require("../../assets/images/i1.png")}
              style={authStyles.image}
              contentFit="contain"
            />
          </View>

          {/* ── BƯỚC 1: NHẬP EMAIL ── */}
          {step === STEP.EMAIL && (
            <>
              <Text style={authStyles.title}>Forgot Password?</Text>
              <Text style={authStyles.subtitle}>
                Enter your email and we'll send you a reset code
              </Text>

              <View style={authStyles.formContainer}>
                <View style={authStyles.inputContainer}>
                  <TextInput
                    style={authStyles.textInput}
                    placeholder="Enter your email"
                    placeholderTextColor={COLORS.textLight}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>

                <TouchableOpacity
                  style={[
                    authStyles.authButton,
                    loading && authStyles.buttonDisabled,
                  ]}
                  onPress={handleSendCode}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <Text style={authStyles.buttonText}>
                    {loading ? "Sending..." : "Send Reset Code"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={authStyles.linkContainer}
                  onPress={() => router.back()}
                >
                  <Text style={authStyles.linkText}>
                    Remember your password?{" "}
                    <Text style={authStyles.link}>Sign In</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* ── BƯỚC 2: NHẬP OTP ── */}
          {step === STEP.OTP && (
            <>
              <Text style={authStyles.title}>Enter Code</Text>
              <Text style={authStyles.subtitle}>
                We sent a 6-digit code to{"\n"}
                <Text style={forgotPasswordStyles.emailHighlight}>{email}</Text>
              </Text>

              <View style={authStyles.formContainer}>
                <View style={authStyles.inputContainer}>
                  <TextInput
                    style={[
                      authStyles.textInput,
                      forgotPasswordStyles.codeInput,
                    ]}
                    placeholder="● ● ● ● ● ●"
                    placeholderTextColor={COLORS.textLight}
                    value={code}
                    onChangeText={setCode}
                    keyboardType="number-pad"
                    autoCapitalize="none"
                    maxLength={6}
                  />
                </View>

                <TouchableOpacity
                  style={authStyles.authButton}
                  onPress={handleVerifyCode}
                  activeOpacity={0.8}
                >
                  <Text style={authStyles.buttonText}>Verify Code</Text>
                </TouchableOpacity>

                {/* Resend code */}
                <TouchableOpacity
                  style={authStyles.linkContainer}
                  onPress={() => {
                    setCode("");
                    handleSendCode();
                  }}
                >
                  <Text style={authStyles.linkText}>
                    Didn't receive a code?{" "}
                    <Text style={authStyles.link}>Resend</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* ── BƯỚC 3: NHẬP MẬT KHẨU MỚI ── */}
          {step === STEP.NEW_PASSWORD && (
            <>
              <Text style={authStyles.title}>New Password</Text>
              <Text style={authStyles.subtitle}>
                Create a strong new password{"\n"}for your account
              </Text>

              <View style={authStyles.formContainer}>
                {/* New Password */}
                <View style={authStyles.inputContainer}>
                  <TextInput
                    style={authStyles.textInput}
                    placeholder="New password (min. 8 characters)"
                    placeholderTextColor={COLORS.textLight}
                    value={newPassword}
                    onChangeText={setNewPassword}
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

                {/* Confirm Password */}
                <View style={authStyles.inputContainer}>
                  <TextInput
                    style={authStyles.textInput}
                    placeholder="Confirm new password"
                    placeholderTextColor={COLORS.textLight}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={authStyles.eyeButton}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Ionicons
                      name={
                        showConfirmPassword ? "eye-outline" : "eye-off-outline"
                      }
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
                  onPress={handleResetPassword}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <Text style={authStyles.buttonText}>
                    {loading ? "Resetting..." : "Reset Password"}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ForgotPasswordScreen;
