import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useOAuth, useAuth } from '@clerk/clerk-expo';

const AuthPage = ({ navigation }) => {
    const { isSignedIn } = useAuth();

    const { startOAuthFlow: startGoogleOAuth } = useOAuth({ strategy: 'oauth_google' });
    const { startOAuthFlow: startGitHubOAuth } = useOAuth({ strategy: 'oauth_github' });

    useEffect(() => {
        if (isSignedIn) {
            navigation.replace('MainTabs');
        }
    }, [isSignedIn]);

    const handleOAuthLogin = async (provider) => {
        try {
            const { createdSessionId, setActive } =
                provider === 'google' ? await startGoogleOAuth() : await startGitHubOAuth();

            if (createdSessionId) {
                await setActive({ session: createdSessionId });
                navigation.replace('MainTabs');
            }
        } catch (err) {
            console.error(`Erro ao autenticar com ${provider}:`, err);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>How do you want to log in?</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.googleButton}
                    onPress={() => handleOAuthLogin('google')}
                >
                    <Icon name="google" size={20} color="#fff" style={styles.icon} />
                    <Text style={styles.buttonText}>Login com Google</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.githubButton}
                    onPress={() => handleOAuthLogin('github')}
                >
                    <Icon name="github" size={20} color="#fff" style={styles.icon} />
                    <Text style={styles.buttonText}>Login com GitHub</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f1e3dd',
    },
    title: {
        fontSize: 24,
        fontWeight: 'arial',
        marginBottom: 40,
        color: '#667292',
        fontFamily: 'sans-serif',
    },
    buttonContainer: {
        width: '80%',
        gap: 20,
    },
    googleButton: {
        flexDirection: 'row',
        backgroundColor: '#4285f4',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    githubButton: {
        flexDirection: 'row',
        backgroundColor: '#333',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'sans-serif',
    },
    icon: {
        marginRight: 10,
    },
});

export default AuthPage;
