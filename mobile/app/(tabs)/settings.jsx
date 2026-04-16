import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Modal, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { Image } from "expo-image";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

const SettingsScreen = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const [accountMenuVisible, setAccountMenuVisible] = useState(false);
  const [upgradeModalVisible, setUpgradeModalVisible] = useState(false);

  // Fake states for premium UX UI demonstration
  const [wasteTracking, setWasteTracking] = useState(false);

  const handleSignOut = () => {
    setAccountMenuVisible(false);
    signOut();
    router.replace("/sign-in");
  };

  const renderAccountMenu = () => (
    <Modal visible={accountMenuVisible} animationType="fade" transparent={true} onRequestClose={() => setAccountMenuVisible(false)}>
      <View style={styles.modalOverlay}>
         <TouchableOpacity style={styles.dismissArea} onPress={() => setAccountMenuVisible(false)} />
         <View style={styles.accountMenuSheet}>
           <TouchableOpacity style={styles.menuRow}>
             <Ionicons name="person-circle-outline" size={20} color={COLORS.text} style={styles.menuIcon} />
             <Text style={styles.menuText}>Edit Your Account</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.menuRow} onPress={handleSignOut}>
             <Ionicons name="swap-horizontal-outline" size={20} color={COLORS.text} style={styles.menuIcon} />
             <Text style={styles.menuText}>Switch Accounts / Logout</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.menuRow} onPress={() => { setAccountMenuVisible(false); setUpgradeModalVisible(true); }}>
             <Ionicons name="star-outline" size={20} color={COLORS.text} style={styles.menuIcon} />
             <Text style={styles.menuText}>Upgrade To Pro</Text>
           </TouchableOpacity>
         </View>
      </View>
    </Modal>
  );

  const renderUpgradeModal = () => (
    <Modal visible={upgradeModalVisible} animationType="slide" transparent={true} onRequestClose={() => setUpgradeModalVisible(false)}>
      <View style={styles.upgradeOverlay}>
         <View style={styles.upgradeSheet}>
            <TouchableOpacity onPress={() => setUpgradeModalVisible(false)} style={styles.closeUpgradeBtn}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>

            <Text style={styles.upgradeTitle}>Unlock Exclusive Recipes</Text>
            <Text style={styles.upgradeSubtitle}>Access new recipes every month reserved for pro subscribers.</Text>

            <View style={styles.premiumCardIllustration}>
               <Image source={{ uri: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80" }} style={styles.premiumImg} />
               <View style={styles.proBadgeAbs}>
                 <Text style={styles.proBadgeText}>Pro ✦</Text>
               </View>
               <Text style={styles.premiumCardTitle}>Greek Salad with Feta Cheese & Kalamata Olives</Text>
            </View>

            <View style={styles.dotsRow}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>

            <Text style={styles.priceText}>$2.99 a month. Cancel anytime.</Text>

            <TouchableOpacity style={styles.upgradeNowBtnFull} onPress={() => setUpgradeModalVisible(false)}>
              <Text style={styles.upgradeNowBtnText}>Upgrade To Pro</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.restoreBtn}>
              <Text style={styles.restoreBtnText}>Restore Purchases</Text>
            </TouchableOpacity>
         </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            {user?.imageUrl ? (
              <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarInitial}>{user?.emailAddresses[0]?.emailAddress?.charAt(0).toUpperCase() || "U"}</Text>
              </View>
            )}
            <View style={styles.freeBadge}>
              <Text style={styles.freeBadgeText}>FREE</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.emailDropdown} onPress={() => setAccountMenuVisible(true)}>
            <Text style={styles.emailText}>{user?.emailAddresses[0]?.emailAddress}</Text>
            <Ionicons name="chevron-down" size={16} color={COLORS.textLight} style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>

        {/* Upgrade Banner */}
        <View style={styles.upgradeBanner}>
          <Text style={styles.bannerTitle}>Upgrade to Pro</Text>
          <Text style={styles.bannerDesc}>
            Get exclusive recipes, nutritional information, advanced filters, and more.
          </Text>
          <TouchableOpacity style={styles.bannerBtn} onPress={() => setUpgradeModalVisible(true)}>
            <Text style={styles.bannerBtnText}>Upgrade Now!</Text>
          </TouchableOpacity>
        </View>

        {/* List Options */}
        <View style={styles.settingOptionsList}>
          <View style={styles.settingItemRow}>
            <View style={styles.settingItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: "#D1FAE5" }]}>
                <Text style={{ fontSize: 12, fontWeight: "bold", color: "#059669" }}>1lb</Text>
              </View>
              <Text style={styles.settingItemText}>Food Waste Savings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
          </View>

          <TouchableOpacity style={styles.settingItemRow}>
            <View style={styles.settingItemLeft}>
              <Ionicons name="options-outline" size={24} color={COLORS.textLight} style={styles.iconSpaced} />
              <Text style={styles.settingItemText}>Eating Preferences</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItemRow}>
            <View style={styles.settingItemLeft}>
              <Ionicons name="basket-outline" size={24} color={COLORS.textLight} style={styles.iconSpaced} />
              <Text style={styles.settingItemText}>Your Recipes</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItemRow}>
            <View style={styles.settingItemLeft}>
              <Ionicons name="share-social-outline" size={24} color={COLORS.textLight} style={styles.iconSpaced} />
              <Text style={styles.settingItemText}>Share Mealime</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItemRow}>
            <View style={styles.settingItemLeft}>
              <Ionicons name="people-outline" size={24} color={COLORS.textLight} style={styles.iconSpaced} />
              <Text style={styles.settingItemText}>Meet Our Chefs</Text>
            </View>
             <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {renderAccountMenu()}
      {renderUpgradeModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    fontFamily: "Outfit_700Bold",
    fontSize: 28,
    color: COLORS.text,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileSection: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: {
    fontSize: 32,
    color: COLORS.white,
    fontFamily: "Outfit_700Bold",
  },
  freeBadge: {
    position: "absolute",
    bottom: -5,
    right: -10,
    backgroundColor: "#22C55E",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  freeBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },
  emailDropdown: {
    flexDirection: "row",
    alignItems: "center",
  },
  emailText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: COLORS.textLight,
  },
  upgradeBanner: {
    backgroundColor: "rgba(255, 140, 0, 0.1)", // Light orange tint
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 20,
    marginBottom: 32,
  },
  bannerTitle: {
    fontFamily: "Outfit_700Bold",
    fontSize: 20,
    color: COLORS.text,
    marginBottom: 8,
  },
  bannerDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: 20,
  },
  bannerBtn: {
    backgroundColor: COLORS.primary, // Orange
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  bannerBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: COLORS.white,
  },
  settingOptionsList: {
    marginHorizontal: 20,
  },
  settingItemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  iconSpaced: {
    width: 32,
    marginRight: 16,
    textAlign: "center",
  },
  settingItemText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: COLORS.text,
  },
  // Account Menu Bottom Sheet
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  dismissArea: {
    flex: 1,
  },
  accountMenuSheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 50,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  menuIcon: {
    marginRight: 16,
  },
  menuText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: COLORS.text,
  },
  // Upgrade Modal
  upgradeOverlay: {
    flex: 1,
    backgroundColor: "rgba(224, 242, 233, 0.95)", // Pale mint green backdrop
    justifyContent: "flex-end",
  },
  upgradeSheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    minHeight: "80%",
    alignItems: "center",
  },
  closeUpgradeBtn: {
    position: "absolute",
    top: 16,
    left: 16,
    padding: 8,
    zIndex: 10,
  },
  upgradeTitle: {
    fontFamily: "Outfit_700Bold",
    fontSize: 24,
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 8,
    textAlign: "center",
  },
  upgradeSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: "center",
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  premiumCardIllustration: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 24,
  },
  premiumImg: {
    width: "100%",
    height: 150,
    borderRadius: 16,
    marginBottom: 16,
  },
  proBadgeAbs: {
    position: "absolute",
    top: 24,
    right: 24,
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  proBadgeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: "#22C55E",
  },
  premiumCardTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: COLORS.text,
    textAlign: "center",
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
    width: 20,
  },
  priceText: {
    fontFamily: "Outfit_700Bold",
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 24,
  },
  upgradeNowBtnFull: {
    backgroundColor: COLORS.primary,
    width: "100%",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  upgradeNowBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: COLORS.white,
  },
  restoreBtn: {
    paddingVertical: 8,
  },
  restoreBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: COLORS.text,
    textDecorationLine: "underline",
  },
});

export default SettingsScreen;
