import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { ScrollView } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const formatDate = (dateString) => {
    try {
        const date = new Date(dateString);
        return format(date, 'd MMMM yyyy', { locale: ptBR });
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
};

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

const AgendaPage = () => {
    const { user } = useUser();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [entries, setEntries] = useState([]);
    const [isLandscape, setIsLandscape] = useState(
        Dimensions.get('window').width > Dimensions.get('window').height
    );

    useEffect(() => {
        const updateLayout = () => {
            const { width, height } = Dimensions.get('window');
            setIsLandscape(width > height);
        };

        const subscription = Dimensions.addEventListener('change', updateLayout);
        return () => subscription?.remove();
    }, []);

    const fetchEntriesByDate = async () => {
        if (!selectedDate) return;
        try {
            const email = user?.primaryEmailAddress.emailAddress;
            if (!email) return;

            const q = query(
                collection(db, 'entries'),
                where('email', '==', email),
                where('date', '==', selectedDate)
            );

            const snapshot = await getDocs(q);
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setEntries(data);
        } catch (error) {
            console.error('Error fetching entries:', error);
        }
    };

    useEffect(() => {
        if (isFocused) {
            fetchEntriesByDate();
        }
    }, [selectedDate, isFocused]);

    const handleView = (entry) => {
        navigation.navigate('EntryDetails', { entry });
    };

    const getCalendarWidth = () => {
        const { width } = Dimensions.get('window');
        return isLandscape ? width * 0.4 : width - 20;
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <Text style={styles.title}>Events Calendar</Text>

            {isLandscape ? (
                <View style={styles.landscapeContainer}>
                    <View style={[styles.calendarSection, { width: getCalendarWidth() }]}>
                        <ScrollView>
                            <Calendar
                                onDayPress={(day) => setSelectedDate(day.dateString)}
                                markedDates={
                                    selectedDate
                                        ? { [selectedDate]: { selected: true, selectedColor: ' #8d9db6' } }
                                        : {}
                                }
                                style={styles.calendar}
                                current={selectedDate}
                            />
                        </ScrollView>
                    </View>
                    <View style={styles.listSection}>
                        <FlatList
                            data={entries}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <View style={styles.entry}>
                                    <TouchableOpacity onPress={() => handleView(item)}>
                                        <Text style={styles.entryTitle}>
                                            <Text style={styles.entryDate}>
                                                🗓 {formatDate(item.date)} {feelingEmojis[item.feeling] || '🙂'} |{' '}
                                            </Text>
                                            {item.title}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            ListEmptyComponent={
                                selectedDate ? (
                                    <Text style={styles.listEmptyText}>No entries found.</Text>
                                ) : null
                            }
                            contentContainerStyle={styles.flatListContent}
                            showsVerticalScrollIndicator={true}
                        />
                    </View>
                </View>
            ) : (
                <>
                    <View style={styles.calendarSection}>
                        <Calendar
                            onDayPress={(day) => setSelectedDate(day.dateString)}
                            markedDates={
                                selectedDate
                                    ? { [selectedDate]: { selected: true, selectedColor: ' #8d9db6' } }
                                    : {}
                            }
                            style={styles.calendar}
                            current={selectedDate}
                        />
                    </View>
                    <View style={styles.listSection}>
                        <FlatList
                            data={entries}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <View style={styles.entry}>
                                    <TouchableOpacity onPress={() => handleView(item)}>
                                        <Text style={styles.entryTitle}>
                                            <Text style={styles.entryDate}>
                                                🗓 {formatDate(item.date)} {feelingEmojis[item.feeling] || '🙂'} |{' '}
                                            </Text>
                                            {item.title}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            ListEmptyComponent={
                                selectedDate ? (
                                    <Text style={styles.listEmptyText}>No entries found.</Text>
                                ) : null
                            }
                            contentContainerStyle={styles.flatListContent}
                            showsVerticalScrollIndicator={true}
                        />
                    </View>
                </>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f1e3dd',
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    title: {
        marginTop: 35,
        fontSize: 22,
        fontWeight: 'arial',
        color: '#667292',
        marginVertical: 8,
        fontFamily: 'sans-serif',
        textAlign: 'center',
    },
    landscapeContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 5,
    },
    calendarSection: {
        marginBottom: 10,
        paddingRight: 5,
    },
    listSection: {
        flex: 1,
        paddingLeft: 5,
    },
    calendar: {
        borderRadius: 10,
        backgroundColor: '#fff',
        padding: 5,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    flatListContent: {
        paddingBottom: 40,
    },
    entry: {
        backgroundColor: '#f1e3dd',
        padding: 14,
        borderRadius: 10,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#8d9db6',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    entryTitle: {
        fontWeight: 'arial',
        fontSize: 16,
        fontFamily: 'sans-serif',
    },
    entryDate: {
        color: '#3b3a3a',
        fontSize: 14,
        marginTop: 4,
    },
    listEmptyText: {
        marginTop: 20,
        textAlign: 'center',
        fontSize: 16,
        color: '#3b3a3a',
        fontFamily: 'sans-serif',
    },
});

export default AgendaPage;