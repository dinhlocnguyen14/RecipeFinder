import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../../constants/colors.js";

const { height } = Dimensions.get("window");

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 45,
    paddingBottom: 20,
  },
  imageContainer: {
    height: height * 0.25,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 240,
    height: 240,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: 20,
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 14,
    position: "relative",
  },
  textInput: {
    fontSize: 15,
    color: COLORS.text,
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  eyeButton: {
    position: "absolute",
    right: 16,
    top: 14,
    padding: 4,
  },
  authButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
    textAlign: "center",
  },
  linkContainer: {
    alignItems: "center",
    paddingBottom: 16,
  },
  linkText: {
    fontSize: 15,
    color: COLORS.textLight,
  },
  link: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: 14,
    color: COLORS.textLight,
    fontSize: 13,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  // RECENT ACCOUNTS
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  recentList: {
    marginBottom: 30,
  },
  accountCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
    width: 140,
    marginRight: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    position: "relative",
  },
  removeAccount: {
    position: "absolute",
    right: 8,
    top: 8,
    padding: 2,
    zIndex: 10,
  },
  recentAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
    backgroundColor: COLORS.border,
  },
  recentName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
  },
  recentEmail: {
    fontSize: 11,
    color: COLORS.textLight,
    textAlign: "center",
    marginTop: 2,
  },
  addAccountCard: {
    width: 140,
    height: 140,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  addAccountText: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textLight,
  },
});
