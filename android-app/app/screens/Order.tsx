import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { fetchDistricts, fetchProvinces, fetchWards, getProductById } from '@/lib/api';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/types';


export default function OrderScreen() {
    const route = useRoute<RouteProp<RootStackParamList, 'Order'>>();
    const { productId: id } = route.params;
    const [userInfo, setUserInfo] = useState({ name: '', email: '', address: '', phone: '' });
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [orderItems, setOrderItems] = useState<{ price: number; quantity: number; [key: string]: any }[]>([]);

    const [provinces, setProvinces] = useState<{ province_id: string; province_name: string }[]>([]);
    const [districts, setDistricts] = useState<{ district_id: string; district_name: string }[]>([]);
    const [wards, setWards] = useState<{ ward_id: string; ward_name: string }[]>([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');

    const totalAmount = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const fetchCart = async () => {
        if (id !== undefined) {
            if (typeof id === 'string') {
                const product = (await getProductById(id)).product;
                setOrderItems([{ ...product, quantity: 1 }]);
            } else {
                console.error('Invalid product ID');
            }
        } else {
            const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
            setOrderItems(storedCart);
        }
    };

    useEffect(() => { fetchCart(); }, []);

    useEffect(() => {
        (async () => {
            const data = await fetchProvinces();
            setProvinces(data);
        })();
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            (async () => {
                const data = await fetchDistricts(selectedProvince);
                setDistricts(data);
            })();
        } else setDistricts([]);
        setSelectedDistrict('');
        setSelectedWard('');
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedDistrict) {
            (async () => {
                const data = await fetchWards(selectedDistrict);
                setWards(data);
            })();
        } else setWards([]);
        setSelectedWard('');
    }, [selectedDistrict]);

    interface UserInfo {
        name: string;
        email: string;
        address: string;
        phone: string;
    }

    interface OrderItem {
        price: number;
        quantity: number;
        [key: string]: any;
    }

    interface Province {
        province_id: string;
        province_name: string;
    }

    interface District {
        district_id: string;
        district_name: string;
    }

    interface Ward {
        ward_id: string;
        ward_name: string;
    }

    const handleChange = (name: keyof UserInfo, value: string) => setUserInfo({ ...userInfo, [name]: value });

    const handleSubmit = () => {
        console.log({ userInfo, paymentMethod, selectedProvince, selectedDistrict, selectedWard, orderItems, totalAmount });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Đặt hàng</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Thông tin người nhận</Text>
                <TextInput style={styles.input} placeholder="Họ và tên" value={userInfo.name} onChangeText={(v) => handleChange('name', v)} />
                <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={userInfo.email} onChangeText={(v) => handleChange('email', v)} />
                <TextInput style={styles.input} placeholder="Số điện thoại" keyboardType="phone-pad" value={userInfo.phone} onChangeText={(v) => handleChange('phone', v)} />
                <TextInput style={styles.input} placeholder="Địa chỉ cụ thể" value={userInfo.address} onChangeText={(v) => handleChange('address', v)} />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>

                <View style={styles.dropdownGroup}>
                    <Text style={styles.label}>Tỉnh/Thành phố</Text>
                    <Picker selectedValue={selectedProvince} onValueChange={setSelectedProvince} style={styles.picker}>
                        <Picker.Item label="Chọn tỉnh/thành phố" value="" />
                        {provinces.map((p) => <Picker.Item key={p.province_id} label={p.province_name} value={p.province_id} />)}
                    </Picker>
                </View>

                <View style={styles.dropdownGroup}>
                    <Text style={styles.label}>Quận/Huyện</Text>
                    <Picker selectedValue={selectedDistrict} onValueChange={setSelectedDistrict} style={styles.picker}>
                        <Picker.Item label="Chọn quận/huyện" value="" />
                        {districts.map((d) => <Picker.Item key={d.district_id} label={d.district_name} value={d.district_id} />)}
                    </Picker>
                </View>

                <View style={styles.dropdownGroup}>
                    <Text style={styles.label}>Phường/Xã</Text>
                    <Picker selectedValue={selectedWard} onValueChange={setSelectedWard} style={styles.picker}>
                        <Picker.Item label="Chọn phường/xã" value="" />
                        {wards.map((w) => <Picker.Item key={w.ward_id} label={w.ward_name} value={w.ward_id} />)}
                    </Picker>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
                {['cash', 'bank'].map((method) => (
                    <TouchableOpacity key={method} style={styles.radioContainer} onPress={() => setPaymentMethod(method)}>
                        <View style={styles.radioCircle}>{paymentMethod === method && <View style={styles.radioChecked} />}</View>
                        <Text style={styles.radioText}>{method === 'cash' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản ngân hàng'}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Đơn hàng</Text>
                {orderItems.length === 0 ? (
                    <ActivityIndicator style={styles.loading} />
                ) : (
                    orderItems.map((item) => (
                        <View key={item.id} style={styles.itemRow}>
                            <Image source={{ uri: item.image }} style={styles.itemImage} />
                            <Text>{item.name} x {item.quantity}</Text>
                        </View>
                    ))
                )}
                <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Tổng tiền: {totalAmount.toLocaleString()} đ</Text>
            </View>

            <TouchableOpacity onPress={handleSubmit} style={{ marginTop: 16, backgroundColor: '#0a84ff', padding: 16, borderRadius: 8 }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Xác nhận đặt hàng</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        marginBottom: 12,
        borderRadius: 8,
    },
    label: { fontWeight: '500', marginBottom: 4 },
    picker: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8 },
    dropdownGroup: {
        marginBottom: 16,
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    radioChecked: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#333',
    },
    radioText: { fontSize: 16 },
    loading: { marginTop: 100 },
    itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    itemImage: { width: 60, height: 60, marginRight: 12, borderRadius: 8 },
});
