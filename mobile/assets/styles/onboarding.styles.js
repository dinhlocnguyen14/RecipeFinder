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
  header: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 10,
  },
  skipText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: COLORS.white,
  },
  slide: {
    width: width,
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.55)",
    width: "100%",
    padding: 32,
    paddingBottom: 60,
    alignItems: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  activeDot: {
    backgroundColor: COLORS.primary,
  },
  title: {
    fontSize: 40,
    fontFamily: "Outfit_700Bold",
    color: COLORS.white,
    textAlign: "center",
    lineHeight: 48,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 10,
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
