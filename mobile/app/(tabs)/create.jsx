import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { createStyles } from "../../assets/styles/create.styles";
import { COLORS } from "../../constants/colors";
import { API_URL } from "../../constants/api";
import { Image } from "expo-image";
import { UserRecipeAPI } from "../../services/userRecipeAPI";
import { useToast } from "../../hooks/useToast";

const CreateRecipe = () => {
  const { user } = useUser();
  const router = useRouter();
  const { showToast, ToastComponent } = useToast();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [image, setImage] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setImage(base64Image);
    }
  };

  const handleSubmit = async () => {
    if (!title || !ingredients || !instructions) {
      showToast(
        "Please add a title, ingredients, and instructions ",
        "warning",
      );
      return;
    }

    if (
      youtubeUrl &&
      !/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(youtubeUrl)
    ) {
      showToast("That YouTube link doesn't look right ", "warning");
      return;
    }

    setLoading(true);
    try {
      await UserRecipeAPI.saveRecipe({
        userId: user.id,
        title,
        category,
        ingredients,
        instructions,
        image,
        cookTime,
        servings,
        youtubeUrl,
      });

      showToast(
        "Yay! Your recipe has been shared with the community! ",
        "success",
      );

      // Delay redirect to let user see success toast
      setTimeout(() => {
        router.replace("/(tabs)");
      }, 1500);
      // Clear form
      setTitle("");
      setCategory("");
      setIngredients("");
      setInstructions("");
      setCookTime("");
      setServings("");
      setImage(null);
      setYoutubeUrl("");
    } catch (error) {
      console.error("Error creating recipe", error);
      showToast(
        error.message || "Something went wrong. Let's try saving that again ",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={createStyles.container}
    >
      {ToastComponent}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={createStyles.header}>
          <Text style={createStyles.headerTitle}>Create Recipe</Text>
        </View>

        <View style={createStyles.formContainer}>
          {/* IMAGE PICKER */}
          <View style={createStyles.inputGroup}>
            <Text style={createStyles.label}>Recipe Photo</Text>
            <TouchableOpacity
              style={createStyles.imagePicker}
              onPress={pickImage}
            >
              {image ? (
                <Image
                  source={{ uri: image }}
                  style={createStyles.previewImage}
                  contentFit="cover"
                />
              ) : (
                <View style={createStyles.imagePickerPlaceholder}>
                  <Ionicons
                    name="camera-outline"
                    size={40}
                    color={COLORS.textLight}
                  />
                  <Text style={createStyles.placeholderText}>
                    Add a photo of your dish
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* BASIC INFO */}
          <View style={createStyles.inputGroup}>
            <Text style={createStyles.label}>Recipe Title *</Text>
            <TextInput
              style={createStyles.input}
              placeholder="e.g. Classic Beef Pho"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor={COLORS.textLight}
            />
          </View>

          <View style={createStyles.inputGroup}>
            <Text style={createStyles.label}>Category</Text>
            <TextInput
              style={createStyles.input}
              placeholder="e.g. Breakfast, Dessert, Soup"
              value={category}
              onChangeText={setCategory}
              placeholderTextColor={COLORS.textLight}
            />
          </View>

          <View style={createStyles.row}>
            <View style={[createStyles.inputGroup, createStyles.flex1]}>
              <Text style={createStyles.label}>Cook Time</Text>
              <TextInput
                style={createStyles.input}
                placeholder="e.g. 30 mins"
                value={cookTime}
                onChangeText={setCookTime}
                placeholderTextColor={COLORS.textLight}
              />
            </View>
            <View style={[createStyles.inputGroup, createStyles.flex1]}>
              <Text style={createStyles.label}>Servings</Text>
              <TextInput
                style={createStyles.input}
                placeholder="e.g. 4 people"
                value={servings}
                onChangeText={setServings}
                placeholderTextColor={COLORS.textLight}
              />
            </View>
          </View>

          {/* INGREDIENTS */}
          <View style={createStyles.inputGroup}>
            <Text style={createStyles.label}>Ingredients *</Text>
            <TextInput
              style={[createStyles.input, createStyles.textArea]}
              placeholder="List your ingredients here (one per line)..."
              multiline
              numberOfLines={6}
              value={ingredients}
              onChangeText={setIngredients}
              placeholderTextColor={COLORS.textLight}
            />
          </View>

          {/* INSTRUCTIONS */}
          <View style={createStyles.inputGroup}>
            <Text style={createStyles.label}>Instructions *</Text>
            <TextInput
              style={[createStyles.input, createStyles.textArea]}
              placeholder="How do we cook this? Step by step..."
              multiline
              numberOfLines={8}
              value={instructions}
              onChangeText={setInstructions}
              placeholderTextColor={COLORS.textLight}
            />
          </View>

          {/* YOUTUBE LINK */}
          <View style={createStyles.inputGroup}>
            <Text style={createStyles.label}>
              YouTube Tutorial Link (Optional)
            </Text>
            <View
              style={[
                createStyles.input,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  height: 55,
                  paddingHorizontal: 12,
                  paddingVertical: 0,
                },
              ]}
            >
              <Ionicons
                name="logo-youtube"
                size={24}
                color="#FF0000"
                style={{ marginRight: 10 }}
              />
              <TextInput
                style={{
                  flex: 1,
                  height: "100%",
                  color: COLORS.text,
                  fontSize: 16,
                  padding: 0,
                }}
                placeholder="Example: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                value={youtubeUrl}
                onChangeText={setYoutubeUrl}
                autoCapitalize="none"
                keyboardType="url"
                placeholderTextColor={COLORS.textLight}
              />
            </View>
            {(() => {
              const regex =
                /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|shorts\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
              const match = youtubeUrl.match(regex);
              const videoId = match ? match[1] : null;
              if (videoId) {
                return (
                  <View
                    style={{
                      marginTop: 12,
                      borderRadius: 16,
                      overflow: "hidden",
                      height: 180,
                      backgroundColor: COLORS.card,
                      borderWidth: 1,
                      borderColor: COLORS.border + "40",
                    }}
                  >
                    <Image
                      source={{
                        uri: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                      }}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                    />
                    <View
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        backgroundColor: "rgba(0,0,0,0.7)",
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 6,
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 12,
                          fontWeight: "700",
                        }}
                      >
                        Video Preview
                      </Text>
                    </View>
                    <View
                      style={{
                        ...StyleSheet.absoluteFillObject,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 25,
                          backgroundColor: "rgba(255,0,0,0.8)",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Ionicons
                          name="play"
                          size={24}
                          color="white"
                          style={{ marginLeft: 3 }}
                        />
                      </View>
                    </View>
                  </View>
                );
              }
              return null;
            })()}
          </View>

          {/* SUBMIT BUTTON */}
          <TouchableOpacity
            style={createStyles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.primary + "CC"]}
              style={createStyles.submitGradient}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Ionicons
                    name="cloud-upload"
                    size={24}
                    color={COLORS.white}
                  />
                  <Text style={createStyles.submitText}>Publish Recipe</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateRecipe;
