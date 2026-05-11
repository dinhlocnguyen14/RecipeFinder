import { useSignIn, useAuth, useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import React from "react";
import { authStyles } from "../../assets/styles/auth.styles";
import { COLORS } from "../../constants/colors";
import { useWarmUpBrowser } from "../../hooks/useWarmUpBrowser";
import { useToast } from "../../hooks/useToast";
import {
  getRecentAccounts,
  removeAccountFromRecent,
} from "../../utils/accountStorage";

WebBrowser.maybeCompleteAuthSession();

const RECENT_ACCOUNTS_KEY = "recent_accounts_list";

const SignInScreen = () => {
  useWarmUpBrowser();
  const router = useRouter();
  const { showToast, ToastComponent } = useToast();

  const { signIn, setActive, isLoaded } = useSignIn();
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

  const [recentAccounts, setRecentAccounts] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // NOTE: Không cần useEffect redirect ở đây, InitialLayout trong _layout.jsx sẽ tự redirect

  // Load recent accounts từ SecureStore
  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    const accounts = await getRecentAccounts();
    setRecentAccounts(accounts);

    if (accounts.length === 0) {
      // Không có tài khoản nào → hiện form trống
      setShowForm(true);
    } else if (accounts.length === 1) {
      // Đúng 1 tài khoản đã đăng xuất → auto-fill email, hiện form luôn
      setEmail(accounts[0].email);
      setShowForm(true);
    } else {
      // 2+ tài khoản → hiện màn chọn tài khoản
      setShowForm(false);
    }
  };

  const removeAccount = async (id) => {
    const updated = await removeAccountFromRecent(id);
    setRecentAccounts(updated);
    if (updated.length === 0) setShowForm(true);
    else if (updated.length === 1) {
      setEmail(updated[0].email);
      setShowForm(true);
    }
  };

  const handleRecentAccountPress = (account) => {
    setEmail(account.email);
    setShowForm(true);
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      showToast("Please enter your email and password ", "warning");
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
        // InitialLayout sẽ tự navigate sau khi isSignedIn thay đổi
      } else {
        showToast("Oops! Sign in failed. Let's try again ", "error");
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      if (
        err.errors?.[0]?.code === "session_exists" ||
        err.message?.includes("already signed in")
      ) {
        return;
      }
      const errCode = err.errors?.[0]?.code;
      if (errCode === "form_password_incorrect") {
        showToast("Wait, that's the wrong password! Try again ", "error");
      } else if (errCode === "form_identifier_not_found") {
        showToast("We couldn't find an account with that email ", "error");
      } else {
        showToast(err.errors?.[0]?.message || "Sign in failed.", "error");
      }
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const onSocialSignInPress = useCallback(
    async (strategy) => {
      try {
        const { startOAuthFlow } =
          strategy === "google"
            ? { startOAuthFlow: startGoogleFlow }
            : { startOAuthFlow: startAppleFlow };

        const { createdSessionId, setActive: setOAuthActive } =
          await startOAuthFlow({
            redirectUrl: Linking.createURL("/", { scheme: "mobile" }),
          });

        if (createdSessionId && setOAuthActive) {
          await setOAuthActive({ session: createdSessionId });
          // InitialLayout sẽ tự navigate
        }
      } catch (err) {
        //  đã đăng nhập rồi thì chuyển thẳng vào home
        if (
          err.errors?.[0]?.code === "already_signed_in" ||
          err.message?.includes("already signed in")
        ) {
          return;
        }
        console.error("OAuth error", err);
        showToast(
          `Social login didn't work this time. Please try again `,
          "error",
        );
      }
    },
    [startGoogleFlow, startAppleFlow, isSignedIn, router],
  );

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
        >
          <View style={authStyles.imageContainer}>
            <Image
              source={require("../../assets/images/i1.png")}
              style={authStyles.image}
              resizeMode="contain"
            />
          </View>

          <Text style={authStyles.title}>Welcome </Text>

          {/* RECENT ACCOUNTS SWITCHER */}
          {!showForm && recentAccounts.length > 0 && (
            <View>
              <View style={authStyles.recentHeader}>
                <Text style={authStyles.recentTitle}>Recent Accounts</Text>
                <TouchableOpacity onPress={() => setShowForm(true)}>
                  <Text style={{ color: COLORS.primary, fontWeight: "600" }}>
                    Edit
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={authStyles.recentList}
              >
                {recentAccounts.map((account) => (
                  <TouchableOpacity
                    key={account.id}
                    style={authStyles.accountCard}
                    onPress={() => handleRecentAccountPress(account)}
                  >
                    <TouchableOpacity
                      style={authStyles.removeAccount}
                      onPress={() => removeAccount(account.id)}
                    >
                      <Ionicons
                        name="close-circle"
                        size={20}
                        color={COLORS.textLight}
                      />
                    </TouchableOpacity>
                    <Image
                      source={{ uri: account.imageUrl }}
                      style={authStyles.recentAvatar}
                    />
                    <Text style={authStyles.recentName} numberOfLines={1}>
                      {account.fullName}
                    </Text>
                    <Text style={authStyles.recentEmail} numberOfLines={1}>
                      {account.email}
                    </Text>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  style={[authStyles.accountCard, authStyles.addAccountCard]}
                  onPress={() => setShowForm(true)}
                >
                  <Ionicons name="add" size={32} color={COLORS.textLight} />
                  <Text style={authStyles.addAccountText}>Add Account</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          )}

          {/* FORM CONTAINER */}
          {(showForm || recentAccounts.length === 0) && (
            <View style={authStyles.formContainer}>
              {recentAccounts.length > 0 && (
                <TouchableOpacity
                  style={{
                    marginBottom: 20,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  onPress={() => setShowForm(false)}
                >
                  <Ionicons
                    name="arrow-back"
                    size={20}
                    color={COLORS.primary}
                  />
                  <Text
                    style={{
                      color: COLORS.primary,
                      fontWeight: "600",
                      marginLeft: 8,
                    }}
                  >
                    Back to accounts
                  </Text>
                </TouchableOpacity>
              )}

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

              {/* FORGOT PASSWORD LINK */}
              <TouchableOpacity
                style={{ alignSelf: "flex-end", marginBottom: 4 }}
                onPress={() => router.push("/(auth)/forgot-password")}
              >
                <Text
                  style={{
                    color: COLORS.primary,
                    fontWeight: "600",
                    fontSize: 14,
                  }}
                >
                  Forgot Password?
                </Text>
              </TouchableOpacity>

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
                  onPress={() => onSocialSignInPress("google")}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="logo-google"
                    size={24}
                    color={COLORS.primary}
                  />
                  <Text style={authStyles.socialButtonText}>Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={authStyles.socialButton}
                  onPress={() => onSocialSignInPress("apple")}
                  activeOpacity={0.7}
                >
                  <Ionicons name="logo-apple" size={24} color={COLORS.text} />
                  <Text style={authStyles.socialButtonText}>Apple</Text>
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
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignInScreen;
