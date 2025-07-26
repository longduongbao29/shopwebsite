import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    TextInput,
    ScrollView,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface Message {
    id: number;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

interface ChatbotProps {
    visible: boolean;
    onClose: () => void;
}

export function Chatbot({ visible, onClose }: ChatbotProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "Xin chào! Tôi là trợ lý ảo của shop. Tôi có thể giúp bạn tìm sản phẩm, trả lời câu hỏi về đơn hàng hoặc hỗ trợ khác. Bạn cần hỗ trợ gì?",
            isUser: false,
            timestamp: new Date(),
        },
    ]);
    const [inputText, setInputText] = useState('');

    const predefinedResponses = [
        {
            keywords: ['giá', 'bao nhiều', 'cost', 'price'],
            response: "Giá sản phẩm được hiển thị trên từng item. Nếu bạn cần thông tin chi tiết về giá, vui lòng cho tôi biết sản phẩm cụ thể bạn quan tâm.",
        },
        {
            keywords: ['giao hàng', 'ship', 'delivery', 'vận chuyển'],
            response: "Chúng tôi hỗ trợ giao hàng toàn quốc với thời gian 2-3 ngày làm việc. Phí ship từ 30,000đ tùy theo khu vực.",
        },
        {
            keywords: ['thanh toán', 'payment', 'pay'],
            response: "Chúng tôi hỗ trợ thanh toán COD (nhận hàng thanh toán), chuyển khoản ngân hàng và các ví điện tử phổ biến.",
        },
        {
            keywords: ['đổi trả', 'return', 'exchange'],
            response: "Chính sách đổi trả trong vòng 7 ngày với sản phẩm còn nguyên vẹn, chưa sử dụng và có hóa đơn mua hàng.",
        },
        {
            keywords: ['size', 'kích thước', 'cỡ'],
            response: "Bạn có thể xem bảng size chi tiết trong mô tả sản phẩm. Nếu không chắc chắn, hãy liên hệ với chúng tôi để được tư vấn size phù hợp.",
        },
        {
            keywords: ['hello', 'hi', 'xin chào', 'chào'],
            response: "Xin chào! Rất vui được hỗ trợ bạn. Bạn cần tôi giúp gì hôm nay?",
        },
    ];

    const getResponse = (userMessage: string): string => {
        const lowerMessage = userMessage.toLowerCase();

        for (const item of predefinedResponses) {
            if (item.keywords.some(keyword => lowerMessage.includes(keyword))) {
                return item.response;
            }
        }

        return "Cảm ơn bạn đã liên hệ! Tôi chưa hiểu rõ câu hỏi của bạn. Bạn có thể hỏi về giá cả, giao hàng, thanh toán, đổi trả, hoặc size sản phẩm. Hoặc liên hệ hotline: 1900-xxxx để được hỗ trợ trực tiếp.";
    };

    const sendMessage = () => {
        if (!inputText.trim()) return;

        const userMessage: Message = {
            id: messages.length + 1,
            text: inputText.trim(),
            isUser: true,
            timestamp: new Date(),
        };

        const botResponse: Message = {
            id: messages.length + 2,
            text: getResponse(inputText.trim()),
            isUser: false,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage, botResponse]);
        setInputText('');
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.chatContainer}>
                    {/* Header */}
                    <View style={styles.chatHeader}>
                        <View style={styles.headerInfo}>
                            <Ionicons name="chatbubble-ellipses" size={24} color="#FFFFFF" />
                            <Text style={styles.headerTitle}>Trợ lý ảo</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Messages */}
                    <ScrollView
                        style={styles.messagesContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        {messages.map((message) => (
                            <View
                                key={message.id}
                                style={[
                                    styles.messageItem,
                                    message.isUser ? styles.userMessage : styles.botMessage,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.messageText,
                                        message.isUser ? styles.userMessageText : styles.botMessageText,
                                    ]}
                                >
                                    {message.text}
                                </Text>
                                <Text style={styles.timestamp}>
                                    {message.timestamp.toLocaleTimeString('vi-VN', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </Text>
                            </View>
                        ))}
                    </ScrollView>

                    {/* Input */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Nhập tin nhắn..."
                            placeholderTextColor="#9CA3AF"
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                            maxLength={500}
                        />
                        <TouchableOpacity
                            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                            onPress={sendMessage}
                            disabled={!inputText.trim()}
                        >
                            <Ionicons name="send" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export function ChatbotFloatingButton({ onPress }: { onPress: () => void }) {
    return (
        <TouchableOpacity style={styles.floatingButton} onPress={onPress}>
            <Ionicons name="chatbubble-ellipses" size={28} color="#FFFFFF" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    chatContainer: {
        backgroundColor: '#FFFFFF',
        height: height * 0.8,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
    },
    chatHeader: {
        backgroundColor: '#2563EB',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingTop: 20,
    },
    headerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 8,
    },
    closeButton: {
        padding: 4,
    },
    messagesContainer: {
        flex: 1,
        padding: 16,
    },
    messageItem: {
        marginBottom: 12,
        maxWidth: '80%',
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#2563EB',
        borderRadius: 18,
        borderBottomRightRadius: 4,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    botMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#F3F4F6',
        borderRadius: 18,
        borderBottomLeftRadius: 4,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    userMessageText: {
        color: '#FFFFFF',
    },
    botMessageText: {
        color: '#1F2937',
    },
    timestamp: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 4,
        textAlign: 'right',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
    },
    textInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 8,
        maxHeight: 100,
        fontSize: 16,
    },
    sendButton: {
        backgroundColor: '#2563EB',
        borderRadius: 20,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#9CA3AF',
    },
    floatingButton: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        backgroundColor: '#2563EB',
        borderRadius: 30,
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        zIndex: 1000,
    },
});
