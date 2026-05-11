import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export const forgotPasswordStyles = StyleSheet.create({
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 6,
  },
  backText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },

  // Step indicator
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotActive: {
    backgroundColor: COLORS.primary,
  },
  stepDotDone: {
    backgroundColor: COLORS.primary,
    opacity: 0.6,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textLight,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.border,
    marginHorizontal: 4,
  },

  // Email highlight in subtitle
  emailHighlight: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  // OTP input
  codeInput: {
    fontSize: 22,
    letterSpacing: 8,
    textAlign: "center",
    fontWeight: "700",
  },

  // Success screen
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  successIcon: {
    marginBottom: 8,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 22,
  },
  successButton: {
    width: "100%",
    marginTop: 8,
  },
});
