import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export const createStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background || "#F9F9F9",
  },
  header: {
    padding: 20,
    paddingTop: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white || "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray || "#EAEAEA",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text || "#333",
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text || "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.white || "#FFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 55,
    fontSize: 16,
    color: COLORS.text || "#333",
    borderWidth: 1,
    borderColor: COLORS.lightGray || "#EAEAEA",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flex1: {
    flex: 1,
    marginHorizontal: 5,
  },
  textArea: {
    height: 120,
    paddingTop: 16,
    textAlignVertical: "top",
  },
  imagePicker: {
    height: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary || "#FF6B6B",
    borderStyle: "dashed",
    backgroundColor: COLORS.white || "#FFF",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  imagePickerPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    marginTop: 10,
    fontSize: 14,
    color: COLORS.textLight || "#888",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 40,
    borderRadius: 12,
    overflow: "hidden",
  },
  submitGradient: {
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: {
    color: COLORS.white || "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
