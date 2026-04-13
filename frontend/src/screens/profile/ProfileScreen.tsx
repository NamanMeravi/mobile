import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../context/AuthContext";
import { getUserBooks, deleteBook } from "../../api/books";
import { updateProfileImage } from "../../api/user";
import { Book } from "../../utils/types";
import colors from "../../styles/colors";

export default function ProfileScreen() {
  const { user, setUser, logout } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserBooks = async () => {
    try {
      const res = await getUserBooks();
      setBooks(res.data.books);
    } catch (error) {
      console.error("Failed to fetch user books:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserBooks();
    }, [])
  );

  const handleChangeImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets[0]?.base64) {
      try {
        const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
        const res = await updateProfileImage(base64);
        setUser(res.data.user);
        Alert.alert("Success", "Profile image updated!");
      } catch (error: any) {
        Alert.alert("Error", error.response?.data?.message || "Failed to update image");
      }
    }
  };

  const handleDeleteBook = (id: string) => {
    Alert.alert("Delete Book", "Are you sure you want to delete this book?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteBook(id);
            setBooks((prev) => prev.filter((b) => b.id !== id));
          } catch (error: any) {
            Alert.alert("Error", "Failed to delete book");
          }
        },
      },
    ]);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout },
    ]);
  };

  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  const renderBook = ({ item }: { item: Book }) => (
    <View style={styles.bookCard}>
      <Image source={{ uri: item.image }} style={styles.bookImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.stars}>{renderStars(item.rating)}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => handleDeleteBook(item.id)}
      >
        <Text style={styles.deleteBtnText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleChangeImage}>
          {user?.profileImage ? (
            <Image source={{ uri: user.profileImage }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>
                {user?.username[0]?.toUpperCase()}
              </Text>
            </View>
          )}
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </TouchableOpacity>
        <Text style={styles.username}>{user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.bookCount}>{books.length} book(s) shared</Text>
      </View>

      {/* User's Books */}
      <Text style={styles.sectionTitle}>Your Books</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={renderBook}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>You haven't shared any books yet.</Text>
          }
        />
      )}

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: "center",
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 4,
  },
  avatarPlaceholder: {
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "bold",
  },
  changePhotoText: {
    color: colors.primary,
    fontSize: 12,
    textAlign: "center",
    marginBottom: 8,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  bookCount: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  list: {
    paddingHorizontal: 16,
  },
  bookCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bookImage: {
    width: 50,
    height: 70,
    borderRadius: 6,
    marginRight: 12,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
  stars: {
    fontSize: 14,
    color: colors.star,
    marginTop: 2,
  },
  deleteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: colors.error,
  },
  deleteBtnText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    color: colors.textSecondary,
    marginTop: 20,
  },
  logoutBtn: {
    margin: 16,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.error,
    alignItems: "center",
  },
  logoutText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: "600",
  },
});
