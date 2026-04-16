import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../../constants/colors";

const { width, height } = Dimensions.get("window");

export const onboardingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
    padding: 32,
    paddingBottom: 60,
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 48,
    fontFamily: "Outfit_700Bold",
    color: COLORS.white,
    textAlign: "center",
    lineHeight: 56,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    width: "100%",
    paddingVertical: 20,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "Outfit_700Bold",
  },
  loginTextContainer: {
    flexDirection: "row",
    marginTop: 24,
  },
  loginText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  loginLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
});
