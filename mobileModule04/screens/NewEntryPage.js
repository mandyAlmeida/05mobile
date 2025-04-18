import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    Alert,
    TouchableOpacity,
    ScrollView,
    useWindowDimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useUser } from '@clerk/clerk-expo';
import { db } from '../firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';

const feelingsList = [
    'Happy',
    'Sad',
    'Tired',
    'Animated',
    'Angry',
    'Anxious',
    'Calm',
    'Surprised',
    'InLove',
    'Grateful',
];

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
};

const NewEntryPage = ({ navigation }) => {
    const { user } = useUser();
    const [title, setTitle] = useState('');
    const [feeling, setFeeling] = useState('');
    const [content, setContent] = useState('');

    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    const handleSave = async () => {
        if (!title || !feeling || !content) {
            Alert.alert('Error', 'Fill in all fields!');
            return;
        }

        try {
            await addDoc(collection(db, 'entries'), {
                email: user?.primaryEmailAddress.emailAddress,
                date: new Date().toISOString().slice(0, 10),
                title,
                feeling,
                content,
            });

            Alert.alert('Sucess', 'Entry successfully created!');
            navigation.goBack();
        } catch (error) {
            console.error('Error saving entry:', error);
            Alert.alert('Error', 'The entry could not be saved.');
        }
    };

    return (
        <ScrollView
            contentContainerStyle={[
                styles.container,
                isLandscape && styles.containerLandscape,
            ]}
        >
            <View style={[styles.form, isLandscape && styles.formLandscape]}>
                <Text style={styles.label}>Título</Text>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Title of the day"
                />

                <Text style={styles.label}>Sentimento</Text>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={feeling}
                        onValueChange={(value) => setFeeling(value)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Select a feeling" value="" />
                        {feelingsList.map((f) => (
                            <Picker.Item key={f} label={`${feelingEmojis[f]} ${f}`} value={f} />
                        ))}
                    </Picker>
                </View>

                {feeling ? (
                    <Text style={styles.emojiPreview}>{feelingEmojis[feeling]}</Text>
                ) : null}

                <Text style={styles.label}>Conteúdo</Text>
                <TextInput
                    style={[styles.input, { height: 100 }]}
                    value={content}
                    onChangeText={setContent}
                    multiline
                    placeholder="Write your entry..."
                />

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Salvar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f1e3dd',
        flexGrow: 1,
    },
    containerLandscape: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    form: {
        width: '100%', // ocupa o espaço todo em portrait
    },
    formLandscape: {
        maxWidth: 500, // centraliza e limita no modo paisagem
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 10,
        fontFamily: 'sans-serif',
        color: '#667292',
    },
    input: {
        borderWidth: 1,
        borderColor: '#8d9db6',
        borderRadius: 8,
        padding: 10,
        marginTop: 5,
        marginBottom: 10,
        fontFamily: 'sans-serif',
        backgroundColor: '#f1e3dd',
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#8d9db6',
        borderRadius: 8,
        backgroundColor: '#f1e3dd',
        marginBottom: 10,
    },
    picker: {
        height: 50,
        width: '100%',
        fontFamily: 'sans-serif',
    },
    emojiPreview: {
        fontSize: 32,
        textAlign: 'center',
        marginBottom: 10,
    },
    saveButton: {
        backgroundColor: '#667292',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: ' #f1e3dd',
        fontWeight: 'bold',
        fontFamily: 'sans-serif',
    },
});

export default NewEntryPage;
