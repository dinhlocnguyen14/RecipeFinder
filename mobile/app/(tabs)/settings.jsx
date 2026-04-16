import React from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

const SettingsScreen = () => {
  const { signOut } = useAuth();
  const { user } = useUser();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile & Settings</Text>
      </View>

      <View style={styles.content}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image 
            source={{ uri: user?.imageUrl || "https://ui-avatars.com/api/?name=User&background=FF8C00&color=fff" }} 
            style={styles.avatar} 
          />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user?.fullName || "Recipe Explorer"}</Text>
            <Text style={styles.userEmail}>{user?.primaryEmailAddress?.emailAddress}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.actionRow}>
            <Ionicons name="person-outline" size={24} color={COLORS.text} />
            <Text style={styles.actionText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionRow}>
            <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
            <Text style={styles.actionText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow}>
            <Ionicons name="color-palette-outline" size={24} color={COLORS.text} />
            <Text style={styles.actionText}>Appearance</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.error || "#FF3B30"} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontFamily: "Outfit_700Bold",
    fontSize: 28,
    color: COLORS.text,
  },
  content: {
    paddingHorizontal: 20,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 20,
    marginBottom: 32,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: "Outfit_700Bold",
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: COLORS.textLight,
  },
  actionSection: {
    marginBottom: 40,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  actionText: {
    flex: 1,
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    borderRadius: 16,
  },
  logoutText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: COLORS.error || "#FF3B30",
    marginLeft: 8,
  },
});

export default SettingsScreen;
