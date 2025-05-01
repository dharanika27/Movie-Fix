import { View, Text, Image, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { Databases, Query, Client } from "react-native-appwrite";
import Constants from "expo-constants";

// Appwrite setup
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(Constants.expoConfig?.extra?.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);

const DATABASE_ID = Constants.expoConfig?.extra?.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = Constants.expoConfig?.extra?.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

const Saved = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedMovies = async () => {
      try {
        const response = await database.listDocuments(DATABASE_ID, COLLECTION_ID);

        // Optional: Remove duplicates based on $id
        const uniqueMovies = Array.from(new Map(response.documents.map(m => [m.$id, m])).values());

        setMovies(uniqueMovies);
      } catch (error) {
        console.error("Failed to fetch saved movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedMovies();
  }, []);

  const renderItem = ({ item }: any) => (
    <View key={item.$id} className="bg-white rounded-lg p-4 mb-4">
      <Image source={{ uri: item.poster_url }} className="h-60 w-full rounded-md" resizeMode="cover" />
      <Text className="text-lg font-semibold mt-2">{item.title}</Text>
      <Text className="text-sm text-gray-500">Searches: {item.count}</Text>
    </View>
  );

  return (
    <SafeAreaView className="bg-primary flex-1 px-4">
      <Text className="text-white text-xl font-bold mb-4 text-center">Saved Movies</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#fff" className="mt-10" />
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.$id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default Saved;
