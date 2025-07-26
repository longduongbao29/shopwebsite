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
    Modal,
    FlatList,
} from 'react-native';
import { fetchDistricts, fetchProvinces, fetchWards, getProductById } from '@/lib/api';
import { useLocalSearchParams } from 'expo-router';
import Header from '@/components/Header';


export default function OrderScreen() {
    const { productId } = useLocalSearchParams<{ productId: string }>();
    const id = productId ? parseInt(productId) : null;
    const [userInfo, setUserInfo] = useState({ name: '', email: '', address: '', phone: '' });
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [orderItems, setOrderItems] = useState<{ price: number; quantity: number;[key: string]: any }[]>([]);

    const [provinces, setProvinces] = useState<{ province_id: string; province_name: string }[]>([]);
    const [districts, setDistricts] = useState<{ district_id: string; district_name: string }[]>([]);
    const [wards, setWards] = useState<{ ward_id: string; ward_name: string }[]>([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');

    // Modal states for custom pickers
    const [showProvinceModal, setShowProvinceModal] = useState(false);
    const [showDistrictModal, setShowDistrictModal] = useState(false);
    const [showWardModal, setShowWardModal] = useState(false);

    const totalAmount = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const fetchCart = async () => {
        if (id !== undefined && id !== null) {
            try {
                const product = (await getProductById(id.toString())).product;
                setOrderItems([{ ...product, quantity: 1 }]);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        } else {
            // For React Native, we would use AsyncStorage instead of localStorage
            // const storedCart = await AsyncStorage.getItem('cart');
            // setOrderItems(storedCart ? JSON.parse(storedCart) : []);
            setOrderItems([]);
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
        <>
            <Header />
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
                        <TouchableOpacity
                            style={styles.customPicker}
                            onPress={() => setShowProvinceModal(true)}
                        >
                            <Text style={[styles.pickerText, !selectedProvince && styles.placeholderText]}>
                                {selectedProvince ? provinces.find(p => p.province_id === selectedProvince)?.province_name : "Chọn tỉnh/thành phố"}
                            </Text>
                            <Text style={{ color: "#666", fontSize: 18 }}>▼</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.dropdownGroup}>
                        <Text style={styles.label}>Quận/Huyện</Text>
                        <TouchableOpacity
                            style={styles.customPicker}
                            onPress={() => setShowDistrictModal(true)}
                            disabled={!selectedProvince}
                        >
                            <Text style={[styles.pickerText, !selectedDistrict && styles.placeholderText]}>
                                {selectedDistrict ? districts.find(d => d.district_id === selectedDistrict)?.district_name : "Chọn quận/huyện"}
                            </Text>
                            <Text style={{ color: "#666", fontSize: 18 }}>▼</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.dropdownGroup}>
                        <Text style={styles.label}>Phường/Xã</Text>
                        <TouchableOpacity
                            style={styles.customPicker}
                            onPress={() => setShowWardModal(true)}
                            disabled={!selectedDistrict}
                        >
                            <Text style={[styles.pickerText, !selectedWard && styles.placeholderText]}>
                                {selectedWard ? wards.find(w => w.ward_id === selectedWard)?.ward_name : "Chọn phường/xã"}
                            </Text>
                            <Text style={{ color: "#666", fontSize: 18 }}>▼</Text>
                        </TouchableOpacity>
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

                {/* Province Modal */}
                <Modal visible={showProvinceModal} transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Chọn Tỉnh/Thành phố</Text>
                            <FlatList
                                data={provinces}
                                keyExtractor={(item) => item.province_id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.modalItem}
                                        onPress={() => {
                                            setSelectedProvince(item.province_id);
                                            setSelectedDistrict('');
                                            setSelectedWard('');
                                            setShowProvinceModal(false);
                                        }}
                                    >
                                        <Text style={styles.modalItemText}>{item.province_name}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                            <TouchableOpacity
                                style={styles.modalCloseButton}
                                onPress={() => setShowProvinceModal(false)}
                            >
                                <Text>Đóng</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* District Modal */}
                <Modal visible={showDistrictModal} transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Chọn Quận/Huyện</Text>
                            <FlatList
                                data={districts}
                                keyExtractor={(item) => item.district_id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.modalItem}
                                        onPress={() => {
                                            setSelectedDistrict(item.district_id);
                                            setSelectedWard('');
                                            setShowDistrictModal(false);
                                        }}
                                    >
                                        <Text style={styles.modalItemText}>{item.district_name}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                            <TouchableOpacity
                                style={styles.modalCloseButton}
                                onPress={() => setShowDistrictModal(false)}
                            >
                                <Text>Đóng</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* Ward Modal */}
                <Modal visible={showWardModal} transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Chọn Phường/Xã</Text>
                            <FlatList
                                data={wards}
                                keyExtractor={(item) => item.ward_id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.modalItem}
                                        onPress={() => {
                                            setSelectedWard(item.ward_id);
                                            setShowWardModal(false);
                                        }}
                                    >
                                        <Text style={styles.modalItemText}>{item.ward_name}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                            <TouchableOpacity
                                style={styles.modalCloseButton}
                                onPress={() => setShowWardModal(false)}
                            >
                                <Text>Đóng</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </>
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
    customPicker: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        backgroundColor: 'white',
    },
    pickerText: {
        fontSize: 16,
        color: '#333',
    },
    placeholderText: {
        color: '#999',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        width: '80%',
        maxHeight: '70%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    modalItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalItemText: {
        fontSize: 16,
        color: '#333',
    },
    modalCloseButton: {
        marginTop: 16,
        padding: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        alignItems: 'center',
    },
});
