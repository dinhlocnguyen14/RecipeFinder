import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Image } from "expo-image";
import { homeStyles } from "../assets/styles/home.styles";
import { COLORS } from "../constants/colors";

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}) {
  return (
    <View style={homeStyles.categoryFilterContainer}>
      <Text style={homeStyles.categoryTitle}>Categories</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={homeStyles.categoryFilterScrollContent}
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category.name;

          return (
            <TouchableOpacity
              key={category.id}
              style={[
                homeStyles.categoryButton,
                isSelected && homeStyles.selectedCategory,
              ]}
              onPress={() => onSelectCategory(category.name)}
              activeOpacity={0.7}
            >
              <Image
                key={category.id}
                source={{
                  uri: category.image || "https://via.placeholder.com/100",
                }}
                style={homeStyles.categoryImage} // 👈 KHÔNG phụ thuộc selected
                contentFit="cover"
                cachePolicy="memory-disk" // 👈 chống mất ảnh
              />

              <Text
                style={[
                  homeStyles.categoryText,
                  isSelected && homeStyles.selectedCategoryText,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
