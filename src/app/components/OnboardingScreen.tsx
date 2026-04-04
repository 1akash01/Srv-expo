import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export type UserRole = 'electrician' | 'dealer';
type AuthMode = 'login' | 'signup';

const dealerDirectory: Record<string, { dealerName: string; city: string }> = {
  '9876543210': { dealerName: 'Sharma Electricals', city: 'Delhi' },
  '9988776655': { dealerName: 'Ravi Traders', city: 'Mumbai' },
  '9123456789': { dealerName: 'Gupta Power House', city: 'Jaipur' },
};

const COLORS = {
  ink: '#20201D',
  panel: '#FFFFFF',
  shell: '#F8F8F4',
  line: '#2E2D29',
  softLine: '#DADACE',
  aqua: '#12C1CC',
  aquaDeep: '#12AEB8',
  lime: '#C8E91D',
  text: '#21211E',
  muted: '#63645D',
};

const roleMeta = {
  electrician: {
    title: 'Electrician',
    subtitle: 'Electrician',
  },
  dealer: {
    title: 'Dealer',
    subtitle: 'Dealer',
  },
} as const;

function useReveal() {
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 420,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [fade]);

  return {
    opacity: fade,
    transform: [
      {
        translateY: fade.interpolate({
          inputRange: [0, 1],
          outputRange: [18, 0],
        }),
      },
    ],
  };
}

function Header({ role }: { role: UserRole | null }) {
  const activeRole = role ? roleMeta[role].title : roleMeta.electrician.title;

  return (
    <View style={styles.headerWrap}>
      <Text style={styles.headerIntro}>Welcome to SRV</Text>
      <View style={styles.titleRow}>
        <Text style={styles.headerTitle}>{activeRole}</Text>
        <View style={styles.headerLine} />
      </View>
    </View>
  );
}

function LogoBlock() {
  return (
    <View style={styles.logoWrap}>
      <Image
        source={require('../../../assets/srv-logo.png')}
        style={styles.logoImage}
        resizeMode="contain"
      />
    </View>
  );
}

function AuthTabs({
  mode,
  onSwitch,
}: {
  mode: AuthMode;
  onSwitch: (mode: AuthMode) => void;
}) {
  return (
    <LinearGradient colors={[COLORS.aqua, COLORS.lime]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.tabShell}>
      <Pressable
        style={[styles.tabButton, mode === 'login' && styles.tabButtonActive]}
        onPress={() => onSwitch('login')}
      >
        <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>Login</Text>
      </Pressable>
      <Pressable
        style={[styles.tabButton, mode === 'signup' && styles.tabButtonActive]}
        onPress={() => onSwitch('signup')}
      >
        <Text style={[styles.tabText, mode === 'signup' && styles.tabTextActive]}>Create Account</Text>
      </Pressable>
    </LinearGradient>
  );
}

function RoleOption({
  role,
  selected,
  onPress,
}: {
  role: UserRole;
  selected: boolean;
  onPress: () => void;
}) {
  const info = roleMeta[role];

  return (
    <Pressable
      onPress={onPress}
      style={[styles.roleCard, selected && styles.roleCardSelected]}
    >
      <View style={styles.roleArtBox}>
        <View style={styles.roleArtFrame}>
          <Text style={styles.roleArtText}>Add Image</Text>
        </View>
      </View>
      <View style={styles.roleLabelBar}>
        <Text style={styles.roleLabel}>{info.title}</Text>
      </View>
      <Text style={styles.roleSubLabel}>{info.subtitle}</Text>
    </Pressable>
  );
}

function ContinueButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled: boolean;
}) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={styles.ctaOuter}>
      <LinearGradient
        colors={disabled ? ['#B8BDB6', '#B8BDB6'] : [COLORS.aqua, COLORS.lime]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.ctaButton}
      >
        <Text style={styles.ctaText}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'phone-pad' | 'numeric';
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.fieldInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#93948E"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType ?? 'default'}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}

function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.backButton}>
      <Text style={styles.backButtonText}>Back</Text>
    </Pressable>
  );
}

