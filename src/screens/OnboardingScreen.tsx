import { LinearGradient } from 'expo-linear-gradient';
import { memo, useMemo, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { FormInput } from '../components/Common';
import { dealerDirectory } from '../data/mock';
import { colors } from '../theme';
import type { AppLanguage, UserRole } from '../types';

type AuthMode = 'login' | 'signup';
type AuthTheme = {
  stage: [string, string, string];
  active: [string, string];
  accent: string;
  soft: string;
  border: string;
};

const electricianTheme: AuthTheme = {
  stage: ['#0A1322', '#123257', '#1E4F86'],
  active: ['#2F6EE2', '#5B95FF'],
  accent: '#356FDF',
  soft: '#EEF4FF',
  border: '#D8E2F1',
};

const dealerTheme: AuthTheme = {
  stage: ['#0F1922', '#19344A', '#24526F'],
  active: ['#2E7CAA', '#58A7D8'],
  accent: '#2F80B6',
  soft: '#EEF8FC',
  border: '#D8E3EB',
};

const srvLogo = require('../../assets/srv-logo.png');
const electricianImage = require('../../assets/electrician-icon.png');
const dealerImage = require('../../assets/dealer-icon.png');

const copy = {
  en: {
    welcome: 'Welcome to SRV',
    continue: 'Continue',
    login: 'Login',
    createAccount: 'Create Account',
    back: 'Back',
    mobileNumber: 'Mobile Number',
    dealerPhone: 'Dealer Phone',
    fullName: 'Full Name',
    businessName: 'Business Name',
    password: 'Password',
    otp: 'OTP',
    resendOtp: 'Resend OTP',
    otpSentTo: 'OTP sent to',
    enterMobile: 'Enter mobile number',
    enterDealerMobile: 'Enter dealer mobile number',
    enterPassword: 'Enter password',
    enterOtp: 'Enter 4-digit OTP',
    ownerName: 'Owner or manager name',
    fullNamePlaceholder: 'Enter your full name',
    businessNamePlaceholder: 'Enter shop or firm name',
    continueToDashboard: 'Continue to dashboard',
    completeRegistration: 'Complete registration',
    openingDashboard: 'Opening dashboard...',
    verified: 'Verified',
    pending: 'Pending',
    enterTenDigitDealer: 'Enter a 10-digit dealer number',
    electricianEnglish: 'Electrician',
    electricianHindi: 'इलेक्ट्रीशियन',
    dealerEnglish: 'Dealer',
    dealerHindi: 'डीलर',
  },
  hi: {
    welcome: 'एसआरवी में आपका स्वागत है',
    continue: 'आगे बढ़ें',
    login: 'लॉगिन',
    createAccount: 'खाता बनाएं',
    back: 'वापस',
    mobileNumber: 'मोबाइल नंबर',
    dealerPhone: 'डीलर मोबाइल',
    fullName: 'पूरा नाम',
    businessName: 'बिजनेस नाम',
    password: 'पासवर्ड',
    otp: 'ओटीपी',
    resendOtp: 'ओटीपी फिर भेजें',
    otpSentTo: 'ओटीपी भेजा गया',
    enterMobile: 'मोबाइल नंबर दर्ज करें',
    enterDealerMobile: 'डीलर मोबाइल नंबर दर्ज करें',
    enterPassword: 'पासवर्ड दर्ज करें',
    enterOtp: '4 अंकों का ओटीपी दर्ज करें',
    ownerName: 'ओनर या मैनेजर का नाम',
    fullNamePlaceholder: 'अपना पूरा नाम दर्ज करें',
    businessNamePlaceholder: 'दुकान या फर्म का नाम दर्ज करें',
    continueToDashboard: 'डैशबोर्ड पर जाएं',
    completeRegistration: 'रजिस्ट्रेशन पूरा करें',
    openingDashboard: 'डैशबोर्ड खुल रहा है...',
    verified: 'सत्यापित',
    pending: 'लंबित',
    enterTenDigitDealer: '10 अंकों का डीलर नंबर दर्ज करें',
    electricianEnglish: 'Electrician',
    electricianHindi: 'इलेक्ट्रीशियन',
    dealerEnglish: 'Dealer',
    dealerHindi: 'डीलर',
  },
} as const;

export function OnboardingScreen({
  onGetStarted,
  language,
  onLanguageChange,
}: {
  onGetStarted: (role: UserRole) => void;
  language: AppLanguage;
  onLanguageChange: (language: AppLanguage) => void;
}) {
  const { width } = useWindowDimensions();
  const compact = width < 390;
  const [step, setStep] = useState<'role' | 'auth'>('role');
  const [role, setRole] = useState<UserRole>('electrician');
  const [mode, setMode] = useState<AuthMode>('login');
  const [languageOpen, setLanguageOpen] = useState(false);
  const [loginPhone, setLoginPhone] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [loginOtp, setLoginOtp] = useState('');
  const [signupOtp, setSignupOtp] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [dealerPhone, setDealerPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const t = copy[language];
  const theme = role === 'dealer' ? dealerTheme : electricianTheme;
  const roleLabel = role === 'dealer' ? t.dealerEnglish : t.electricianEnglish;
  const loginOtpSent = loginPhone.length === 10;
  const signupOtpSent = signupPhone.length === 10;
  const dealerMatch = dealerPhone.length === 10 ? dealerDirectory[dealerPhone] : undefined;

  const canContinueAuth = useMemo(() => {
    if (mode === 'login') {
      return loginPhone.length === 10 && loginOtp.length === 4 && password.trim().length >= 6;
    }
    if (fullName.trim().length < 3 || signupPhone.length !== 10 || signupOtp.length !== 4) {
      return false;
    }
    if (role === 'dealer') {
      return businessName.trim().length >= 3;
    }
    return dealerPhone.length === 10;
  }, [businessName, dealerPhone.length, fullName, loginOtp.length, loginPhone.length, mode, password, role, signupOtp.length, signupPhone.length]);

  const resetAuth = () => {
    setLoginPhone('');
    setSignupPhone('');
    setLoginOtp('');
    setSignupOtp('');
    setPassword('');
    setFullName('');
    setBusinessName('');
    setDealerPhone('');
    setLoading(false);
  };

  const openAuth = () => {
    resetAuth();
    setStep('auth');
  };

  const goBack = () => {
    resetAuth();
    setStep('role');
  };

  const handleSubmit = () => {
    if (!canContinueAuth || loading) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onGetStarted(role);
    }, 700);
  };

  return (
    <LinearGradient colors={theme.stage} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.page}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={[styles.container, compact && styles.containerCompact]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <Text style={[styles.welcomeText, compact && styles.welcomeTextCompact]}>{t.welcome}</Text>

            <View style={styles.languageWrap}>
              <Pressable onPress={() => setLanguageOpen((value) => !value)} style={styles.languageButton}>
                <Text style={styles.languageButtonText}>{language === 'en' ? 'English' : 'हिंदी'}</Text>
              </Pressable>
              {languageOpen ? (
                <View style={styles.languageMenu}>
                  <Pressable onPress={() => { onLanguageChange('en'); setLanguageOpen(false); }} style={styles.languageItem}>
                    <Text style={styles.languageItemText}>English</Text>
                  </Pressable>
                  <Pressable onPress={() => { onLanguageChange('hi'); setLanguageOpen(false); }} style={styles.languageItem}>
                    <Text style={styles.languageItemText}>हिंदी</Text>
                  </Pressable>
                </View>
              ) : null}
            </View>
          </View>

          <View style={styles.logoCard}>
            <Image source={srvLogo} style={[styles.logoImage, compact && styles.logoImageCompact]} resizeMode="contain" />
          </View>

          {step === 'role' ? (
            <View style={styles.roleBlock}>
              <View style={[styles.roleGrid, compact && styles.roleGridCompact]}>
                <RoleCard
                  title={t.electricianEnglish}
                  subtitle={t.electricianHindi}
                  imageSource={electricianImage}
                  active={role === 'electrician'}
                  onPress={() => setRole('electrician')}
                  accent={electricianTheme.accent}
                  border={electricianTheme.border}
                  soft={electricianTheme.soft}
                />
                <RoleCard
                  title={t.dealerEnglish}
                  subtitle={t.dealerHindi}
                  imageSource={dealerImage}
                  active={role === 'dealer'}
                  onPress={() => setRole('dealer')}
                  accent={dealerTheme.accent}
                  border={dealerTheme.border}
                  soft={dealerTheme.soft}
                />
              </View>

              <Pressable onPress={openAuth} style={[styles.primaryAction, { backgroundColor: theme.accent }]}>
                <Text style={styles.primaryActionText}>{t.continue}</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.authBlock}>
              <View style={styles.authTopRow}>
                <Pressable onPress={goBack} style={styles.backButton}>
                  <Text style={styles.backButtonText}>{t.back}</Text>
                </Pressable>
                <View style={[styles.rolePill, { borderColor: theme.accent }]}>
                  <Text style={[styles.rolePillText, { color: theme.accent }]}>{roleLabel}</Text>
                </View>
              </View>

              <View style={styles.tabRow}>
                {(['login', 'signup'] as const).map((item) => {
                  const active = mode === item;
                  return (
                    <Pressable key={item} onPress={() => setMode(item)} style={styles.tabWrap}>
                      {active ? (
                        <LinearGradient colors={theme.active} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.tabActive}>
                          <Text style={styles.tabActiveText}>{item === 'login' ? t.login : t.createAccount}</Text>
                        </LinearGradient>
                      ) : (
                        <View style={styles.tab}>
                          <Text style={styles.tabText}>{item === 'login' ? t.login : t.createAccount}</Text>
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.formArea}>
                {mode === 'login' ? (
                  <>
                    <PhoneField value={loginPhone} onChangeText={setLoginPhone} label={t.mobileNumber} placeholder={t.enterMobile} focusColor={theme.accent} borderColor={theme.border} />
                    {loginOtpSent ? (
                      <OtpField
                        phone={loginPhone}
                        value={loginOtp}
                        onChangeText={setLoginOtp}
                        resendLabel={t.resendOtp}
                        sentToLabel={t.otpSentTo}
                        fieldLabel={t.otp}
                        placeholder={t.enterOtp}
                        focusColor={theme.accent}
                        borderColor={theme.border}
                      />
                    ) : null}
                    <FormInput label={t.password} value={password} onChangeText={setPassword} placeholder={t.enterPassword} secureTextEntry />
                  </>
                ) : (
                  <>
                    <FormInput
                      label={t.fullName}
                      value={fullName}
                      onChangeText={setFullName}
                      placeholder={role === 'dealer' ? t.ownerName : t.fullNamePlaceholder}
                    />

                    {role === 'dealer' ? (
                      <FormInput label={t.businessName} value={businessName} onChangeText={setBusinessName} placeholder={t.businessNamePlaceholder} />
                    ) : (
                      <View style={[styles.infoCard, { borderColor: theme.border, backgroundColor: theme.soft }]}>
                        <PhoneField
                          value={dealerPhone}
                          onChangeText={setDealerPhone}
                          label={t.dealerPhone}
                          placeholder={t.enterDealerMobile}
                          focusColor={theme.accent}
                          borderColor={theme.border}
                        />
                        <View style={styles.infoMeta}>
                          <View style={styles.verifyChip}>
                            <Text style={[styles.verifyChipText, { color: theme.accent }]}>{dealerPhone.length === 10 ? t.verified : t.pending}</Text>
                          </View>
                          <Text style={styles.infoMetaText}>{dealerMatch ? `${dealerMatch.dealerName}, ${dealerMatch.city}` : t.enterTenDigitDealer}</Text>
                        </View>
                      </View>
                    )}

                    <PhoneField value={signupPhone} onChangeText={setSignupPhone} label={t.mobileNumber} placeholder={t.enterMobile} focusColor={theme.accent} borderColor={theme.border} />
                    {signupOtpSent ? (
                      <OtpField
                        phone={signupPhone}
                        value={signupOtp}
                        onChangeText={setSignupOtp}
                        resendLabel={t.resendOtp}
                        sentToLabel={t.otpSentTo}
                        fieldLabel={t.otp}
                        placeholder={t.enterOtp}
                        focusColor={theme.accent}
                        borderColor={theme.border}
                      />
                    ) : null}
                  </>
                )}

                <AuthButton
                  label={loading ? t.openingDashboard : mode === 'login' ? t.continueToDashboard : t.completeRegistration}
                  onPress={handleSubmit}
                  disabled={!canContinueAuth || loading}
                  colors={theme.active}
                />
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const RoleCard = memo(function RoleCard({
  title,
  subtitle,
  imageSource,
  active,
  onPress,
  accent,
  border,
  soft,
}: {
  title: string;
  subtitle: string;
  imageSource: number;
  active: boolean;
  onPress: () => void;
  accent: string;
  border: string;
  soft: string;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.roleCard, { borderColor: active ? accent : border, backgroundColor: active ? soft : '#FFFFFF' }]}>
      <View style={[styles.roleImageWrap, { borderColor: active ? accent : border }]}>
        <Image source={imageSource} style={styles.roleImage} resizeMode="contain" />
      </View>
      <Text style={styles.roleTitle}>{title}</Text>
      <Text style={[styles.roleSubtitle, { color: active ? accent : '#6D8297' }]}>{subtitle}</Text>
    </Pressable>
  );
});

function AuthButton({
  label,
  onPress,
  disabled,
  colors: gradientColors,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  colors: [string, string];
}) {
  if (disabled) {
    return (
      <View style={styles.authButtonDisabled}>
        <Text style={styles.authButtonDisabledText}>{label}</Text>
      </View>
    );
  }

  return (
    <Pressable onPress={onPress}>
      <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.authButton}>
        <Text style={styles.authButtonText}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

function PhoneField({
  value,
  onChangeText,
  label,
  placeholder,
  focusColor,
  borderColor,
}: {
  value: string;
  onChangeText: (value: string) => void;
  label: string;
  placeholder: string;
  focusColor: string;
  borderColor: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.phoneField, { borderColor: focused ? focusColor : borderColor }]}>
        <Text style={[styles.countryCode, { color: focusColor }]}>+91</Text>
        <View style={styles.phoneDivider} />
        <TextInput
          value={value}
          onChangeText={(next) => onChangeText(next.replace(/\D/g, '').slice(0, 10))}
          keyboardType="phone-pad"
          placeholder={placeholder}
          placeholderTextColor="#8EA0B0"
          style={styles.phoneInput}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
    </View>
  );
}

function OtpField({
  phone,
  value,
  onChangeText,
  resendLabel,
  sentToLabel,
  fieldLabel,
  placeholder,
  focusColor,
  borderColor,
}: {
  phone: string;
  value: string;
  onChangeText: (value: string) => void;
  resendLabel: string;
  sentToLabel: string;
  fieldLabel: string;
  placeholder: string;
  focusColor: string;
  borderColor: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.infoCard, { borderColor, backgroundColor: '#F8FBFE' }]}>
      <View style={styles.otpRow}>
        <Text style={styles.otpInfo}>{sentToLabel} +91 {phone}</Text>
        <Text style={[styles.otpLink, { color: focusColor }]}>{resendLabel}</Text>
      </View>
      <View>
        <Text style={styles.fieldLabel}>{fieldLabel}</Text>
        <View style={[styles.phoneField, { borderColor: focused ? focusColor : borderColor }]}>
          <TextInput
            value={value}
            onChangeText={(next) => onChangeText(next.replace(/\D/g, '').slice(0, 4))}
            keyboardType="numeric"
            placeholder={placeholder}
            placeholderTextColor="#8EA0B0"
            style={styles.phoneInput}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 18,
    justifyContent: 'center',
  },
  containerCompact: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  welcomeText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 29,
    fontWeight: '900',
  },
  welcomeTextCompact: {
    fontSize: 26,
  },
  languageWrap: {
    zIndex: 20,
  },
  languageButton: {
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  languageButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  languageMenu: {
    position: 'absolute',
    top: 42,
    right: 0,
    minWidth: 124,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D7E2EC',
  },
  languageItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  languageItemText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  logoCard: {
    marginTop: 18,
    marginBottom: 18,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 194,
    height: 74,
  },
  logoImageCompact: {
    width: 170,
    height: 64,
  },
  roleBlock: {
    borderRadius: 28,
    backgroundColor: '#F7FAFD',
    padding: 14,
  },
  roleGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  roleGridCompact: {
    gap: 10,
  },
  roleCard: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 18,
  },
  roleImageWrap: {
    width: 104,
    height: 104,
    borderRadius: 24,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  roleImage: {
    width: 82,
    height: 82,
  },
  roleTitle: {
    marginTop: 14,
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  roleSubtitle: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '700',
  },
  primaryAction: {
    marginTop: 18,
    alignSelf: 'center',
    minWidth: 180,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 18,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  authBlock: {
    borderRadius: 28,
    backgroundColor: '#F7FAFD',
    padding: 14,
  },
  authTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  backButton: {
    borderRadius: 14,
    backgroundColor: '#EAF0F7',
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  backButtonText: {
    color: '#2C455E',
    fontSize: 12,
    fontWeight: '800',
  },
  rolePill: {
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  rolePillText: {
    fontSize: 13,
    fontWeight: '900',
  },
  tabRow: {
    flexDirection: 'row',
    gap: 10,
  },
  tabWrap: {
    flex: 1,
  },
  tab: {
    minHeight: 48,
    borderRadius: 18,
    backgroundColor: '#EAF0F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    color: '#687E94',
    fontSize: 14,
    fontWeight: '700',
  },
  tabActive: {
    minHeight: 48,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActiveText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  formArea: {
    marginTop: 16,
    gap: 14,
  },
  fieldLabel: {
    marginBottom: 8,
    color: '#64798C',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  phoneField: {
    minHeight: 58,
    borderRadius: 18,
    borderWidth: 1.5,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCode: {
    fontSize: 17,
    fontWeight: '800',
  },
  phoneDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#DCE4EC',
    marginHorizontal: 12,
  },
  phoneInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  infoCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 12,
    gap: 12,
  },
  infoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  verifyChip: {
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  verifyChipText: {
    fontSize: 11,
    fontWeight: '800',
  },
  infoMetaText: {
    flex: 1,
    color: '#6B8093',
    fontSize: 12,
    lineHeight: 17,
  },
  otpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  otpInfo: {
    flex: 1,
    color: '#6B8093',
    fontSize: 12,
  },
  otpLink: {
    fontSize: 12,
    fontWeight: '800',
  },
  authButton: {
    minHeight: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  authButtonDisabled: {
    minHeight: 56,
    borderRadius: 18,
    backgroundColor: '#D6E0EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authButtonDisabledText: {
    color: '#6E8296',
    fontSize: 15,
    fontWeight: '800',
  },
});
