import { StyleSheet } from "react-native";
import { COLORS } from "./colors";

export const formStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bgMain,
  },
  scrollContent: {
    padding: 16,
    gap: 18,
    paddingBottom: 28,
  },
  title: {
    color: COLORS.textPrimary,
    fontFamily: "serif",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    color: COLORS.textBody,
    fontFamily: "serif",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderColor: "rgba(179, 139, 89, 0.3)",
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    gap: 10,
  },
  darkCard: {
    backgroundColor: COLORS.primaryAccent,
    borderRadius: 26,
    padding: 22,
    gap: 10,
  },
  cardTitle: {
    color: COLORS.textPrimary,
    fontFamily: "serif",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  label: {
    color: COLORS.mutedBrown,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  value: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: "700",
  },
  body: {
    color: COLORS.textBody,
    fontSize: 15,
    lineHeight: 22,
  },
  input: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.inputBorder,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: COLORS.primaryAccent,
    borderRadius: 14,
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
  },
  buttonGhost: {
    borderColor: COLORS.primaryAccent,
    borderWidth: 1,
    borderRadius: 14,
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  buttonGhostText: {
    color: COLORS.primaryAccent,
    fontSize: 15,
    fontWeight: "700",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 13,
  },
  successText: {
    color: COLORS.success,
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightBorder,
    marginVertical: 6,
  },
});