export function OnboardingScreen({ onGetStarted }: { onGetStarted: (role: UserRole) => void }) {
  const revealStyle = useReveal();

  const [phase, setPhase] = useState<'role' | 'auth'>('role');
  const [role, setRole] = useState<UserRole | null>('electrician');
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);

  const [loginPhone, setLoginPhone] = useState('');
  const [loginOtp, setLoginOtp] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const [signupName, setSignupName] = useState('');
  const [signupBiz, setSignupBiz] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupOtp, setSignupOtp] = useState('');
  const [signupDealerPhone, setSignupDealerPhone] = useState('');
  const [signupPass, setSignupPass] = useState('');

  const resetForm = () => {
    setLoginPhone('');
    setLoginOtp('');
    setLoginPass('');
    setSignupName('');
    setSignupBiz('');
    setSignupPhone('');
    setSignupOtp('');
    setSignupDealerPhone('');
    setSignupPass('');
    setLoading(false);
  };

  const canContinue = useMemo(() => {
    if (mode === 'login') {
      return loginPhone.length === 10 && loginOtp.length === 4 && loginPass.length >= 4;
    }

    if (signupName.trim().length < 3) return false;
    if (signupPhone.length !== 10) return false;
    if (signupOtp.length !== 4) return false;
    if (signupPass.length < 4) return false;
    if (role === 'dealer') return signupBiz.trim().length >= 3;

    return signupDealerPhone.length === 10;
  }, [
    loginOtp,
    loginPass,
    loginPhone,
    mode,
    role,
    signupBiz,
    signupDealerPhone,
    signupName,
    signupOtp,
    signupPass,
    signupPhone,
  ]);

  const handleContinue = () => {
    if (!role) return;

    if (phase === 'role') {
      resetForm();
      setPhase('auth');
      return;
    }

    if (!canContinue || loading) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onGetStarted(role);
    }, 900);
  };

  const handleBack = () => {
    resetForm();
    setPhase('role');
  };

  const handlePhone = (setter: (value: string) => void) => (value: string) => {
    setter(value.replace(/\D/g, '').slice(0, 10));
  };

  const handleOtp = (setter: (value: string) => void) => (value: string) => {
    setter(value.replace(/\D/g, '').slice(0, 4));
  };

  const matchedDealer = signupDealerPhone.length === 10 ? dealerDirectory[signupDealerPhone] : undefined;
  const activeRole = role ?? 'electrician';

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.shell} />
      <LinearGradient colors={['#F8F8F1', '#E6F5E8']} style={styles.appBg}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.deviceShell, revealStyle]}>
            <LinearGradient
              colors={['#F7F4D7', '#19BEC6']}
              locations={[0, 0.7]}
              style={styles.phoneScreen}
            >
              <Header role={role} />
              <LogoBlock />

              <View style={styles.panelWrap}>
                <View style={styles.panelCap} />
                {phase === 'auth' && <BackButton onPress={handleBack} />}

                {phase === 'role' ? (
                  <>
                    <View style={styles.roleGrid}>
                      <RoleOption
                        role="electrician"
                        selected={activeRole === 'electrician'}
                        onPress={() => setRole('electrician')}
                      />
                      <RoleOption
                        role="dealer"
                        selected={activeRole === 'dealer'}
                        onPress={() => setRole('dealer')}
                      />
                    </View>
                    <ContinueButton label="Continue" onPress={handleContinue} disabled={!role} />
                  </>
                ) : (
                  <>
                    <AuthTabs mode={mode} onSwitch={setMode} />
                    <View style={styles.formCard}>
                      {mode === 'login' ? (
                        <>
                          <FormField
                            label="Mobile Number"
                            value={loginPhone}
                            onChangeText={handlePhone(setLoginPhone)}
                            placeholder="Enter mobile number"
                            keyboardType="phone-pad"
                          />
                          <FormField
                            label="OTP"
                            value={loginOtp}
                            onChangeText={handleOtp(setLoginOtp)}
                            placeholder="Enter 4 digit OTP"
                            keyboardType="numeric"
                          />
                          <FormField
                            label="Password"
                            value={loginPass}
                            onChangeText={setLoginPass}
                            placeholder="Enter password"
                            secureTextEntry
                          />
                        </>
                      ) : (
                        <>
                          <FormField
                            label="Full Name"
                            value={signupName}
                            onChangeText={setSignupName}
                            placeholder="Enter your full name"
                          />
                          {activeRole === 'dealer' ? (
                            <FormField
                              label="Business Name"
                              value={signupBiz}
                              onChangeText={setSignupBiz}
                              placeholder="Enter business name"
                            />
                          ) : (
                            <View style={styles.fieldWrap}>
                              <Text style={styles.fieldLabel}>Dealer Number</Text>
                              <TextInput
                                style={styles.fieldInput}
                                value={signupDealerPhone}
                                onChangeText={handlePhone(setSignupDealerPhone)}
                                placeholder="Enter dealer mobile number"
                                placeholderTextColor="#93948E"
                                keyboardType="phone-pad"
                              />
                              <Text
                                style={[
                                  styles.dealerHint,
                                  { color: matchedDealer ? '#4F8E55' : COLORS.muted },
                                ]}
                              >
                                {matchedDealer
                                  ? `${matchedDealer.dealerName}, ${matchedDealer.city}`
                                  : 'Valid dealer number required'}
                              </Text>
                            </View>
                          )}
                          <FormField
                            label="Mobile Number"
                            value={signupPhone}
                            onChangeText={handlePhone(setSignupPhone)}
                            placeholder="Enter mobile number"
                            keyboardType="phone-pad"
                          />
                          <FormField
                            label="OTP"
                            value={signupOtp}
                            onChangeText={handleOtp(setSignupOtp)}
                            placeholder="Enter 4 digit OTP"
                            keyboardType="numeric"
                          />
                          <FormField
                            label="Password"
                            value={signupPass}
                            onChangeText={setSignupPass}
                            placeholder="Create password"
                            secureTextEntry
                          />
                        </>
                      )}
                    </View>

                    <ContinueButton
                      label={loading ? 'Opening...' : mode === 'login' ? 'Continue' : 'Create Account'}
                      onPress={handleContinue}
                      disabled={!canContinue || loading}
                    />
                  </>
                )}
              </View>

              <View style={styles.homeIndicator} />
            </LinearGradient>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.shell,
  },
  appBg: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 18,
  },
  deviceShell: {
    width: 328,
    alignSelf: 'center',
    borderRadius: 30,
    borderWidth: 3,
    borderColor: COLORS.line,
    backgroundColor: COLORS.shell,
    padding: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  phoneScreen: {
    minHeight: 640,
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingTop: 22,
    paddingBottom: 14,
    overflow: 'hidden',
  },
  headerWrap: {
    marginTop: 8,
    paddingHorizontal: 6,
  },
  headerIntro: {
    fontSize: 16,
    color: '#3D433F',
    fontWeight: '400',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  headerTitle: {
    fontSize: 30,
    lineHeight: 34,
    color: COLORS.text,
    fontWeight: '800',
  },
  headerLine: {
    flex: 1,
    height: 1.5,
    marginLeft: 2,
    marginTop: 8,
    backgroundColor: '#3D433F',
  },
  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    marginBottom: 24,
  },
  logoImage: {
    width: 162,
    height: 92,
  },
  panelWrap: {
    marginTop: 'auto',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 26,
    paddingTop: 12,
    paddingBottom: 8,
  },
  panelCap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 10,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    backgroundColor: COLORS.lime,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginHorizontal: 8,
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  backButtonText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '700',
  },
  tabShell: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 6,
    borderRadius: 18,
    padding: 3,
  },
  tabButton: {
    flex: 1,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  tabTextActive: {
    color: COLORS.text,
  },
  roleGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    marginHorizontal: 6,
  },
  roleCard: {
    flex: 1,
    borderRadius: 16,
    padding: 8,
    backgroundColor: COLORS.aquaDeep,
    borderWidth: 3,
    borderColor: COLORS.lime,
  },
  roleCardSelected: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  roleArtBox: {
    backgroundColor: COLORS.panel,
    borderRadius: 10,
    padding: 8,
    minHeight: 126,
  },
  roleArtFrame: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#D7D7CF',
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleArtText: {
    color: '#A5A79F',
    fontSize: 12,
    fontWeight: '600',
  },
  roleLabelBar: {
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
    paddingBottom: 3,
    alignItems: 'center',
  },
  roleLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  roleSubLabel: {
    color: '#E7F7F8',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 2,
  },
  ctaOuter: {
    marginTop: 10,
    marginHorizontal: 6,
  },
  ctaButton: {
    height: 38,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  formCard: {
    marginTop: 10,
    marginHorizontal: 6,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 18,
    padding: 12,
    gap: 10,
  },
  fieldWrap: {
    gap: 4,
  },
  fieldLabel: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '700',
  },
  fieldInput: {
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.softLine,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    color: COLORS.text,
    fontSize: 14,
  },
  dealerHint: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '600',
  },
  homeIndicator: {
    width: 124,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#545651',
    alignSelf: 'center',
    marginTop: 16,
  },
});
