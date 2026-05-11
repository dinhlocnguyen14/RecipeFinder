import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../../context/ThemeContext";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { settingsStyles } from "../../assets/styles/settings.styles";
import { COLORS, THEMES } from "../../constants/colors";
import { API_URL } from "../../constants/api";
import { UserRecipeAPI } from "../../services/userRecipeAPI";
import { useEffect } from "react";
import { useToast } from "../../hooks/useToast";

const Settings = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const { showToast, ToastComponent } = useToast();

  // State for Edit Profile Modal
  const [isEditProfileVisible, setEditProfileVisible] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Theme Context
  const { themeName, changeTheme } = useTheme();

  // State for Theme Picker Modal
  const [isThemeVisible, setThemeVisible] = useState(false);

  // State for Feedback Modal
  const [isFeedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackSubject, setFeedbackSubject] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // State for My Recipes
  const [userRecipes, setUserRecipes] = useState([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);
  const [isMyRecipesVisible, setMyRecipesVisible] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchUserRecipes();
    }
  }, [user?.id]);

  const fetchUserRecipes = async () => {
    setIsLoadingRecipes(true);
    const recipes = await UserRecipeAPI.getUserRecipes(user.id);
    setUserRecipes(recipes);
    setIsLoadingRecipes(false);
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => signOut(),
      },
    ]);
  };

  const handleComingSoon = (feature) => {
    Alert.alert(
      "Coming Soon",
      `${feature} will be available in a future update. Stay tuned!`,
      [{ text: "OK", style: "default" }],
    );
  };

  const openEditProfile = () => {
    setFirstName(user?.firstName || "");
    setLastName(user?.lastName || "");
    setImage(user?.imageUrl || null);
    setEditProfileVisible(true);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageBase64(result.assets[0].base64);
    }
  };

  const handleUpdateProfile = async () => {
    if (!firstName.trim()) {
      showToast("First name is required to update your profile 👤", "warning");
      return;
    }

    setIsUpdatingProfile(true);
    try {
      // Update Name
      await user.update({
        firstName,
        lastName,
      });

      // Update Image if changed
      if (imageBase64) {
        await user.setProfileImage({
          file: `data:image/jpeg;base64,${imageBase64}`,
        });
      }

      setEditProfileVisible(false);
      setImageBase64(null); // Reset base64 after update
      showToast("Profile updated successfully! Looking good ✨", "success");
    } catch (error) {
      console.error("Error updating profile", error);
      showToast("Failed to update profile. Please try again 🔄", "error");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleSendFeedback = async () => {
    if (!feedbackSubject.trim() || !feedbackMessage.trim()) {
      showToast("Please provide both subject and message ✍️", "warning");
      return;
    }

    setIsSubmittingFeedback(true);
    try {
      const response = await fetch(`${API_URL}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          email: user?.primaryEmailAddress?.emailAddress,
          subject: feedbackSubject,
          message: feedbackMessage,
        }),
      });

      if (response.ok) {
        setFeedbackVisible(false);
        setFeedbackSubject("");
        setFeedbackMessage("");
        showToast("Thanks for your feedback! We'll look into it 💌", "success");
      } else {
        throw new Error("Failed to send feedback");
      }
    } catch (error) {
      console.error("Error sending feedback", error);
      showToast("Failed to send feedback. Please try again later 📮", "error");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleThemeSelect = async (newTheme) => {
    setThemeVisible(false);
    await changeTheme(newTheme);
  };

  return (
    <ScrollView
      style={settingsStyles.container}
      showsVerticalScrollIndicator={false}
    >
      {ToastComponent}
      <View style={settingsStyles.header}>
        <Text style={settingsStyles.headerTitle}>Settings</Text>
      </View>

      {/* PROFILE SECTION */}
      <View style={settingsStyles.profileSection}>
        <View style={settingsStyles.profileCard}>
          <Image
            source={{ uri: user?.imageUrl }}
            style={settingsStyles.avatar}
            contentFit="cover"
            transition={500}
          />
          <View style={settingsStyles.userInfo}>
            <Text style={settingsStyles.userName}>
              {user?.fullName || "User"}
            </Text>
            <Text style={settingsStyles.userEmail}>
              {user?.primaryEmailAddress?.emailAddress || "No email provided"}
            </Text>
          </View>
        </View>
      </View>

      {/* ACCOUNT SETTINGS */}
      <View style={settingsStyles.section}>
        <Text style={settingsStyles.sectionTitle}>Account</Text>
        <View style={settingsStyles.menuContainer}>
          <TouchableOpacity
            style={settingsStyles.menuItem}
            onPress={openEditProfile}
          >
            <View style={settingsStyles.menuIconContainer}>
              <Ionicons
                name="person-outline"
                size={22}
                color={COLORS.primary}
              />
            </View>
            <Text style={settingsStyles.menuItemText}>Edit Profile</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={COLORS.textLight}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={settingsStyles.menuItem}
            onPress={() => handleComingSoon("Notifications")}
          >
            <View style={settingsStyles.menuIconContainer}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color={COLORS.primary}
              />
            </View>
            <Text style={settingsStyles.menuItemText}>Notifications</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={COLORS.textLight}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={settingsStyles.menuItem}
            onPress={() => handleComingSoon("Privacy & Security")}
          >
            <View style={settingsStyles.menuIconContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={22}
                color={COLORS.primary}
              />
            </View>
            <Text style={settingsStyles.menuItemText}>Privacy & Security</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={COLORS.textLight}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={settingsStyles.menuItem}
            onPress={() => setMyRecipesVisible(true)}
          >
            <View style={settingsStyles.menuIconContainer}>
              <Ionicons
                name="journal-outline"
                size={22}
                color={COLORS.primary}
              />
            </View>
            <Text style={settingsStyles.menuItemText}>My Shared Recipes</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ color: COLORS.textLight, marginRight: 8 }}>
                {userRecipes.length}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={COLORS.textLight}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[settingsStyles.menuItem, settingsStyles.menuItemLast]}
            onPress={() => setFeedbackVisible(true)}
          >
            <View style={settingsStyles.menuIconContainer}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={22}
                color={COLORS.primary}
              />
            </View>
            <Text style={settingsStyles.menuItemText}>Send Feedback</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={COLORS.textLight}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* APP SETTINGS */}
      <View style={settingsStyles.section}>
        <Text style={settingsStyles.sectionTitle}>Preferences</Text>
        <View style={settingsStyles.menuContainer}>
          <TouchableOpacity
            style={settingsStyles.menuItem}
            onPress={() => setThemeVisible(true)}
          >
            <View style={settingsStyles.menuIconContainer}>
              <Ionicons
                name="color-palette-outline"
                size={22}
                color={COLORS.primary}
              />
            </View>
            <Text style={settingsStyles.menuItemText}>Theme</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={COLORS.textLight}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[settingsStyles.menuItem, settingsStyles.menuItemLast]}
            onPress={() => handleComingSoon("Language Settings")}
          >
            <View style={settingsStyles.menuIconContainer}>
              <Ionicons
                name="language-outline"
                size={22}
                color={COLORS.primary}
              />
            </View>
            <Text style={settingsStyles.menuItemText}>Language</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={COLORS.textLight}
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={settingsStyles.signOutButton}
        onPress={handleSignOut}
      >
        <Ionicons name="log-out-outline" size={22} color="#EF4444" />
        <Text style={settingsStyles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={settingsStyles.footer}>
        <Text style={settingsStyles.versionText}>RecipeFinder v1.0.0</Text>
      </View>

      {/* EDIT PROFILE MODAL */}
      <Modal
        visible={isEditProfileVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditProfileVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={settingsStyles.modalOverlay}
        >
          <View style={settingsStyles.modalContent}>
            <View style={settingsStyles.modalHeader}>
              <Text style={settingsStyles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditProfileVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={settingsStyles.editAvatarContainer}>
                <Image
                  source={{ uri: image }}
                  style={settingsStyles.editAvatar}
                />
                <TouchableOpacity
                  style={settingsStyles.editAvatarButton}
                  onPress={pickImage}
                >
                  <Ionicons name="camera" size={20} color={COLORS.primary} />
                  <Text style={settingsStyles.editAvatarButtonText}>
                    Change Photo
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={settingsStyles.inputLabel}>First Name</Text>
              <TextInput
                style={settingsStyles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter first name"
                placeholderTextColor={COLORS.textLight}
              />

              <Text style={settingsStyles.inputLabel}>Last Name</Text>
              <TextInput
                style={settingsStyles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter last name"
                placeholderTextColor={COLORS.textLight}
              />

              <TouchableOpacity
                style={[
                  settingsStyles.saveButton,
                  isUpdatingProfile && settingsStyles.saveButtonDisabled,
                ]}
                onPress={handleUpdateProfile}
                disabled={isUpdatingProfile}
              >
                {isUpdatingProfile ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={settingsStyles.saveButtonText}>
                    Save Changes
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* THEME PICKER MODAL */}
      <Modal
        visible={isThemeVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setThemeVisible(false)}
      >
        <View style={settingsStyles.modalOverlay}>
          <View style={settingsStyles.modalContent}>
            <View style={settingsStyles.modalHeader}>
              <Text style={settingsStyles.modalTitle}>Select Theme</Text>
              <TouchableOpacity onPress={() => setThemeVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {Object.keys(THEMES).map((themeKey) => {
                const themeData = THEMES[themeKey];
                const isActive = COLORS.primary === themeData.primary;
                return (
                  <TouchableOpacity
                    key={themeKey}
                    style={settingsStyles.themeItem}
                    onPress={() => handleThemeSelect(themeKey)}
                  >
                    <View
                      style={[
                        settingsStyles.themeColorPreview,
                        { backgroundColor: themeData.primary },
                      ]}
                    />
                    <Text
                      style={[
                        settingsStyles.themeName,
                        isActive && { fontWeight: "bold" },
                      ]}
                    >
                      {themeKey}
                    </Text>
                    {isActive && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={COLORS.primary}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* FEEDBACK MODAL */}
      <Modal
        visible={isFeedbackVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFeedbackVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={settingsStyles.modalOverlay}
        >
          <View style={settingsStyles.modalContent}>
            <View style={settingsStyles.modalHeader}>
              <Text style={settingsStyles.modalTitle}>Send Feedback</Text>
              <TouchableOpacity onPress={() => setFeedbackVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={settingsStyles.inputLabel}>Subject</Text>
              <TextInput
                style={settingsStyles.input}
                value={feedbackSubject}
                onChangeText={setFeedbackSubject}
                placeholder="What is this about?"
                placeholderTextColor={COLORS.textLight}
              />

              <Text style={settingsStyles.inputLabel}>Message</Text>
              <TextInput
                style={[
                  settingsStyles.input,
                  { height: 150, textAlignVertical: "top" },
                ]}
                value={feedbackMessage}
                onChangeText={setFeedbackMessage}
                placeholder="Share your thoughts or report an issue..."
                multiline
                numberOfLines={6}
                placeholderTextColor={COLORS.textLight}
              />

              <TouchableOpacity
                style={[
                  settingsStyles.saveButton,
                  isSubmittingFeedback && settingsStyles.saveButtonDisabled,
                ]}
                onPress={handleSendFeedback}
                disabled={isSubmittingFeedback}
              >
                {isSubmittingFeedback ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={settingsStyles.saveButtonText}>
                    Send Feedback
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* MY RECIPES MODAL */}
      <Modal
        visible={isMyRecipesVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setMyRecipesVisible(false)}
      >
        <View style={settingsStyles.modalOverlay}>
          <View style={[settingsStyles.modalContent, { height: "80%" }]}>
            <View style={settingsStyles.modalHeader}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={settingsStyles.modalTitle}>My Shared Recipes</Text>
                <TouchableOpacity
                  onPress={fetchUserRecipes}
                  style={{ marginLeft: 12 }}
                  disabled={isLoadingRecipes}
                >
                  <Ionicons
                    name="refresh"
                    size={18}
                    color={isLoadingRecipes ? COLORS.textLight : COLORS.primary}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => setMyRecipesVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            {isLoadingRecipes && userRecipes.length === 0 ? (
              <ActivityIndicator
                size="large"
                color={COLORS.primary}
                style={{ marginTop: 50 }}
              />
            ) : (
              <FlatList
                data={userRecipes}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      padding: 12,
                      backgroundColor: COLORS.white,
                      borderRadius: 16,
                      marginBottom: 12,
                      borderWidth: 1,
                      borderColor: "#F0F0F0",
                      alignItems: "center",
                    }}
                    onPress={() => {
                      setMyRecipesVisible(false);
                      router.push(`/recipe/${item.id}`);
                    }}
                  >
                    <Image
                      source={{
                        uri:
                          item.image ||
                          "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80",
                      }}
                      style={{ width: 70, height: 70, borderRadius: 12 }}
                      contentFit="cover"
                    />
                    <View style={{ flex: 1, marginLeft: 15 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "700",
                          color: COLORS.text,
                        }}
                        numberOfLines={1}
                      >
                        {item.title}
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          color: COLORS.textLight,
                          marginTop: 2,
                        }}
                      >
                        {item.category || "General"}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          marginTop: 4,
                          alignItems: "center",
                        }}
                      >
                        <Ionicons
                          name="time-outline"
                          size={14}
                          color={COLORS.primary}
                        />
                        <Text
                          style={{
                            fontSize: 12,
                            color: COLORS.textLight,
                            marginLeft: 4,
                          }}
                        >
                          {item.cookTime || "30 mins"}
                        </Text>
                      </View>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={COLORS.textLight}
                    />
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View style={{ padding: 60, alignItems: "center" }}>
                    <Ionicons
                      name="restaurant-outline"
                      size={64}
                      color={COLORS.textLight}
                    />
                    <Text
                      style={{
                        marginTop: 16,
                        color: COLORS.textLight,
                        fontSize: 16,
                      }}
                    >
                      No recipes shared yet
                    </Text>
                  </View>
                }
              />
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Settings;
