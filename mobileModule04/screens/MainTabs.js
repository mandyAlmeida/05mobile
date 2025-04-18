import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
} from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProfilePage from './ProfilePage';
import AgendaPage from './AgendaPage';

export default function MainTabs() {
    const [index, setIndex] = useState(0);
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));

    const [routes] = useState([
        { key: 'profile', title: 'Perfil', icon: 'person' },
        { key: 'agenda', title: 'Agenda', icon: 'calendar-today' },
    ]);

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setDimensions(window);
        });
        return () => subscription?.remove();
    }, []);

    const { width, height } = dimensions;
    const isLandscape = width > height;

    const renderScene = SceneMap({
        profile: ProfilePage,
        agenda: AgendaPage,
    });

    const handleTabPress = (tabIndex) => {
        setIndex(tabIndex);
    };

    const renderBottomBar = () => (
        <View style={[styles.bottomBar, { height: isLandscape ? height * 0.12 : height * 0.12 }]}>
            {routes.map((route, i) => (
                <TouchableOpacity
                    key={route.key}
                    style={[
                        styles.tabButton,
                        { width: width / routes.length },
                        index === i && styles.activeTab,
                    ]}
                    onPress={() => handleTabPress(i)}
                >
                    <Icon
                        name={route.icon}
                        size={22}
                        color={index === i ? '#bccad6' : '#666'}
                    />
                    <Text style={[styles.tabText, index === i && { color: '#bccad6' }]}>
                        {route.title}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width }}
                renderTabBar={() => null}
                style={{ height: isLandscape ? height * 0.88 : height * 0.88 }}
            />
            {renderBottomBar()}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f1e3dd' },
    bottomBar: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#',
        backgroundColor: '#fff',
    },
    tabButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    activeTab: {
        borderTopWidth: 2,
        borderTopColor: '#bccad6',
    },
    tabText: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
        fontFamily: 'sans-serif',
    },
});
