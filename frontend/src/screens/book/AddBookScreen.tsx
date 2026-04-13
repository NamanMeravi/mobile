import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { addBook } from "../../api/books";
import colors from "../../styles/colors";

export default function AddBookScreen({ navigation }: any) {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets[0]?.base64) {
      const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setImage(base64);
    }
  };

  const handleSubmit = async () => {
    if (!title || !caption || !image || rating === 0) {
      Alert.alert("Error", "Please fill in all fields and select an image");
      return;
    }

    setLoading(true);
    try {
      await addBook({ title, caption, image, rating });
      Alert.alert("Success", "Book added successfully!");
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.previewImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>+ Add Cover Image</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Book Title"
        placeholderTextColor={colors.textLight}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, styles.captionInput]}
        placeholder="Write a caption..."
        placeholderTextColor={colors.textLight}
        value={caption}
        onChangeText={setCaption}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <Text style={styles.ratingLabel}>Rating</Text>
      <View style={styles.ratingRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Text style={[styles.star, star <= rating && styles.starActive]}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.buttonText}>Add Book</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  imagePicker: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  imagePlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: "dashed",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
  },
  captionInput: {
    height: 100,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: "row",
    marginBottom: 24,
    gap: 8,
  },
  star: {
    fontSize: 32,
    color: colors.border,
  },
  starActive: {
    color: colors.star,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
