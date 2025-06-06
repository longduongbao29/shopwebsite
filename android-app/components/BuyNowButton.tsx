import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Product } from '@/schemas/product'; // Điều chỉnh theo schema của bạn
import { RootStackParamList } from '@/navigation/types';
import { ShoppingBag } from 'lucide-react-native';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type Props = {
    product: Product;
};

// BuyNowButton component
export default function  BuyNowButton ({ product }: Props) {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const handleBuyNow = () => {
        // Điều hướng đến màn hình Order và truyền product.id
        navigation.navigate('Order', { productId: String(product.id) });
    };

    return (
        <TouchableOpacity style={styles.buttonContainer} onPress={handleBuyNow}>
            <ShoppingBag size={20} color="#fff" />
            <Text style={styles.text}>Mua ngay</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ff5500',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    text: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});
