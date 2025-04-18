import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const feelingEmojis = {
    Happy: '😊',
    Sad: '😔',
    Tired: '😫',
    Animated: '🤩',
    Angry: '😠',
    Anxious: '😰', 
    Calm: '😌',
    Surprised: '😲',
    InLove: '🥰',
    Grateful: '🙏',
}

const EntryDetailsPage = ({ route }) => {
    const { entry } = route.params;
    const navigation = useNavigation();

    const handleDelete = () => {
        Alert.alert(
            'Delete entry',
            'Are you sure you want to delete this entry?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, 'entries', entry.id));
                            navigation.goBack();
                        } catch (error) {
                            console.error('Error deleting entry:', error);
                            Alert.alert('Error', 'Could not delete entry.');
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{entry.title}</Text>
            <Text style={styles.date}>🗓 {entry.date}</Text>
            <Text style={styles.feeling}>
                {feelingEmojis[entry.feeling] || '🙂'} {entry.feeling}
            </Text>
            <View style={styles.separator} />
            <Text style={styles.content}>{entry.content}</Text>

            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteButtonText}>Delete entry</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1e3dd',
        padding: 20,
    },
    title: {
        fontSize: 24,
        color: '#8d9db6',
        fontWeight: 'arial',
        marginBottom: 8,
        fontFamily: 'sans-serif',
    },
    date: {
        fontSize: 14,
        color: '',
        marginBottom: 4,
    },
    feeling: {
        fontSize: 16,
        color: '#bccad6',
        marginBottom: 12,
        fontWeight: '600',
    },
    separator: {
        height: 1,
        backgroundColor: '#5c5c5c',
        marginBottom: 12,
    },
    content: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
        fontFamily: 'sans-serif',
    },
    deleteButton: {
        marginTop: 30,
        backgroundColor: '#bccad6',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: 'arial',
    },
});

export default EntryDetailsPage;
