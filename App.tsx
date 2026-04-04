import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { BottomNav } from './src/components/BottomNav';
import { HomeScreen } from './src/screens/HomeScreen';
import { NotificationScreen } from './src/screens/NotificationScreen';
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
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>('fanbox');

  const handleNavigate = (screen: Screen) => {
    if (screen === 'product') {
      setSelectedProductCategory((current) => current || 'fanbox');
    }

    setCurrentScreen(screen);
  };

  const handleOpenProductCategory = (category: string) => {
    setSelectedProductCategory(category);
    setCurrentScreen('product');
  };

  const handleSignOut = () => {
    setShowOnboarding(true);
    setCurrentScreen('home');
    setSelectedProductCategory('fanbox');
  };

  const screen = useMemo(() => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            currentRole={currentRole}
            onNavigate={handleNavigate}
            onOpenProductCategory={handleOpenProductCategory}
          />
        );
      case 'product':
        return <ProductScreen onNavigate={handleNavigate} initialCategory={selectedProductCategory} />;
      case 'notification':
        return <NotificationScreen onNavigate={handleNavigate} />;
      case 'scan':
        return <ScanScreen onNavigate={handleNavigate} />;
      case 'rewards':
        return <RewardsScreen />;
      case 'profile':
        return <ProfileScreen currentRole={currentRole} onNavigate={handleNavigate} onSignOut={handleSignOut} />;
      case 'wallet':
        return <WalletScreen onNavigate={handleNavigate} />;
      default:
        return (
          <HomeScreen
            currentRole={currentRole}
            onNavigate={handleNavigate}
            onOpenProductCategory={handleOpenProductCategory}
          />
        );
    }
  }, [currentRole, currentScreen, selectedProductCategory]);

  if (showOnboarding) {
    return (
      <View style={styles.root}>
        <ExpoStatusBar hidden />
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
      <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
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
