import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Use Expo's vector icons

type Props = {
    rating?: number; // Make rating optional
};

export function RatingStars({ rating }: Props) {
    const safeRating = rating || 0; // Default to 0 if rating is undefined
    const filledStars = Math.floor(safeRating);
    const halfStar = safeRating - filledStars >= 0.5;

    return (
        <View style={styles.container}>
            {Array.from({ length: 5 }).map((_, index) => {
                let iconName: keyof typeof Ionicons.glyphMap = 'star-outline';
                let color = '#ddd';

                if (index < filledStars) {
                    iconName = 'star'; // full star
                    color = '#ffc107';
                } else if (halfStar && index === filledStars) {
                    iconName = 'star-half'; // half star
                    color = '#ffc107';
                }

                return (
                    <Ionicons
                        key={index}
                        name={iconName}
                        size={20}
                        color={color}
                    />
                );
            })}
            <Text style={styles.ratingText}>{safeRating.toFixed(1)} / 5</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#4b5563', // Gray color for rating text
    },
});
