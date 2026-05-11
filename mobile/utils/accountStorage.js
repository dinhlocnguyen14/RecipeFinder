import * as SecureStore from "expo-secure-store";

const RECENT_ACCOUNTS_KEY = "recent_accounts_list";

export const saveAccountToRecent = async (user) => {
  if (!user) return;
  try {
    const stored = await SecureStore.getItemAsync(RECENT_ACCOUNTS_KEY);
    let accounts = stored ? JSON.parse(stored) : [];

    const newAccount = {
      id: user.id,
      fullName: user.fullName || user.firstName || "User",
      email: user.primaryEmailAddress?.emailAddress,
      imageUrl: user.imageUrl,
      lastLogin: new Date().getTime(),
    };

    // Filter out duplicate and add to top
    accounts = [
      newAccount,
      ...accounts.filter((a) => a.id !== newAccount.id),
    ].slice(0, 5);

    await SecureStore.setItemAsync(
      RECENT_ACCOUNTS_KEY,
      JSON.stringify(accounts),
    );
  } catch (e) {
    console.error("Error saving account", e);
  }
};

export const getRecentAccounts = async () => {
  try {
    const stored = await SecureStore.getItemAsync(RECENT_ACCOUNTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Error getting accounts", e);
    return [];
  }
};

export const removeAccountFromRecent = async (id) => {
  try {
    const stored = await SecureStore.getItemAsync(RECENT_ACCOUNTS_KEY);
    let accounts = stored ? JSON.parse(stored) : [];
    const updated = accounts.filter((a) => a.id !== id);
    await SecureStore.setItemAsync(
      RECENT_ACCOUNTS_KEY,
      JSON.stringify(updated),
    );
    return updated;
  } catch (e) {
    console.error("Error removing account", e);
    return [];
  }
};
