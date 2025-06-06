import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Bạn có thể sử dụng các icon khác nếu muốn

type Props = {
    rating: number;
};

export function RatingStars({ rating }: Props) {
    const filledStars = Math.floor(rating);
    const halfStar = rating - filledStars >= 0.5;

    return (
        <View style={styles.container}>
            {Array.from({ length: 5 }).map((_, index) => {
                let iconName = 'star';
                if (index < filledStars) {
                    iconName = 'star'; // full star
                } else if (halfStar && index === filledStars) {
                    iconName = 'star-half'; // half star
                } else {
                    iconName = 'star'; // empty star
                }

                return (
                    <Icon
                        key={index}
                        name={iconName}
                        size={20}
                        color={index < filledStars ? '#fbbf24' : '#e5e7eb'} // yellow for filled, gray for empty
                    />
                );
            })}
            <Text style={styles.ratingText}>{rating.toFixed(1)} / 5</Text>
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
