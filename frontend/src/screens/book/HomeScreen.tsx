import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getBooks } from "../../api/books";
import { Book } from "../../utils/types";
import colors from "../../styles/colors";

export default function HomeScreen() {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchBooks = async (pageNum: number = 1, refresh: boolean = false) => {
    try {
      const res = await getBooks(pageNum);
      const newBooks = res.data.books;

      if (refresh) {
        setBooks(newBooks);
      } else {
        setBooks((prev) => (pageNum === 1 ? newBooks : [...prev, ...newBooks]));
      }

      setHasMore(newBooks.length === 10);
      setPage(pageNum);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBooks(1, true);
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchBooks(1, true);
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchBooks(page + 1);
    }
  };

  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  const renderBook = ({ item }: { item: Book }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.bookImage} />
      <View style={styles.cardContent}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.stars}>{renderStars(item.rating)}</Text>
        <Text style={styles.caption} numberOfLines={2}>
          {item.caption}
        </Text>
        {item.user && (
          <View style={styles.userRow}>
            {item.user.profileImage ? (
              <Image
                source={{ uri: item.user.profileImage }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarText}>
                  {item.user.username[0]?.toUpperCase()}
                </Text>
              </View>
            )}
            <Text style={styles.username}>{item.user.username}</Text>
          </View>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={renderBook}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No books yet. Be the first to share!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  bookImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  cardContent: {
    padding: 14,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  stars: {
    fontSize: 16,
    color: colors.star,
    marginBottom: 6,
  },
  caption: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  avatarPlaceholder: {
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 12,
  },
  username: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});
