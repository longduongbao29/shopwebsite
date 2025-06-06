import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, FlatList, Button } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/types'; // Adjust the path to where RootStackParamList is defined
import { getProductById } from '@/lib/api';
import { RatingStars } from '@/components/RatingStars';
import AddToCartButton from '@/components/AddToCartButton';
import BuyNowButton from '@/components/BuyNowButton'
import Toast from 'react-native-toast-message';
import { Product } from '@/schemas/product'; // Điều chỉnh theo schema của bạn


export default function ProductPage() {
    const route = useRoute<RouteProp<RootStackParamList, 'Product'>>();
    const { id } = route.params;
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            const data = await getProductById(id);
            setProduct(data.product);
            setLoading(false);
        };
        fetchProduct();
    }, [id]);

    const comments = [
        {
            name: "Nguyễn Văn A",
            content: "Sản phẩm rất tốt, giao hàng nhanh chóng!",
            date: "2025-04-10",
        },
        {
            name: "Trần Thị B",
            content: "Chất lượng vượt mong đợi, sẽ ủng hộ lần sau!",
            date: "2025-04-09",
        },
    ];

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Toast position="top" />
            <View style={styles.card}>
                <Image source={{ uri: product?.image }} style={styles.image} />
                <View style={styles.infoContainer}>
                    <Text style={styles.title}>{product?.name}</Text>
                    <RatingStars rating={product?.rating || 0} />
                    <Text style={styles.description}>{product?.description}</Text>
                    <Text style={styles.price}>
                        {product?.price?.toLocaleString()} đ
                    </Text>
                    <View style={styles.buttonsContainer}>
                        {product && <BuyNowButton product={product} />}
                        {product && <AddToCartButton product={product} />}
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Mô tả chi tiết</Text>
                <Text style={styles.longDescription}>
                    {product?.description ||
                        "Đây là phần mô tả chi tiết sản phẩm, có thể dài nhiều đoạn và hỗ trợ định dạng văn bản nếu dùng CMS như Sanity, Strapi hoặc Markdown HTML."}
                </Text>
                <Text style={styles.longDescription}>
                    Sản phẩm được thiết kế với chất liệu cao cấp, phù hợp với nhu cầu sử dụng hằng ngày cũng như chuyên nghiệp. Bảo hành 12 tháng và hỗ trợ đổi trả trong vòng 7 ngày.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Bình luận</Text>
                {comments.map((comment, index) => (
                    <View key={index} style={styles.commentItem}>
                        <Text style={styles.commentName}>{comment.name}</Text>
                        <Text style={styles.commentDate}>{comment.date}</Text>
                        <Text style={styles.commentContent}>{comment.content}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
        padding: 16,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
        elevation: 2,
    },
    image: {
        width: '100%',
        height: 250,
        resizeMode: 'cover',
    },
    infoContainer: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: '#4b5563',
        marginBottom: 8,
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2563eb',
        marginVertical: 12,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 12,
    },
    section: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 12,
    },
    longDescription: {
        fontSize: 16,
        color: '#374151',
        marginBottom: 10,
    },
    commentItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        paddingBottom: 12,
        marginBottom: 12,
    },
    commentName: {
        fontWeight: 'bold',
        color: '#111827',
    },
    commentDate: {
        fontSize: 12,
        color: '#6b7280',
    },
    commentContent: {
        fontSize: 16,
        color: '#374151',
        marginTop: 4,
    },
    buttonContainer: {
        marginTop: 10,
        marginHorizontal: 20,
    },
});
