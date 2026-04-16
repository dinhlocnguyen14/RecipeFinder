import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Dimensions,
} from "react-native";
import React, { useState, useRef } from "react";
import { useRouter } from "expo-router";
import { onboardingStyles } from "../assets/styles/onboarding.styles";

const { width } = Dimensions.get("window");

const ONBOARDING_DATA = [
  {
    id: "1",
    title: "Cook like a chef at home",
    subtitle: "Discover over 5000+ recipes in your hands and start cooking your favorite dishes today.",
  },
  {
    id: "2",
    title: "Save your favorite recipes",
    subtitle: "Keep all your favorite recipes in one place and access them anytime, anywhere.",
  },
  {
    id: "3",
    title: "Plan your meals easily",
    subtitle: "Organize your weekly meal plan and make your grocery shopping a breeze.",
  }
];

const OnboardingScreen = () => {
  const router = useRouter();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleGetStarted = () => {
    router.push("/(auth)/sign-up");
  };

  const handleLogin = () => {
    router.push("/(auth)/sign-in");
  };

  const handleNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      handleGetStarted();
    }
  };

  const updateCurrentIndex = (e) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  const renderItem = ({ item, index }) => (
    <View style={onboardingStyles.slide}>
      <View style={onboardingStyles.overlay}>
        {/* Pagination Dots */}
        <View style={onboardingStyles.paginationContainer}>
          {ONBOARDING_DATA.map((_, i) => (
            <View
              key={i}
              style={[
                onboardingStyles.dot,
                { width: i === currentIndex ? 24 : 8 },
                i === currentIndex && onboardingStyles.activeDot,
              ]}
            />
          ))}
        </View>

        <Text style={onboardingStyles.title}>{item.title}</Text>
        <Text style={onboardingStyles.subtitle}>{item.subtitle}</Text>
        
        <TouchableOpacity 
          style={onboardingStyles.button}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={onboardingStyles.buttonText}>
            {currentIndex === ONBOARDING_DATA.length - 1 ? "Get Started" : "Continue"}
          </Text>
        </TouchableOpacity>
        
        <View style={onboardingStyles.loginTextContainer}>
          <Text style={onboardingStyles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={onboardingStyles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={onboardingStyles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <Image 
        source={require("../assets/images/onboarding.png")} 
        style={onboardingStyles.backgroundImage}
        resizeMode="cover"
      />

      {currentIndex < ONBOARDING_DATA.length - 1 && (
        <TouchableOpacity 
          style={onboardingStyles.header} 
          onPress={handleGetStarted}
        >
          <Text style={onboardingStyles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      <FlatList
        ref={flatListRef}
        data={ONBOARDING_DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        onMomentumScrollEnd={updateCurrentIndex}
      />
    </View>
  );
};

export default OnboardingScreen;
