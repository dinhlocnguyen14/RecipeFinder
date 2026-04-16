import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../../constants/colors";

const { height } = Dimensions.get("window");

export const recipeDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    height: height * 0.45,
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  floatingButtons: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  floatingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  titleSection: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
  },
  categoryBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  categoryText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  recipeTitle: {
    fontSize: 32,
    fontFamily: "Outfit_700Bold",
    color: COLORS.white,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  contentSection: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    marginTop: -36,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 100, // Space for sticky button
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 16,
    fontFamily: "Outfit_700Bold",
    color: COLORS.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: COLORS.textLight,
  },
  segmentContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  segmentButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  segmentButtonActive: {
    backgroundColor: "rgba(255, 140, 0, 0.1)",
    borderColor: COLORS.primary,
  },
  segmentText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: COLORS.textLight,
  },
  segmentTextActive: {
    color: COLORS.primary,
  },
  sectionContainer: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Outfit_700Bold",
    color: COLORS.text,
    marginBottom: 16,
  },
  ingredientCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  ingredientName: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: COLORS.text,
  },
  ingredientMeasure: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: COLORS.textLight,
  },
  instructionText: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: COLORS.text,
    lineHeight: 28,
    marginBottom: 16,
  },
  stickyFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cookedCheckbox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkboxCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.textLight,
    justifyContent: "center",
    alignItems: "center",
  },
  cookedText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: COLORS.text,
  },
  startCookingButton: {
    flex: 1,
    marginLeft: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  startCookingText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "Outfit_700Bold",
  },
});
