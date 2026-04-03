import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { BottomNav } from './src/components/BottomNav';
import { HomeScreen } from './src/screens/HomeScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { ProductScreen } from './src/screens/ProductScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { RewardsScreen } from './src/screens/RewardsScreen';
import { ScanScreen } from './src/screens/ScanScreen';
import { WalletScreen } from './src/screens/WalletScreen';
import { colors } from './src/theme';
import type { AppLanguage, Screen, UserRole } from './src/types';

export default function App() {
  const androidTopInset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0;
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [currentRole, setCurrentRole] = useState<UserRole>('electrician');
  const [language, setLanguage] = useState<AppLanguage>('en');

  const screen = useMemo(() => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={setCurrentScreen} role={currentRole} language={language} />;
      case 'product':
        return <ProductScreen onNavigate={setCurrentScreen} />;
      case 'scan':
        return <ScanScreen onNavigate={setCurrentScreen} />;
      case 'rewards':
        return <RewardsScreen />;
      case 'profile':
        return <ProfileScreen onNavigate={setCurrentScreen} />;
      case 'wallet':
        return <WalletScreen />;
      default:
        return <HomeScreen onNavigate={setCurrentScreen} role={currentRole} language={language} />;
    }
  }, [currentRole, currentScreen, language]);

  if (showOnboarding) {
    return (
      <View style={[styles.root, { paddingTop: androidTopInset }]}>
        <ExpoStatusBar style="dark" />
        <OnboardingScreen
          language={language}
          onLanguageChange={setLanguage}
          onGetStarted={(role) => {
            setCurrentRole(role);
            setCurrentScreen('home');
            setShowOnboarding(false);
          }}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.root, { paddingTop: androidTopInset }]}>
      <ExpoStatusBar style="dark" />
      <View style={styles.content}>{screen}</View>
      <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} language={language} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  content: {
    flex: 1,
  },
});
