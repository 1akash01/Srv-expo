import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { BottomNav as DealerBottomNav } from './src/app/components/dealer/BottomNav';
import { BottomNav as ElectricianBottomNav } from './src/app/components/electrician/BottomNav';
import { ElectriciansScreen as DealerElectriciansScreen } from './src/screens/dealer/ElectriciansScreen';
import { HomeScreen as DealerHomeScreen } from './src/screens/dealer/HomeScreen';
import { NotificationScreen as DealerNotificationScreen } from './src/screens/dealer/NotificationScreen';
import { ProductScreen as DealerProductScreen } from './src/screens/dealer/ProductScreen';
import { ProfileScreen as DealerProfileScreen } from './src/screens/dealer/ProfileScreen';
import { WalletScreen as DealerWalletScreen } from './src/screens/dealer/WalletScreen';
import { OnboardingScreen } from './src/screens/electrician/OnboardingScreen';
import { HomeScreen as ElectricianHomeScreen } from './src/screens/electrician/HomeScreen';
import { NotificationScreen as ElectricianNotificationScreen } from './src/screens/electrician/NotificationScreen';
import { ProductScreen as ElectricianProductScreen } from './src/screens/electrician/ProductScreen';
import { ProfileScreen as ElectricianProfileScreen } from './src/screens/electrician/ProfileScreen';
import { RewardsScreen as ElectricianRewardsScreen } from './src/screens/electrician/RewardsScreen';
import { ScanScreen as ElectricianScanScreen } from './src/screens/electrician/ScanScreen';
import { WalletScreen as ElectricianWalletScreen } from './src/screens/electrician/WalletScreen';
import { colors } from './src/theme';
import type { Screen, UserRole } from './src/types';

export default function App() {
  const androidTopInset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0;
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [currentRole, setCurrentRole] = useState<UserRole>('electrician');
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>('fanbox');

  const isDealer = currentRole === 'dealer';

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
    setCurrentRole('electrician');
    setCurrentScreen('home');
    setSelectedProductCategory('fanbox');
  };

  const screen = useMemo(() => {
    if (isDealer) {
      switch (currentScreen) {
        case 'home':
          return (
            <DealerHomeScreen
              onNavigate={handleNavigate}
              onOpenProductCategory={handleOpenProductCategory}
            />
          );
        case 'product':
          return (
            <DealerProductScreen
              onNavigate={handleNavigate}
              initialCategory={selectedProductCategory}
            />
          );
        case 'electricians':
          return <DealerElectriciansScreen onNavigate={handleNavigate} />;
        case 'notification':
          return <DealerNotificationScreen onNavigate={handleNavigate} />;
        case 'wallet':
          return <DealerWalletScreen onNavigate={handleNavigate} />;
        case 'profile':
          return <DealerProfileScreen onNavigate={handleNavigate} onSignOut={handleSignOut} />;
        default:
          return (
            <DealerHomeScreen
              onNavigate={handleNavigate}
              onOpenProductCategory={handleOpenProductCategory}
            />
          );
      }
    }

    switch (currentScreen) {
      case 'home':
        return (
          <ElectricianHomeScreen
            onNavigate={handleNavigate}
            onOpenProductCategory={handleOpenProductCategory}
          />
        );
      case 'product':
        return (
          <ElectricianProductScreen
            onNavigate={handleNavigate}
            initialCategory={selectedProductCategory}
          />
        );
      case 'notification':
        return <ElectricianNotificationScreen onNavigate={handleNavigate} />;
      case 'scan':
        return <ElectricianScanScreen onNavigate={handleNavigate} />;
      case 'rewards':
        return <ElectricianRewardsScreen />;
      case 'profile':
        return <ElectricianProfileScreen onNavigate={handleNavigate} onSignOut={handleSignOut} />;
      case 'wallet':
        return <ElectricianWalletScreen onNavigate={handleNavigate} />;
      default:
        return (
          <ElectricianHomeScreen
            onNavigate={handleNavigate}
            onOpenProductCategory={handleOpenProductCategory}
          />
        );
    }
  }, [currentScreen, isDealer, selectedProductCategory]);

  if (showOnboarding) {
    return (
      <View style={[styles.root, { paddingTop: androidTopInset }]}>
        <ExpoStatusBar style="dark" />
        <OnboardingScreen
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
      {isDealer ? (
        <DealerBottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
      ) : (
        <ElectricianBottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
      )}
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
