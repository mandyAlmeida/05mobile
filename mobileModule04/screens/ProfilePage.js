import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const formatDate = (dateString) => {
    try {
        const date = new Date(dateString);
        return format(date, 'd MMMM yyyy', { locale: ptBR });
    } catch (error) {
        console.error('Erro ao formatar data:', error);
        return dateString;
    }
};

const feelingEmojis = {
    Feliz: '😊',
    Triste: '😢',
    Cansado: '😴',
    Animado: '🤩',
    Irritado: '😠',
    Ansioso: '😰',
    Calmo: '😌',
    Surpreso: '😲',
    Apaixonado: '🥰',
    Grato: '🙏',
};

const ProfilePage = () => {
    const { user } = useUser();
    const { signOut } = useAuth();
    const navigation = useNavigation();
    const [entries, setEntries] = useState([]);
    const isFocused = useIsFocused();

    const fetchEntries = async () => {
        try {
            const email = user?.primaryEmailAddress?.emailAddress;
            if (!email) return;

            const entriesRef = collection(db, 'entries');
            const q = query(
                entriesRef,
                where('email', '==', email),
                orderBy('date', 'desc')
            );

            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setEntries(data);
        } catch (error) {
            console.error('Erro ao buscar entradas:', error);
        }
    };

    useEffect(() => {
        if (isFocused && user) {
            fetchEntries();
        }
    }, [isFocused, user]);

    const handleNewEntry = () => {
        navigation.navigate('NewEntry');
    };

    const handleLogout = async () => {
        await signOut();
        navigation.replace('Login');
    };

    const getFeelingStats = () => {
        const total = entries.length;
        const stats = {};

        entries.forEach((entry) => {
            stats[entry.feeling] = (stats[entry.feeling] || 0) + 1;
        });

        return Object.entries(stats).map(([feeling, count]) => ({
            emoji: feelingEmojis[feeling] || '🙂',
            percent: ((count / total) * 100).toFixed(0),
        }));
    };
        return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Olá, {user?.firstName || 'usuário'}!</Text>
                    <TouchableOpacity onPress={handleLogout} style={styles.logoutIcon}>
                        <MaterialIcons name="logout" size={28} color="#8d9db6" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.subtitle}>Total de entradas: {entries.length}</Text>

                <View style={styles.lastEntriesBox}>
                    <Text style={styles.sectionTitle}>Últimas entradas de Diário</Text>

                    {entries.length > 0 ? (
                        entries.slice(0, 2).map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => navigation.navigate('EntryDetails', { entry: item })}
                            >
                                <View style={styles.entry}>
                                    <Text style={styles.entryTitle}>{item.title}</Text>
                                    <Text style={styles.entryDate}>🗓 {formatDate(item.date)}</Text>
                                    <Text style={styles.feeling}>
                                        {feelingEmojis[item.feeling] || '🙂'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={{ marginTop: 20, textAlign: 'center', marginBottom: 20 }}>
                            Nenhuma entrada ainda.
                        </Text>
                    )}
                </View>

                <TouchableOpacity style={styles.newButton} onPress={handleNewEntry}>
                    <Text style={styles.buttonText}>Nova entrada de Diário</Text>
                </TouchableOpacity>

                {entries.length > 0 && (
                    <View style={styles.statsBox}>
                        <Text style={styles.statsTitle}>Sentimentos usados para todas as entradas:</Text>
                        <View style={styles.statsRow}>
                            {getFeelingStats().map((item, index) => (
                                <Text key={index} style={styles.statsItem}>
                                    {item.emoji} {item.percent}%
                                </Text>
                            ))}
                        </View>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fdfaf6' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 26,
        fontWeight: 'arial',
        color: '#8d9db6',
        fontFamily: 'sans-serif',
    },
    logoutIcon: {
        padding: 8,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 10,
        fontFamily: 'sans-serif',
    },
    statsBox: {
        backgroundColor: ' #d6cbd3',
        padding: 12,
        borderRadius: 10,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: ' #ada397',
            },
    statsTitle: {
        fontWeight: 'arial',
        marginBottom: 5,
        fontFamily: 'sans-serif',
    },
    statsRow: {
        flexDirection: 'column',
        flexWrap: 'wrap',
        gap: 10,
    },
    statsItem: {
        marginRight: 12,
        fontSize: 16,
        fontFamily: 'sans-serif',
    },
    newButton: {
        backgroundColor: '#8d9db6',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontFamily: 'sans-serif',
    },
    lastEntriesBox: {
        backgroundColor: '#f1e3dd',
        justifyContent: 'center',
        marginBottom: 4,
        borderRadius: 12,
        padding: 6,
    },
    sectionTitle: {
        fontSize: 18,
        marginTop: 4,
        textAlign: 'center',
        fontWeight: 'arial',
        marginBottom: 10,
        fontFamily: 'sans-serif',
    },
    entry: {
        backgroundColor: '#f1e3dd',
        padding: 14,
        borderRadius: 10,
        marginBottom: 12,
        marginRight: 6,
        marginLeft: 6,
        borderLeftWidth: 4,
        borderLeftColor: '#8d9db6',
    },
    entryTitle: {
        fontWeight: 'arial',
        fontSize: 16,
        color: '#333',
        fontFamily: 'sans-serif',
    },
    entryDate: {
        color: '#666',
        fontSize: 14,
        marginTop: 4,
    },
    feeling: {
        fontSize: 16,
        marginTop: 6,
        fontFamily: 'sans-serif',
        color: '#8d9db6',
    },
});

export default ProfilePage;