import React, { useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as mealAPI from "../services/mealAPI";
import { TimerModal, ConfirmQuitModal } from "../components/modals/CookingModals";

const CookingModeScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState(null);
  
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [quitVisible, setQuitVisible] = useState(false);
  const [timerVisible, setTimerVisible] = useState(false);
  const [activeTimerMinutes, setActiveTimerMinutes] = useState(5);

  useEffect(() => {
    loadRecipeDetails();
  }, [id]);

  const loadRecipeDetails = async () => {
    setLoading(true);
    const data = await mealAPI.fetchRecipeDetails(id);
    if (data && data.strInstructions) {
      // Magic algorithm: Split monolithic text block into readable, atomic steps by newline or period.
      const rawSteps = data.strInstructions
        .replace(/\r\n/g, '\n')
        .split(/(?:\n|\. )/)
        .map(s => s.trim())
        .filter(s => s.length > 5); // Ignore empty strings or super short glitches
      
      setSteps(rawSteps);
    }
    setRecipe(data);
    setLoading(false);
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      router.back(); // Done!
    }
  };

  const startTimer = (minutes) => {
    setActiveTimerMinutes(minutes);
    setTimerVisible(true);
  };

  if (loading || !recipe) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // Find if current step text contains mention of minutes
  const currentStepText = steps[currentStepIndex];
  const hasTimeReference = currentStepText?.match(/(\d+)\s*(?:min|minutes)/i);
  let detectedMinutes = 5; // default fallback
  if (hasTimeReference) {
    detectedMinutes = parseInt(hasTimeReference[1], 10);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header Progress Bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => setQuitVisible(true)}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          {steps.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.progressSegment, 
                { backgroundColor: index <= currentStepIndex ? "#22C55E" : COLORS.border } // Green for completed
              ]} 
            />
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.stepNumber}>
          {currentStepIndex + 1 < 10 ? `0${currentStepIndex + 1}` : currentStepIndex + 1}
        </Text>
        <Text style={styles.stepText}>
          {currentStepText}
        </Text>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View style={styles.footer}>
        <View style={styles.timerBubbles}>
          {hasTimeReference && (
             <TouchableOpacity style={styles.timerBadge} onPress={() => startTimer(detectedMinutes)}>
               <Text style={styles.timerBadgeText}>{detectedMinutes} minutes ►</Text>
             </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.timerBadge} onPress={() => startTimer(5)}>
             <Text style={styles.timerBadgeText}>5 minutes ►</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="list" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentStepIndex === steps.length - 1 ? "Finish Cooking" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TimerModal 
        visible={timerVisible} 
        onClose={() => setTimerVisible(false)} 
        initialMinutes={activeTimerMinutes}
      />
      <ConfirmQuitModal 
        visible={quitVisible} 
        onCancel={() => setQuitVisible(false)} 
        onConfirm={() => {
          setQuitVisible(false);
          router.back();
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 16,
  },
  progressContainer: {
    flex: 1,
    flexDirection: "row",
    height: 6,
    gap: 4,
  },
  progressSegment: {
    flex: 1,
    borderRadius: 3,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  stepNumber: {
    fontFamily: "Outfit_700Bold",
    fontSize: 48,
    color: COLORS.text,
    marginBottom: 24,
  },
  stepText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 24,
    color: COLORS.text,
    lineHeight: 36,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  timerBubbles: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 12,
  },
  timerBadge: {
    backgroundColor: "rgba(34, 197, 94, 0.1)", // Light green
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timerBadgeText: {
    fontFamily: "Inter_600SemiBold",
    color: "#22C55E", // Rich green
    fontSize: 14,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  nextButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: COLORS.white,
  },
});

export default CookingModeScreen;
