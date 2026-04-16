import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../../constants/colors";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  welcomeSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  welcomeText: {
    fontSize: 28,
    fontFamily: "Outfit_700Bold",
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.primary + "20",
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 56,
  },
  searchPlaceholder: {
    marginLeft: 12,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: COLORS.textLight,
    flex: 1,
  },
  featuredSection: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  featuredCard: {
    borderRadius: 32,
    overflow: "hidden",
    backgroundColor: COLORS.card,
    height: 200,
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
    padding: 24,
    justifyContent: "flex-end",
  },
  featuredTag: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  featuredTagText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  featuredTitle: {
    fontSize: 24,
    fontFamily: "Outfit_700Bold",
    color: COLORS.white,
    lineHeight: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Outfit_700Bold",
    color: COLORS.text,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: COLORS.primary,
  },
  categoryFilterContainer: {
    marginBottom: 20,
  },
  categoryFilterScrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    backgroundColor: "#F5F5F5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectedCategory: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: COLORS.textLight,
  },
  selectedCategoryText: {
    color: COLORS.white,
  },
  recipesSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 64,
  },
});

export const recipeCardStyles = StyleSheet.create({
  container: {
    width: cardWidth,
    backgroundColor: COLORS.card,
    borderRadius: 24,
    marginBottom: 20,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    height: 160,
    borderRadius: 24,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  favoriteIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(255,255,255,0.9)",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 16,
    fontFamily: "Outfit_600SemiBold",
    color: COLORS.text,
    marginBottom: 4,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: COLORS.textLight,
  },
});
