import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { onboardingStyles } from "../assets/styles/onboarding.styles";

const OnboardingScreen = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/(auth)/sign-up");
  };

  const handleLogin = () => {
    router.push("/(auth)/sign-in");
  };

  return (
    <View style={onboardingStyles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <Image 
        source={require("../assets/images/onboarding.png")} 
        style={onboardingStyles.backgroundImage}
        resizeMode="cover"
      />
      
      <View style={onboardingStyles.overlay}>
        <View style={onboardingStyles.content}>
          <Text style={onboardingStyles.title}>
            Cook like a chef{"\n"}at home
          </Text>
          <Text style={onboardingStyles.subtitle}>
            Discover over 5000+ recipes in your hands and start cooking your favorite dishes today.
          </Text>
          
          <TouchableOpacity 
            style={onboardingStyles.button}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <Text style={onboardingStyles.buttonText}>Get Started</Text>
          </TouchableOpacity>
          
          <View style={onboardingStyles.loginTextContainer}>
            <Text style={onboardingStyles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={onboardingStyles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default OnboardingScreen;
