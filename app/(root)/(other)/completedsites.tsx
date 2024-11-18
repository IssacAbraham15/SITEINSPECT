import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { Text, View, Image, TouchableOpacity, TextInput, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { useGlobalContext } from "@/context/GlobalProvider";
import useAppwrite from "@/lib/useAppwrite";
import { getcompletedSites, getCurrentUser } from "@/lib/appwrite";

export default function CompletedSites() {
  const goToOnGoingSites = () => {
    router.push("/(root)/(tabs)/ongoingsites");
  };

  const { user, setUser } = useGlobalContext();
  const { data: completedSitesData, refetch } = useAppwrite(getcompletedSites);
  const [Refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      }
    };
    fetchUserData();
  }, []);

  const username = user ? user.username.split(" ")[0] : "User"; // Fallback for username

  return (
    <SafeAreaView className="bg-white">
      <FlatList
        className="bg-gray-100"
        data={completedSitesData}
        keyExtractor={(item) => item.$id}
        refreshing={Refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={
          <>
            {/* Header Section */}
            <View className="flex-row items-center px-4 py-4 bg-white">
              {user && user.avatar ? (
                <Image
                  source={{ uri: user.avatar }}
                  style={{ width: 50, height: 50, borderRadius: 50 }}
                />
              ) : (
                <Image
                  source={require("@/assets/icons/profile-icon.png")}
                  style={{ width: 50, height: 50, borderRadius: 50 }}
                />
              )}
              <Text className="text-2xl font-bold ml-4 color-primary-101">
                Hello, {username} 👋
              </Text>
            </View>

            {/* Search Bar */}
            <View className="flex-row items-center px-4 py-2 mt-6 mx-6 bg-[#f2e0d0] rounded-lg">
              <TextInput
                className="flex-1 p-2 text-base"
                placeholder="Search construction sites"
                placeholderTextColor="#a1a1a1"
              />
              <FontAwesome name="search" size={20} color="#a1a1a1" />
            </View>

            {/* Tabs for Site Progress */}
            <View className="flex-row justify-evenly mt-6 mb-4">
              <TouchableOpacity
                className="px-4 py-2 rounded-lg bg-[#DCDCDC]"
                onPressOut={goToOnGoingSites}
              >
                <Text className="text-primary-101 font-medium">On-going Sites</Text>
              </TouchableOpacity>

              <TouchableOpacity className="px-4 py-2 rounded-lg bg-[#b52424]">
                <Text className="text-white font-bold">Completed Sites</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View className="flex-row items-center bg-white mx-2 p-4 mb-4 rounded-lg shadow-sm">
            {item.Image ? (
              <Image
                className="w-20 h-20 rounded-lg"
                source={{ uri: item.Image }}
              />
            ) : (
              <Image
                className="w-20 h-20 rounded-lg"
                source={require("@/assets/icons/profile-icon.png")}
              />
            )}
            <View className="ml-4 flex-1">
              <Text className="text-lg font-bold">{item.Name}</Text>
              <Text className="text-gray-500">{item.Location}</Text>
            </View>
            <View className="w-16 h-16 border-4 border-primary-101 rounded-full flex items-center justify-center">
              <Text className="text-lg font-bold text-primary-101">
                {item.Progress}%
              </Text>
            </View>
          </View>
        )}
        ListFooterComponent={<View className="p-10 bg-gray-100"></View>}
      />
    </SafeAreaView>
  );
}
