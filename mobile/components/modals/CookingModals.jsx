import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

// --- Timer Modal ---
export const TimerModal = ({ visible, onClose, initialMinutes }) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);

  useEffect(() => {
    let interval;
    if (visible && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [visible, timeLeft]);

  useEffect(() => {
    if (visible) setTimeLeft(initialMinutes * 60);
  }, [visible, initialMinutes]);

  const handleAddMinute = () => setTimeLeft((prev) => prev + 60);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          <TouchableOpacity onPress={onClose} style={styles.closeButtonAbsolute}>
             <Ionicons name="close" size={24} color={COLORS.textLight} />
          </TouchableOpacity>
          <Text style={styles.timerLabel}>{initialMinutes} minutes</Text>
          <View style={styles.timerRow}>
            <Text style={styles.timerDisplay}>{formatTime(timeLeft)}</Text>
            <TouchableOpacity style={styles.addMinBadge} onPress={handleAddMinute}>
              <Text style={styles.addMinText}>+ 1 min</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.timerDescription}>
            Once done, remove from the heat and let it stand, still covered, for 5 minutes.
          </Text>

          <TouchableOpacity style={styles.outlineButton} onPress={onClose}>
            <Text style={styles.outlineButtonText}>Cancel Timer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ghostButton} onPress={onClose}>
            <Text style={styles.ghostButtonText}>Show Step x</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// --- Confirm Quit Modal ---
export const ConfirmQuitModal = ({ visible, onCancel, onConfirm }) => {
  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onCancel}>
      <View style={[styles.overlay, { justifyContent: "center", alignItems: "center" }]}>
        <View style={styles.dialogContainer}>
          <Text style={styles.dialogTitle}>Are you sure you want to quit cooking?</Text>
          <Text style={styles.dialogMessage}>
            Your progress will be lost and you'll return to the recipe page.
          </Text>
          
          <TouchableOpacity style={styles.destroyButton} onPress={onConfirm}>
            <Text style={styles.destroyButtonText}>Leave Cooking Mode</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryBoxButton} onPress={onCancel}>
            <Text style={styles.primaryBoxButtonText}>Continue Cooking</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheetContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  closeButtonAbsolute: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 8,
  },
  timerLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: COLORS.textLight,
  },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  timerDisplay: {
    fontFamily: "Outfit_700Bold",
    fontSize: 48,
    color: COLORS.text,
  },
  addMinBadge: {
    backgroundColor: "rgba(34, 197, 94, 0.1)", // Green tint
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addMinText: {
    fontFamily: "Inter_600SemiBold",
    color: "#22C55E",
  },
  timerDescription: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 22,
    marginBottom: 32,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  outlineButtonText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: COLORS.text,
  },
  ghostButton: {
    paddingVertical: 16,
    alignItems: "center",
  },
  ghostButtonText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: COLORS.textLight,
  },
  dialogContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    width: "85%",
  },
  dialogTitle: {
    fontFamily: "Outfit_700Bold",
    fontSize: 22,
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 12,
  },
  dialogMessage: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  destroyButton: {
    borderWidth: 1,
    borderColor: COLORS.textLight,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  destroyButtonText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: COLORS.text,
  },
  primaryBoxButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryBoxButtonText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: COLORS.white,
  },
});
