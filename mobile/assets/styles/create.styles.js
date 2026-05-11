import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../../constants/colors";

const { width } = Dimensions.get("window");

export const createStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text,
  },
  formContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border + "50",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    gap: 15,
  },
  flex1: {
    flex: 1,
  },
  imagePicker: {
    width: "100%",
    height: 200,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: "dashed",
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  imagePickerPlaceholder: {
    alignItems: "center",
    gap: 8,
  },
  placeholderText: {
    color: COLORS.textLight,
    fontWeight: "500",
  },
  submitButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 10,
  },
  submitText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});
