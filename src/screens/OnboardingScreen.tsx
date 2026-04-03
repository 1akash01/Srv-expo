import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import { colors } from '../theme';
import type { AppLanguage, UserRole } from '../types';

type AuthMode = 'login' | 'signup';
type Stage = 'role' | 'auth';

type DealerForm = {
  mobile: string;
  otp: string;
  password: string;
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  taxId: string;
  taxHolderName: string;
  agreed: boolean;
};

type ElectricianForm = {
  mobile: string;
  otp: string;
  password: string;
  fullName: string;
  dealerMobile: string;
};

type DealerField = keyof DealerForm;
type ElectricianField = keyof ElectricianForm;
type DealerErrors = Partial<Record<DealerField, string>>;
type ElectricianErrors = Partial<Record<ElectricianField, string>>;

const translations = {
  en: {
    welcome: 'Welcome to SRV',
    chooseLanguage: 'Language',
    chooseRole: 'Choose your role to continue',
    dealer: 'Dealer',
    electrician: 'Electrician',
    dealerHindi: 'डीलर',
    electricianHindi: 'इलेक्ट्रीशियन',
    continue: 'Continue',
    back: 'Back',
    login: 'Login',
    signup: 'Create Account',
    mobile: 'Mobile Number',
    otp: 'OTP',
    password: 'Password',
    fullName: 'Full Name',
    dealerMobile: 'Dealer Mobile Number',
    dealerCodeHint: 'Enter linked dealer number',
    optionalEmail: 'Email (Optional)',
    nameRequired: 'Name',
    address: 'Address',
    useCurrent: 'Use current address',
    openMap: 'Open map',
    city: 'City',
    state: 'State',
    pincode: 'Pincode',
    taxId: 'GST Number / PAN Number',
    taxName: 'GST Holder Name / PAN Holder Name',
    agree: 'I agree to the terms and conditions',
    createAccount: 'Create Account',
    fetchAddress: 'Fetching current address...',
    passwordShow: 'Show',
    passwordHide: 'Hide',
    dealerTitle: 'Dealer Access',
    electricianTitle: 'Electrician Access',
    dealerSubtitle: 'Manage accounts, orders, and growth tools.',
    electricianSubtitle: 'Login to scan, earn, and track rewards.',
    resend: 'Resend OTP',
    selectLanguage: 'Select language',
  },
  hi: {
    welcome: 'वेलकम टू SRV',
    chooseLanguage: 'भाषा',
    chooseRole: 'आगे बढ़ने के लिए भूमिका चुनें',
    dealer: 'डीलर',
    electrician: 'इलेक्ट्रीशियन',
    dealerHindi: 'डीलर',
    electricianHindi: 'इलेक्ट्रीशियन',
    continue: 'जारी रखें',
    back: 'वापस',
    login: 'लॉगिन',
    signup: 'खाता बनाएं',
    mobile: 'मोबाइल नंबर',
    otp: 'ओटीपी',
    password: 'पासवर्ड',
    fullName: 'पूरा नाम',
    dealerMobile: 'डीलर मोबाइल नंबर',
    dealerCodeHint: 'लिंक किया गया डीलर नंबर दर्ज करें',
    optionalEmail: 'ईमेल (वैकल्पिक)',
    nameRequired: 'नाम',
    address: 'पता',
    useCurrent: 'वर्तमान पता लें',
    openMap: 'मैप खोलें',
    city: 'शहर',
    state: 'राज्य',
    pincode: 'पिनकोड',
    taxId: 'GST नंबर / PAN नंबर',
    taxName: 'GST धारक नाम / PAN धारक नाम',
    agree: 'मैं नियम और शर्तों से सहमत हूं',
    createAccount: 'खाता बनाएं',
    fetchAddress: 'वर्तमान पता लाया जा रहा है...',
    passwordShow: 'दिखाएं',
    passwordHide: 'छुपाएं',
    dealerTitle: 'डीलर एक्सेस',
    electricianTitle: 'इलेक्ट्रीशियन एक्सेस',
    dealerSubtitle: 'अकाउंट, ऑर्डर और ग्रोथ टूल्स संभालें।',
    electricianSubtitle: 'स्कैन, रिवॉर्ड और गतिविधि के लिए लॉगिन करें।',
    resend: 'ओटीपी फिर भेजें',
    selectLanguage: 'भाषा चुनें',
  },
  pa: {
    welcome: 'ਵੈਲਕਮ ਟੂ SRV',
    chooseLanguage: 'ਭਾਸ਼ਾ',
    chooseRole: 'ਅੱਗੇ ਵਧਣ ਲਈ ਰੋਲ ਚੁਣੋ',
    dealer: 'ਡੀਲਰ',
    electrician: 'ਇਲੈਕਟ੍ਰੀਸ਼ਨ',
    dealerHindi: 'ਡੀਲਰ',
    electricianHindi: 'ਇਲੈਕਟ੍ਰੀਸ਼ਨ',
    continue: 'ਜਾਰੀ ਰੱਖੋ',
    back: 'ਵਾਪਸ',
    login: 'ਲਾਗਇਨ',
    signup: 'ਖਾਤਾ ਬਣਾਓ',
    mobile: 'ਮੋਬਾਈਲ ਨੰਬਰ',
    otp: 'ਓਟੀਪੀ',
    password: 'ਪਾਸਵਰਡ',
    fullName: 'ਪੂਰਾ ਨਾਮ',
    dealerMobile: 'ਡੀਲਰ ਮੋਬਾਈਲ ਨੰਬਰ',
    dealerCodeHint: 'ਜੁੜਿਆ ਡੀਲਰ ਨੰਬਰ ਦਰਜ ਕਰੋ',
    optionalEmail: 'ਈਮੇਲ (ਚੋਣਵਾਂ)',
    nameRequired: 'ਨਾਮ',
    address: 'ਪਤਾ',
    useCurrent: 'ਮੌਜੂਦਾ ਪਤਾ ਲਵੋ',
    openMap: 'ਮੈਪ ਖੋਲ੍ਹੋ',
    city: 'ਸ਼ਹਿਰ',
    state: 'ਰਾਜ',
    pincode: 'ਪਿਨਕੋਡ',
    taxId: 'GST ਨੰਬਰ / PAN ਨੰਬਰ',
    taxName: 'GST ਧਾਰਕ ਨਾਮ / PAN ਧਾਰਕ ਨਾਮ',
    agree: 'ਮੈਂ ਨਿਯਮਾਂ ਅਤੇ ਸ਼ਰਤਾਂ ਨਾਲ ਸਹਿਮਤ ਹਾਂ',
    createAccount: 'ਖਾਤਾ ਬਣਾਓ',
    fetchAddress: 'ਮੌਜੂਦਾ ਪਤਾ ਲਿਆ ਜਾ ਰਿਹਾ ਹੈ...',
    passwordShow: 'ਵੇਖੋ',
    passwordHide: 'ਛੁਪਾਓ',
    dealerTitle: 'ਡੀਲਰ ਐਕਸੈਸ',
    electricianTitle: 'ਇਲੈਕਟ੍ਰੀਸ਼ਨ ਐਕਸੈਸ',
    dealerSubtitle: 'ਅਕਾਊਂਟ, ਆਰਡਰ ਅਤੇ ਗ੍ਰੋਥ ਟੂਲ ਸੰਭਾਲੋ।',
    electricianSubtitle: 'ਸਕੈਨ, ਇਨਾਮ ਅਤੇ ਐਕਟਿਵਿਟੀ ਲਈ ਲਾਗਇਨ ਕਰੋ।',
    resend: 'ਓਟੀਪੀ ਮੁੜ ਭੇਜੋ',
    selectLanguage: 'ਭਾਸ਼ਾ ਚੁਣੋ',
  },
} as const;

const languageOptions: Array<{ id: AppLanguage; label: string }> = [
  { id: 'en', label: 'English' },
  { id: 'hi', label: 'हिंदी' },
  { id: 'pa', label: 'ਪੰਜਾਬੀ' },
];

const emptyDealerForm = (): DealerForm => ({
  mobile: '',
  otp: '',
  password: '',
  name: '',
  email: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  taxId: '',
  taxHolderName: '',
  agreed: false,
});

const emptyElectricianForm = (): ElectricianForm => ({
  mobile: '',
  otp: '',
  password: '',
  fullName: '',
  dealerMobile: '',
});

const logo = require('../../assets/srv-logo.png');
const dealerImage = require('../../assets/dealer-icon.png');
const electricianImage = require('../../assets/electrician-icon.png');

const sanitizeDigits = (value: string, max = 10) => value.replace(/\D/g, '').slice(0, max);
const dealerDirectory: Record<string, string> = {
  '9876543210': 'SRV Prime Dealer',
  '9123456789': 'Mansa Trade House',
  '9988776655': 'Punjab Electricals Hub',
};

export function OnboardingScreen({
  onGetStarted,
  language = 'en',
  onLanguageChange,
}: {
  onGetStarted: (role: UserRole) => void;
  language?: AppLanguage;
  onLanguageChange?: (language: AppLanguage) => void;
}) {
  const { width, height } = useWindowDimensions();
  const [stage, setStage] = useState<Stage>('role');
  const [role, setRole] = useState<UserRole>('electrician');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [dealerForm, setDealerForm] = useState<DealerForm>(emptyDealerForm);
  const [electricianForm, setElectricianForm] = useState<ElectricianForm>(emptyElectricianForm);
  const [dealerErrors, setDealerErrors] = useState<DealerErrors>({});
  const [electricianErrors, setElectricianErrors] = useState<ElectricianErrors>({});
  const [fetchingAddress, setFetchingAddress] = useState(false);
  const [loginOtpVerified, setLoginOtpVerified] = useState(false);
  const [signupOtpVerified, setSignupOtpVerified] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [verifyingDealer, setVerifyingDealer] = useState(false);
  const [verifiedDealerName, setVerifiedDealerName] = useState('');
  const [loginMobileConfirmed, setLoginMobileConfirmed] = useState(false);
  const [signupMobileConfirmed, setSignupMobileConfirmed] = useState(false);
  const logoFloat = useRef(new Animated.Value(0)).current;
  const loginMobileRef = useRef<any>(null);
  const dealerMobileRef = useRef<any>(null);
  const electricianMobileRef = useRef<any>(null);
  const electricianDealerRef = useRef<any>(null);
  const loginOtpRef = useRef<any>(null);
  const dealerOtpRef = useRef<any>(null);
  const electricianOtpRef = useRef<any>(null);

  const text = translations[language];
  const cardWidth = Math.min(168, (width - 52) / 2);
  const isDealer = role === 'dealer';
  const accent = isDealer ? '#2D5B9A' : '#178F77';
  const accentSoft = isDealer ? '#EAF2FF' : '#E7F7F2';
  const stageMinHeight = Math.max(height - 20, 680);
  const topSpacing = useMemo(() => Math.max(52, Math.min(88, height * 0.08)), [height]);

  const roleTitle = isDealer ? text.dealerTitle : text.electricianTitle;
  const roleSubtitle = isDealer ? text.dealerSubtitle : text.electricianSubtitle;
  const activeForm = isDealer ? dealerForm : electricianForm;
  const loginOtpVisible = activeForm.mobile.length === 10;
  const dealerOtpVisible = dealerForm.mobile.length === 10;
  const electricianOtpVisible = electricianForm.mobile.length === 10;
  const activeErrors = isDealer ? dealerErrors : electricianErrors;
  const loginPasswordVisible = loginOtpVerified;
  const dealerSignupAfterOtp = signupOtpVerified;
  const dealerShowName = dealerSignupAfterOtp;
  const dealerShowEmail = dealerForm.name.trim().length > 0;
  const dealerShowAddress = dealerForm.name.trim().length > 0;
  const dealerShowCityState = dealerForm.address.trim().length > 0;
  const dealerShowPincode = dealerForm.city.trim().length > 0 && dealerForm.state.trim().length > 0;
  const dealerShowTaxFields = dealerForm.pincode.length === 6;
  const dealerShowAgreement = dealerShowTaxFields;
  const electricianShowDealerMobile = electricianForm.fullName.trim().length > 0;
  const electricianShowMobile = verifiedDealerName.length > 0;
  const electricianShowOtp = signupMobileConfirmed && electricianOtpVisible;
  const electricianShowPassword = signupOtpVerified;
  const roleContinueColors: [string, string] = role === 'dealer' ? ['#14B8A6', '#2D6CDF'] : ['#2D6CDF', '#8B5CF6'];

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoFloat, { toValue: -5, duration: 1800, useNativeDriver: true }),
        Animated.timing(logoFloat, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ])
    ).start();
  }, [logoFloat]);

  const resetForms = () => {
    setDealerForm(emptyDealerForm());
    setElectricianForm(emptyElectricianForm());
    setDealerErrors({});
    setElectricianErrors({});
    setShowPassword(false);
    setLoginOtpVerified(false);
    setSignupOtpVerified(false);
    setVerifiedDealerName('');
    setLoginMobileConfirmed(false);
    setSignupMobileConfirmed(false);
  };

  const closeOverlays = () => {
    if (showLanguageMenu) {
      setShowLanguageMenu(false);
    }
    Keyboard.dismiss();
  };

  const updateDealer = (key: keyof DealerForm, value: string | boolean) => {
    setDealerForm((current) => ({ ...current, [key]: value }));
    setDealerErrors((current) => ({ ...current, [key]: undefined }));
    if (key === 'mobile') {
      setLoginOtpVerified(false);
      setSignupOtpVerified(false);
      setLoginMobileConfirmed(false);
      setSignupMobileConfirmed(false);
    }
  };

  const updateElectrician = (key: keyof ElectricianForm, value: string) => {
    setElectricianForm((current) => ({ ...current, [key]: value }));
    setElectricianErrors((current) => ({ ...current, [key]: undefined }));
    if (key === 'mobile') {
      setLoginOtpVerified(false);
      setSignupOtpVerified(false);
      setLoginMobileConfirmed(false);
      setSignupMobileConfirmed(false);
    }
    if (key === 'dealerMobile') {
      setVerifiedDealerName('');
    }
  };

  const validateDealerField = (key: DealerField, value: DealerForm[DealerField]) => {
    if (key === 'email') return '';
    if (key === 'taxId' || key === 'taxHolderName') return '';
    if (key === 'agreed') return value ? '' : 'Please accept terms and conditions.';
    if (key === 'mobile') return String(value).length === 10 ? '' : 'Please enter mobile number.';
    if (key === 'otp') return String(value).length === 6 ? '' : 'Please enter OTP.';
    if (key === 'password') return String(value).trim().length >= 6 ? '' : 'Please enter minimum 6 digit password.';
    if (key === 'pincode') return String(value).length === 6 ? '' : 'Please enter pincode.';
    if (key === 'name') return String(value).trim() ? '' : 'Please enter name field.';
    if (key === 'address') return String(value).trim() ? '' : 'Please enter address field.';
    if (key === 'city') return String(value).trim() ? '' : 'Please enter city field.';
    if (key === 'state') return String(value).trim() ? '' : 'Please enter state field.';
    return String(value).trim() ? '' : 'Please fill this field.';
  };

  const validateElectricianField = (key: ElectricianField, value: ElectricianForm[ElectricianField]) => {
    if (key === 'mobile') return String(value).length === 10 ? '' : 'Please enter mobile number.';
    if (key === 'dealerMobile') return String(value).length === 10 ? '' : 'Please enter dealer mobile field.';
    if (key === 'otp') return String(value).length === 6 ? '' : 'Please enter OTP.';
    if (key === 'password') return String(value).trim().length >= 6 ? '' : 'Please enter minimum 6 digit password.';
    if (key === 'fullName') return String(value).trim() ? '' : 'Please enter full name field.';
    return String(value).trim() ? '' : 'Please fill this field.';
  };

  const blurDealerField = (key: DealerField) => {
    const error = validateDealerField(key, dealerForm[key]);
    setDealerErrors((current) => ({ ...current, [key]: error || undefined }));
  };

  const blurElectricianField = (key: ElectricianField) => {
    const error = validateElectricianField(key, electricianForm[key]);
    setElectricianErrors((current) => ({ ...current, [key]: error || undefined }));
  };

  const verifyOtp = async () => {
    const otpValue = authMode === 'login' ? activeForm.otp : isDealer ? dealerForm.otp : electricianForm.otp;
    const mobileValue = authMode === 'login' ? activeForm.mobile : isDealer ? dealerForm.mobile : electricianForm.mobile;
    if (mobileValue.length !== 10) {
      Alert.alert('Mobile number required', 'Please enter a valid 10-digit mobile number first.');
      return;
    }
    if (otpValue.length !== 6) {
      Alert.alert('OTP required', 'Please enter the 6-digit OTP first.');
      return;
    }
    if (authMode === 'login') {
      if (isDealer) {
        dealerOtpRef.current?.blur();
      } else {
        electricianOtpRef.current?.blur();
      }
    } else if (isDealer) {
      dealerOtpRef.current?.blur();
    } else {
      electricianOtpRef.current?.blur();
    }
    Keyboard.dismiss();
    setVerifyingOtp(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setVerifyingOtp(false);
    if (authMode === 'login') {
      setLoginOtpVerified(true);
    } else {
      setSignupOtpVerified(true);
    }
  };

  const confirmMobileStep = () => {
    if (authMode === 'login') {
      const mobileError = isDealer ? validateDealerField('mobile', dealerForm.mobile) : validateElectricianField('mobile', electricianForm.mobile);
      if (mobileError) {
        isDealer
          ? setDealerErrors((current) => ({ ...current, mobile: mobileError }))
          : setElectricianErrors((current) => ({ ...current, mobile: mobileError }));
        return;
      }
      if (isDealer) {
        dealerMobileRef.current?.blur();
      } else {
        electricianMobileRef.current?.blur();
      }
      Keyboard.dismiss();
      setLoginMobileConfirmed(true);
      return;
    }

    const mobileValue = isDealer ? dealerForm.mobile : electricianForm.mobile;
    const mobileError = isDealer ? validateDealerField('mobile', mobileValue) : validateElectricianField('mobile', mobileValue);
    if (mobileError) {
      isDealer
        ? setDealerErrors((current) => ({ ...current, mobile: mobileError }))
        : setElectricianErrors((current) => ({ ...current, mobile: mobileError }));
      return;
    }
    if (isDealer) {
      dealerMobileRef.current?.blur();
    } else {
      electricianMobileRef.current?.blur();
    }
    Keyboard.dismiss();
    setSignupMobileConfirmed(true);
  };

  const verifyDealerLink = async () => {
    if (electricianForm.dealerMobile.length !== 10) {
      setElectricianErrors((current) => ({ ...current, dealerMobile: 'Please enter dealer mobile field.' }));
      return;
    }
    electricianDealerRef.current?.blur();
    Keyboard.dismiss();
    setVerifyingDealer(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    const dealerName = dealerDirectory[electricianForm.dealerMobile] || 'SRV Demo Dealer';
    setVerifyingDealer(false);
    if (dealerName) {
      setVerifiedDealerName(dealerName);
      setElectricianErrors((current) => ({ ...current, dealerMobile: undefined }));
      return;
    }
    setVerifiedDealerName('');
    setElectricianErrors((current) => ({ ...current, dealerMobile: 'Dealer number could not be verified.' }));
  };

  const fetchCurrentAddress = async () => {
    try {
      setFetchingAddress(true);
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Location permission', 'Please allow location access to fetch the current address.');
        return;
      }

      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const place = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      const item = place[0];
      if (!item) {
        Alert.alert('Address unavailable', 'We could not fetch your current address right now.');
        return;
      }

      const joinedAddress = [item.name, item.street, item.subregion, item.district].filter(Boolean).join(', ');
      setDealerForm((current) => ({
        ...current,
        address: joinedAddress || current.address,
        city: item.city || item.subregion || current.city,
        state: item.region || current.state,
        pincode: item.postalCode || current.pincode,
      }));
    } catch {
      Alert.alert('Location error', 'Unable to fetch current address. Please type it manually.');
    } finally {
      setFetchingAddress(false);
    }
  };

  const validateAndProceed = () => {
    onGetStarted(role);
  };

  const openMap = async () => {
    const query = encodeURIComponent(dealerForm.address || 'SRV Electricals');
    const url = Platform.select({
      ios: `http://maps.apple.com/?q=${query}`,
      default: `https://www.google.com/maps/search/?api=1&query=${query}`,
    });
    if (url) {
      await Linking.openURL(url);
    }
  };

  const handleRoleContinue = () => {
    setStage('auth');
    setAuthMode('login');
    resetForms();
  };

  const handleBack = () => {
    setStage('role');
    resetForms();
  };

  const handlePrimaryAction = () => {
    if (stage === 'role') {
      handleRoleContinue();
      return;
    }
    validateAndProceed();
  };

  return (
    <TouchableWithoutFeedback onPress={closeOverlays} accessible={false}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 26 : 2}
      >
        <LinearGradient colors={['#F8F3EB', '#F4EFE7', '#EEE6DB']} style={styles.flex}>
          <View style={styles.backgroundBlobTop} />
          <View style={styles.backgroundBlobBottom} />
          <ScrollView
            style={styles.flex}
            contentContainerStyle={[styles.scrollContent, { minHeight: stageMinHeight, paddingTop: stage === 'role' ? 0 : topSpacing }]}
            scrollEnabled={stage !== 'role'}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={Platform.OS === 'android'}
            overScrollMode="never"
          >
            {stage === 'role' ? null : (
              <View style={styles.headerRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.welcomeTitle}>{text.welcome}</Text>
                  <Text style={styles.welcomeSub}>{roleTitle}</Text>
                </View>
                <View style={styles.languageWrap}>
                  <Pressable
                    onPress={(event) => {
                      event.stopPropagation();
                      setShowLanguageMenu((current) => !current);
                    }}
                    style={styles.languageButton}
                  >
                    <Text style={styles.languageButtonText}>{text.chooseLanguage}</Text>
                  </Pressable>
                  {showLanguageMenu ? (
                    <View style={styles.languageMenu}>
                      <Text style={styles.languageMenuTitle}>{text.selectLanguage}</Text>
                      {languageOptions.map((item) => {
                        const active = item.id === language;
                        return (
                          <Pressable
                            key={item.id}
                            onPress={() => {
                              onLanguageChange?.(item.id);
                              setShowLanguageMenu(false);
                            }}
                            style={[styles.languageItem, active && styles.languageItemActive]}
                          >
                            <Text style={[styles.languageItemText, active && styles.languageItemTextActive]}>{item.label}</Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  ) : null}
                </View>
              </View>
            )}

            {stage === 'role' ? (
              <View style={styles.modernStage}>
                <LinearGradient colors={['#F9F5FF', '#EEF7FF', '#F3FBF7']} style={styles.modernHero}>
                  <View style={styles.modernHeaderRow}>
                    <View>
                      <Text style={styles.modernWelcome}>Welcome to SRV</Text>
                    </View>
                    <View style={styles.languageWrap}>
                      <Pressable
                        onPress={(event) => {
                          event.stopPropagation();
                          setShowLanguageMenu((current) => !current);
                        }}
                        style={styles.languageButton}
                      >
                        <Text style={styles.languageButtonText}>{text.chooseLanguage}</Text>
                      </Pressable>
                      {showLanguageMenu ? (
                        <View style={styles.languageMenu}>
                          <Text style={styles.languageMenuTitle}>{text.selectLanguage}</Text>
                          {languageOptions.map((item) => {
                            const active = item.id === language;
                            return (
                              <Pressable
                                key={item.id}
                                onPress={() => {
                                  onLanguageChange?.(item.id);
                                  setShowLanguageMenu(false);
                                }}
                                style={[styles.languageItem, active && styles.languageItemActive]}
                              >
                                <Text style={[styles.languageItemText, active && styles.languageItemTextActive]}>{item.label}</Text>
                              </Pressable>
                            );
                          })}
                        </View>
                      ) : null}
                    </View>
                  </View>

                  <Animated.View style={[styles.logoPanel, { transform: [{ translateY: logoFloat }] }]}>
                    <View style={styles.logoAura} />
                    <View style={styles.logoSunCore} />
                    <View style={styles.logoSunRayLeft} />
                    <View style={styles.logoSunRayRight} />
                    <Image source={logo} style={styles.modernLogo} resizeMode="contain" />
                  </Animated.View>
                </LinearGradient>

                <View style={styles.modernCard}>
                  <Text style={styles.modernTitle}>Choose Your Role</Text>
                  <Text style={styles.modernSubtitle}>Select the workspace you want to continue with.</Text>

                  <View style={styles.modernRoleRow}>
                    {[
                      { id: 'electrician' as const, image: electricianImage, title: text.electrician, subtitle: text.electricianHindi, accentBorder: '#2D6CDF', accentBg: '#EDF4FF' },
                      { id: 'dealer' as const, image: dealerImage, title: text.dealer, subtitle: text.dealerHindi, accentBorder: '#14B8A6', accentBg: '#E8FBF7' },
                    ].map((item) => {
                      const selected = role === item.id;
                      return (
                        <Pressable
                          key={item.id}
                          onPress={() => setRole(item.id)}
                          style={[
                            styles.modernRoleCard,
                            { width: cardWidth },
                            selected && { borderColor: item.accentBorder, backgroundColor: item.accentBg },
                          ]}
                        >
                          <View style={styles.modernRoleImageWrap}>
                            <Image source={item.image} style={styles.modernRoleImage} resizeMode="contain" />
                          </View>
                          <Text style={styles.modernRoleTitle}>{item.title}</Text>
                          <Text style={styles.modernRoleCaption}>{item.subtitle}</Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  <Pressable onPress={handlePrimaryAction} style={styles.modernPrimaryButton}>
                    <LinearGradient colors={roleContinueColors} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.modernPrimaryGradient}>
                      <Text style={styles.modernPrimaryText}>{text.continue}</Text>
                    </LinearGradient>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={styles.modernAuthShell}>
                <LinearGradient colors={['#F9F5FF', '#EEF7FF', '#F3FBF7']} style={styles.modernAuthHero}>
                  <View style={styles.authHeroTop}>
                    <Pressable onPress={handleBack} style={styles.backButton}>
                      <Text style={styles.backButtonText}>{text.back}</Text>
                    </Pressable>
                    <View style={[styles.roleBadge, { backgroundColor: accentSoft }]}>
                      <Text style={[styles.roleBadgeText, { color: accent }]}>{role === 'dealer' ? text.dealer : text.electrician}</Text>
                    </View>
                  </View>
                  <Animated.View style={[styles.logoPanel, { transform: [{ translateY: logoFloat }] }]}>
                    <View style={styles.logoAura} />
                    <View style={styles.logoSunCore} />
                    <View style={styles.logoSunRayLeft} />
                    <View style={styles.logoSunRayRight} />
                    <Image source={logo} style={styles.modernLogo} resizeMode="contain" />
                  </Animated.View>
                </LinearGradient>
                <View style={styles.modernAuthCard}>
                <View style={styles.authTopRow}>
                  <View />
                </View>
                <Text style={styles.authHeadline}>{roleTitle}</Text>
                <Text style={styles.authSubtitle}>{roleSubtitle}</Text>

                <View style={styles.tabWrap}>
                  {[
                    { id: 'login' as const, label: text.login },
                    { id: 'signup' as const, label: text.signup },
                  ].map((item) => {
                    const active = authMode === item.id;
                    return (
                      <Pressable
                        key={item.id}
                        onPress={() => {
                          setAuthMode(item.id);
                          setLoginOtpVerified(false);
                          setSignupOtpVerified(false);
                        }}
                        style={[styles.tabButton, active && { backgroundColor: accent }]}
                      >
                        <Text style={[styles.tabButtonText, active && styles.tabButtonTextActive]}>{item.label}</Text>
                      </Pressable>
                    );
                  })}
                </View>

                <View style={styles.fieldStack}>
                  {authMode === 'login' ? (
                    <>
                      <Field label={text.mobile}>
                        <View style={styles.inlineOtpRow}>
                          <TextInput
                            ref={isDealer ? dealerMobileRef : electricianMobileRef}
                            value={activeForm.mobile}
                            onChangeText={(value) => (isDealer ? updateDealer('mobile', sanitizeDigits(value)) : updateElectrician('mobile', sanitizeDigits(value)))}
                            onBlur={() => (isDealer ? blurDealerField('mobile') : blurElectricianField('mobile'))}
                            onSubmitEditing={confirmMobileStep}
                            keyboardType="number-pad"
                            placeholder=""
                            placeholderTextColor="#A89D96"
                            blurOnSubmit={false}
                            returnKeyType="done"
                            style={[styles.input, styles.inlineOtpInput, activeErrors.mobile && styles.inputError]}
                          />
                          {loginOtpVisible && !loginMobileConfirmed ? (
                            <Pressable onPress={confirmMobileStep} style={styles.secondaryChip}>
                              <Text style={styles.secondaryChipText}>Confirm</Text>
                            </Pressable>
                          ) : null}
                        </View>
                        {activeErrors.mobile ? <Text style={styles.errorText}>{activeErrors.mobile}</Text> : null}
                      </Field>
                      {loginMobileConfirmed && loginOtpVisible ? (
                        <Field label={text.otp}>
                          <View style={styles.inlineOtpRow}>
                            <TextInput
                              value={activeForm.otp}
                              onChangeText={(value) => (isDealer ? updateDealer('otp', sanitizeDigits(value, 6)) : updateElectrician('otp', sanitizeDigits(value, 6)))}
                              onBlur={() => (isDealer ? blurDealerField('otp') : blurElectricianField('otp'))}
                            onSubmitEditing={() => void verifyOtp()}
                            keyboardType="number-pad"
                            placeholder=""
                            placeholderTextColor="#A89D96"
                            blurOnSubmit
                            returnKeyType="done"
                            ref={isDealer ? dealerOtpRef : electricianOtpRef}
                            style={[styles.input, styles.inlineOtpInput, activeErrors.otp && styles.inputError]}
                          />
                            {loginOtpVerified ? (
                              <View style={styles.inlineVerifiedChip}>
                                <Text style={styles.inlineVerifiedText}>Verified</Text>
                              </View>
                            ) : (
                              <Pressable onPress={() => void verifyOtp()} style={styles.secondaryChip}>
                                {verifyingOtp ? <ActivityIndicator size="small" color="#2D5B9A" /> : <Text style={styles.secondaryChipText}>Verify</Text>}
                              </Pressable>
                            )}
                          </View>
                          {activeErrors.otp ? <Text style={styles.errorText}>{activeErrors.otp}</Text> : null}
                        </Field>
                      ) : null}
                      {loginPasswordVisible ? (
                        <Field label={text.password}>
                        <View style={[styles.passwordWrap, activeErrors.password && styles.inputError]}>
                          <TextInput
                            value={activeForm.password}
                            onChangeText={(value) => (isDealer ? updateDealer('password', value) : updateElectrician('password', value))}
                            onBlur={() => (isDealer ? blurDealerField('password') : blurElectricianField('password'))}
                            onSubmitEditing={handlePrimaryAction}
                            secureTextEntry={!showPassword}
                            placeholder="••••••••"
                            placeholderTextColor="#A89D96"
                            blurOnSubmit={false}
                            returnKeyType="done"
                            style={[styles.passwordInput, activeErrors.password && styles.passwordInputError]}
                          />
                          <Pressable onPress={() => setShowPassword((current) => !current)} style={styles.passwordToggle}>
                            <Text style={styles.passwordToggleText}>{showPassword ? text.passwordHide : text.passwordShow}</Text>
                          </Pressable>
                        </View>
                        {activeErrors.password ? <Text style={styles.errorText}>{activeErrors.password}</Text> : null}
                        </Field>
                      ) : null}
                      {loginPasswordVisible ? (
                      <Pressable onPress={handlePrimaryAction} style={[styles.primaryButton, { marginTop: 6, backgroundColor: accent, shadowColor: accent }]}>
                        <Text style={styles.primaryButtonText}>{text.continue}</Text>
                      </Pressable>
                      ) : null}
                    </>
                  ) : isDealer ? (
                    <>
                      <Field label={text.mobile}>
                        <View style={styles.inlineOtpRow}>
                          <TextInput
                            ref={dealerMobileRef}
                            value={dealerForm.mobile}
                            onChangeText={(value) => updateDealer('mobile', sanitizeDigits(value))}
                            onBlur={() => blurDealerField('mobile')}
                            onSubmitEditing={confirmMobileStep}
                            keyboardType="number-pad"
                            placeholder=""
                            placeholderTextColor="#A89D96"
                            blurOnSubmit
                            returnKeyType="done"
                            style={[styles.input, styles.inlineOtpInput, dealerErrors.mobile && styles.inputError]}
                          />
                          {dealerOtpVisible && !signupMobileConfirmed ? (
                            <Pressable onPress={confirmMobileStep} style={styles.secondaryChip}>
                              <Text style={styles.secondaryChipText}>Confirm</Text>
                            </Pressable>
                          ) : null}
                        </View>
                        {dealerErrors.mobile ? <Text style={styles.errorText}>{dealerErrors.mobile}</Text> : null}
                      </Field>
                      {signupMobileConfirmed && dealerOtpVisible ? (
                        <Field label={text.otp}>
                          <View style={styles.inlineOtpRow}>
                            <TextInput
                              ref={dealerOtpRef}
                              value={dealerForm.otp}
                              onChangeText={(value) => updateDealer('otp', sanitizeDigits(value, 6))}
                              onBlur={() => blurDealerField('otp')}
                              onSubmitEditing={() => void verifyOtp()}
                              keyboardType="number-pad"
                              placeholder=""
                              placeholderTextColor="#A89D96"
                              blurOnSubmit
                              returnKeyType="done"
                              style={[styles.input, styles.inlineOtpInput, dealerErrors.otp && styles.inputError]}
                            />
                            {signupOtpVerified ? (
                              <View style={styles.inlineVerifiedChip}>
                                <Text style={styles.inlineVerifiedText}>Verified</Text>
                              </View>
                            ) : (
                              <Pressable onPress={() => void verifyOtp()} style={styles.secondaryChip}>
                                {verifyingOtp ? <ActivityIndicator size="small" color="#2D5B9A" /> : <Text style={styles.secondaryChipText}>Verify</Text>}
                              </Pressable>
                            )}
                          </View>
                          {dealerErrors.otp ? <Text style={styles.errorText}>{dealerErrors.otp}</Text> : null}
                        </Field>
                      ) : null}
                      {dealerSignupAfterOtp ? (
                      <Field label={text.password}>
                        <View style={[styles.passwordWrap, dealerErrors.password && styles.inputError]}>
                          <TextInput
                            value={dealerForm.password}
                            onChangeText={(value) => updateDealer('password', value)}
                            onBlur={() => blurDealerField('password')}
                            onSubmitEditing={handlePrimaryAction}
                            secureTextEntry={!showPassword}
                            placeholder="••••••••"
                            placeholderTextColor="#A89D96"
                            blurOnSubmit={false}
                            returnKeyType="done"
                            style={[styles.passwordInput, dealerErrors.password && styles.passwordInputError]}
                          />
                          <Pressable onPress={() => setShowPassword((current) => !current)} style={styles.passwordToggle}>
                            <Text style={styles.passwordToggleText}>{showPassword ? text.passwordHide : text.passwordShow}</Text>
                          </Pressable>
                        </View>
                        {dealerErrors.password ? <Text style={styles.errorText}>{dealerErrors.password}</Text> : null}
                      </Field>
                      ) : null}
                      {dealerShowName ? (
                      <Field label={text.nameRequired}>
                        <TextInput value={dealerForm.name} onChangeText={(value) => updateDealer('name', value)} onBlur={() => blurDealerField('name')} placeholder="Enter name" placeholderTextColor="#A89D96" blurOnSubmit={false} returnKeyType="next" style={[styles.input, dealerErrors.name && styles.inputError]} />
                        {dealerErrors.name ? <Text style={styles.errorText}>{dealerErrors.name}</Text> : null}
                      </Field>
                      ) : null}
                      {dealerShowEmail ? (
                      <Field label={text.optionalEmail}>
                        <TextInput value={dealerForm.email} onChangeText={(value) => updateDealer('email', value)} keyboardType="email-address" autoCapitalize="none" placeholder="name@example.com" placeholderTextColor="#A89D96" blurOnSubmit={false} returnKeyType="next" style={styles.input} />
                      </Field>
                      ) : null}
                      {dealerShowAddress ? (
                      <Field label={text.address}>
                        <>
                          <TextInput
                            value={dealerForm.address}
                            onChangeText={(value) => updateDealer('address', value)}
                            onBlur={() => blurDealerField('address')}
                            onFocus={() => {
                              if (!fetchingAddress) {
                                void fetchCurrentAddress();
                              }
                            }}
                            placeholder="Enter address"
                            placeholderTextColor="#A89D96"
                            multiline
                            blurOnSubmit={false}
                            returnKeyType="done"
                            style={[styles.input, styles.multilineInput, dealerErrors.address && styles.inputError]}
                          />
                          <View style={styles.inlineActionRow}>
                            <Pressable onPress={() => void fetchCurrentAddress()} style={styles.secondaryChip}>
                              <Text style={styles.secondaryChipText}>{fetchingAddress ? text.fetchAddress : text.useCurrent}</Text>
                            </Pressable>
                            <Pressable onPress={() => void openMap()} style={styles.secondaryChip}>
                              <Text style={styles.secondaryChipText}>{text.openMap}</Text>
                            </Pressable>
                          </View>
                          {dealerErrors.address ? <Text style={styles.errorText}>{dealerErrors.address}</Text> : null}
                        </>
                      </Field>
                      ) : null}
                      {dealerShowCityState ? (
                      <View style={styles.splitRow}>
                        <View style={styles.splitCol}>
                          <Field label={text.city}>
                            <TextInput value={dealerForm.city} onChangeText={(value) => updateDealer('city', value)} onBlur={() => blurDealerField('city')} placeholder="City" placeholderTextColor="#A89D96" blurOnSubmit={false} returnKeyType="next" style={[styles.input, dealerErrors.city && styles.inputError]} />
                            {dealerErrors.city ? <Text style={styles.errorText}>{dealerErrors.city}</Text> : null}
                          </Field>
                        </View>
                        <View style={styles.splitCol}>
                          <Field label={text.state}>
                            <TextInput value={dealerForm.state} onChangeText={(value) => updateDealer('state', value)} onBlur={() => blurDealerField('state')} placeholder="State" placeholderTextColor="#A89D96" blurOnSubmit={false} returnKeyType="next" style={[styles.input, dealerErrors.state && styles.inputError]} />
                            {dealerErrors.state ? <Text style={styles.errorText}>{dealerErrors.state}</Text> : null}
                          </Field>
                        </View>
                      </View>
                      ) : null}
                      {dealerShowPincode ? (
                      <Field label={text.pincode}>
                        <TextInput value={dealerForm.pincode} onChangeText={(value) => updateDealer('pincode', sanitizeDigits(value, 6))} onBlur={() => blurDealerField('pincode')} keyboardType="number-pad" placeholder="123456" placeholderTextColor="#A89D96" blurOnSubmit={false} returnKeyType="next" style={[styles.input, dealerErrors.pincode && styles.inputError]} />
                        {dealerErrors.pincode ? <Text style={styles.errorText}>{dealerErrors.pincode}</Text> : null}
                      </Field>
                      ) : null}
                      {dealerShowTaxFields ? (
                      <>
                      <Field label={text.taxId}>
                        <TextInput value={dealerForm.taxId} onChangeText={(value) => updateDealer('taxId', value)} placeholder="GST or PAN" placeholderTextColor="#A89D96" blurOnSubmit={false} returnKeyType="next" style={styles.input} />
                      </Field>
                      <Field label={text.taxName}>
                        <TextInput value={dealerForm.taxHolderName} onChangeText={(value) => updateDealer('taxHolderName', value)} placeholder="Holder name" placeholderTextColor="#A89D96" blurOnSubmit={false} returnKeyType="done" style={styles.input} />
                      </Field>
                      </>
                      ) : null}
                      {dealerShowAgreement ? (
                      <>
                      <View style={styles.switchRow}>
                        <Switch value={dealerForm.agreed} onValueChange={(value) => updateDealer('agreed', value)} thumbColor="#FFFFFF" trackColor={{ false: '#DCCFC5', true: accent }} />
                        <Text style={styles.switchText}>{text.agree}</Text>
                      </View>
                      {dealerErrors.agreed ? <Text style={styles.errorText}>{dealerErrors.agreed}</Text> : null}
                      <Pressable onPress={handlePrimaryAction} style={[styles.primaryButton, { marginTop: 6, backgroundColor: accent, shadowColor: accent }]}>
                        <Text style={styles.primaryButtonText}>{text.createAccount}</Text>
                      </Pressable>
                      </>
                      ) : null}
                    </>
                  ) : (
                    <>
                      <Field label={text.fullName}>
                        <TextInput value={electricianForm.fullName} onChangeText={(value) => updateElectrician('fullName', value)} onBlur={() => blurElectricianField('fullName')} placeholder="Enter full name" placeholderTextColor="#A89D96" blurOnSubmit={false} returnKeyType="next" style={[styles.input, electricianErrors.fullName && styles.inputError]} />
                        {electricianErrors.fullName ? <Text style={styles.errorText}>{electricianErrors.fullName}</Text> : null}
                      </Field>
                      {electricianShowDealerMobile ? (
                      <Field label={text.dealerMobile}>
                        <View style={styles.inlineOtpRow}>
                          <TextInput ref={electricianDealerRef} value={electricianForm.dealerMobile} onChangeText={(value) => updateElectrician('dealerMobile', sanitizeDigits(value))} onBlur={() => blurElectricianField('dealerMobile')} onSubmitEditing={() => void verifyDealerLink()} keyboardType="number-pad" placeholder={text.dealerCodeHint} placeholderTextColor="#A89D96" blurOnSubmit returnKeyType="done" style={[styles.input, styles.inlineOtpInput, electricianErrors.dealerMobile && styles.inputError]} />
                          <Pressable onPress={() => void verifyDealerLink()} style={styles.secondaryChip}>
                            {verifyingDealer ? <ActivityIndicator size="small" color="#2D5B9A" /> : <Text style={styles.secondaryChipText}>Verify</Text>}
                          </Pressable>
                        </View>
                        {verifiedDealerName ? <Text style={styles.verifiedText}>Verified dealer: {verifiedDealerName}</Text> : null}
                        {electricianErrors.dealerMobile ? <Text style={styles.errorText}>{electricianErrors.dealerMobile}</Text> : null}
                      </Field>
                      ) : null}
                      {electricianShowMobile ? (
                      <Field label={text.mobile}>
                        <View style={styles.inlineOtpRow}>
                          <TextInput ref={electricianMobileRef} value={electricianForm.mobile} onChangeText={(value) => updateElectrician('mobile', sanitizeDigits(value))} onBlur={() => blurElectricianField('mobile')} onSubmitEditing={confirmMobileStep} keyboardType="number-pad" placeholder="" placeholderTextColor="#A89D96" blurOnSubmit returnKeyType="done" style={[styles.input, styles.inlineOtpInput, electricianErrors.mobile && styles.inputError]} />
                          {electricianOtpVisible && !signupMobileConfirmed ? (
                            <Pressable onPress={confirmMobileStep} style={styles.secondaryChip}>
                              <Text style={styles.secondaryChipText}>Confirm</Text>
                            </Pressable>
                          ) : null}
                        </View>
                        {electricianErrors.mobile ? <Text style={styles.errorText}>{electricianErrors.mobile}</Text> : null}
                      </Field>
                      ) : null}
                      {electricianShowOtp ? (
                        <Field label={text.otp}>
                          <View style={styles.inlineOtpRow}>
                            <TextInput ref={electricianOtpRef} value={electricianForm.otp} onChangeText={(value) => updateElectrician('otp', sanitizeDigits(value, 6))} onBlur={() => blurElectricianField('otp')} onSubmitEditing={() => void verifyOtp()} keyboardType="number-pad" placeholder="" placeholderTextColor="#A89D96" blurOnSubmit returnKeyType="done" style={[styles.input, styles.inlineOtpInput, electricianErrors.otp && styles.inputError]} />
                            {signupOtpVerified ? (
                              <View style={styles.inlineVerifiedChip}>
                                <Text style={styles.inlineVerifiedText}>Verified</Text>
                              </View>
                            ) : (
                              <Pressable onPress={() => void verifyOtp()} style={styles.secondaryChip}>
                                {verifyingOtp ? <ActivityIndicator size="small" color="#2D5B9A" /> : <Text style={styles.secondaryChipText}>Verify</Text>}
                              </Pressable>
                            )}
                          </View>
                          {electricianErrors.otp ? <Text style={styles.errorText}>{electricianErrors.otp}</Text> : null}
                        </Field>
                      ) : null}
                      {electricianShowPassword ? (
                      <Field label={text.password}>
                        <View style={[styles.passwordWrap, electricianErrors.password && styles.inputError]}>
                          <TextInput
                            value={electricianForm.password}
                            onChangeText={(value) => updateElectrician('password', value)}
                            onBlur={() => blurElectricianField('password')}
                            onSubmitEditing={handlePrimaryAction}
                            secureTextEntry={!showPassword}
                            placeholder="••••••••"
                            placeholderTextColor="#A89D96"
                            blurOnSubmit={false}
                            returnKeyType="done"
                            style={[styles.passwordInput, electricianErrors.password && styles.passwordInputError]}
                          />
                          <Pressable onPress={() => setShowPassword((current) => !current)} style={styles.passwordToggle}>
                            <Text style={styles.passwordToggleText}>{showPassword ? text.passwordHide : text.passwordShow}</Text>
                          </Pressable>
                        </View>
                        {electricianErrors.password ? <Text style={styles.errorText}>{electricianErrors.password}</Text> : null}
                      </Field>
                      ) : null}
                      {electricianShowPassword ? (
                      <Pressable onPress={handlePrimaryAction} style={[styles.primaryButton, { marginTop: 6, backgroundColor: accent, shadowColor: accent }]}>
                        <Text style={styles.primaryButtonText}>{text.createAccount}</Text>
                      </Pressable>
                      ) : null}
                    </>
                  )}
                </View>
              </View>
            </View>
            )}
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { paddingHorizontal: 0, paddingBottom: 28, backgroundColor: '#F7F0E8' },
  modernStage: {
    minHeight: '100%',
    backgroundColor: '#EEF3F8',
  },
  modernHero: {
    paddingHorizontal: 18,
    paddingTop: 60,
    paddingBottom: 54,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  modernHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  modernWelcome: {
    marginTop: 10,
    fontSize: 32,
    fontWeight: '900',
    color: '#18212B',
    letterSpacing: -1,
  },
  logoPanel: {
    marginTop: 30,
    minHeight: 190,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  logoAura: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: 'rgba(255,190,80,0.34)',
  },
  logoSunCore: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 999,
    backgroundColor: 'rgba(255,220,120,0.55)',
  },
  logoSunRayLeft: {
    position: 'absolute',
    width: 150,
    height: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,210,120,0.38)',
    transform: [{ rotate: '-24deg' }],
    left: -8,
    bottom: 34,
  },
  logoSunRayRight: {
    position: 'absolute',
    width: 150,
    height: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,210,120,0.38)',
    transform: [{ rotate: '24deg' }],
    right: -8,
    bottom: 34,
  },
  modernLogo: {
    width: '74%',
    height: 112,
  },
  modernCard: {
    marginTop: 18,
    marginHorizontal: 16,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 18,
    borderWidth: 1,
    borderColor: '#EADFD6',
    shadowColor: '#50372B',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  modernTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#18212B',
    textAlign: 'center',
  },
  modernSubtitle: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    color: '#6F7B88',
    textAlign: 'center',
  },
  modernRoleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 24,
  },
  modernRoleCard: {
    borderRadius: 22,
    backgroundColor: '#FFF9F6',
    borderWidth: 1.5,
    borderColor: '#EADFD6',
    padding: 12,
  },
  modernRoleImageWrap: {
    height: 132,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EFE7E0',
  },
  modernRoleImage: {
    width: '88%',
    height: '88%',
  },
  modernRoleTitle: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: '800',
    color: '#1F1612',
  },
  modernRoleCaption: {
    marginTop: 4,
    fontSize: 12,
    color: '#8A7E78',
    fontWeight: '600',
  },
  modernPrimaryButton: {
    marginTop: 18,
  },
  modernPrimaryGradient: {
    minHeight: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modernPrimaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  modernAuthShell: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EADFD6',
    shadowColor: '#4B5563',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  modernAuthHero: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 20,
  },
  authHeroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modernAuthCard: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 18,
    backgroundColor: '#FFFFFF',
  },
  backgroundBlobTop: { position: 'absolute', top: -40, right: -20, width: 180, height: 180, borderRadius: 100, backgroundColor: 'rgba(44, 91, 154, 0.10)' },
  backgroundBlobBottom: { position: 'absolute', bottom: 120, left: -40, width: 220, height: 220, borderRadius: 120, backgroundColor: 'rgba(23, 143, 119, 0.08)' },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  welcomeTitle: { fontSize: 31, fontWeight: '900', color: colors.text, letterSpacing: -0.8 },
  welcomeSub: { marginTop: 7, fontSize: 14, fontWeight: '600', color: colors.mutedText },
  languageWrap: { position: 'relative' },
  languageButton: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 88,
    alignItems: 'center',
    shadowColor: '#63453A',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  languageButtonText: { color: colors.text, fontSize: 12, fontWeight: '800' },
  languageMenu: {
    position: 'absolute',
    top: 52,
    right: 0,
    width: 150,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    zIndex: 40,
    shadowColor: '#63453A',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  languageMenuTitle: { fontSize: 12, fontWeight: '800', color: colors.mutedText, marginBottom: 8 },
  languageItem: { borderRadius: 14, paddingHorizontal: 10, paddingVertical: 10 },
  languageItemActive: { backgroundColor: '#EEF4FF' },
  languageItemText: { fontSize: 13, fontWeight: '700', color: colors.text },
  languageItemTextActive: { color: '#2D5B9A' },
  heroPanel: { marginTop: 18, alignItems: 'center' },
  referenceHero: {
    height: 314,
    backgroundColor: '#35CFD0',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  referenceTopGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 82,
  },
  heroStripeWide: {
    position: 'absolute',
    width: 5,
    height: 408,
    backgroundColor: 'rgba(111, 181, 191, 0.30)',
    transform: [{ rotate: '37deg' }],
    top: -56,
    left: 40,
  },
  heroStripeThin: {
    position: 'absolute',
    width: 5,
    height: 408,
    backgroundColor: 'rgba(111, 181, 191, 0.30)',
    transform: [{ rotate: '-37deg' }],
    top: -56,
    right: 40,
  },
  heroStripeThird: {
    position: 'absolute',
    width: 4,
    height: 392,
    backgroundColor: 'rgba(111, 181, 191, 0.18)',
    transform: [{ rotate: '37deg' }],
    top: -62,
    left: 126,
  },
  heroStripeFourth: {
    position: 'absolute',
    width: 4,
    height: 392,
    backgroundColor: 'rgba(111, 181, 191, 0.18)',
    transform: [{ rotate: '-37deg' }],
    top: -62,
    right: 126,
  },
  referenceLogoWrap: {
    width: '72%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -6,
  },
  referenceLogo: {
    width: '100%',
    height: 120,
    tintColor: '#111111',
  },
  referencePanel: {
    marginTop: -14,
    marginHorizontal: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 24,
    borderTopWidth: 5,
    borderTopColor: '#B7D51E',
    minHeight: 324,
  },
  referenceTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  referenceLine: {
    width: 52,
    height: 1,
    backgroundColor: '#262626',
  },
  referenceWelcome: {
    fontSize: 14,
    color: '#1E1E1E',
    fontWeight: '500',
  },
  referenceRoleHeading: {
    textAlign: 'center',
    marginTop: 4,
    fontSize: 18,
    fontWeight: '900',
    color: '#151515',
  },
  authShell: {
    marginTop: 18,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  authHero: {
    height: 220,
    backgroundColor: '#35CFD0',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  logoShell: {
    width: '72%',
    minHeight: 120,
    borderRadius: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: { width: '100%', height: 92, tintColor: '#111111' },
  roleSection: { flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', paddingTop: 24 },
  roleRow: { width: '100%', flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 16 },
  referenceRoleCard: {
    borderRadius: 14,
    borderWidth: 4,
    borderColor: '#B7D51E',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowOpacity: 0,
  },
  referenceRoleCardActive: {
    transform: [{ translateY: -1 }],
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  referenceRoleCardInactive: {
    borderColor: '#B7D51E',
  },
  referenceRoleGradient: {
    width: '100%',
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 12,
    alignItems: 'center',
  },
  referenceRoleImageFrame: {
    width: '100%',
    height: 118,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  referenceRoleImage: {
    width: '88%',
    height: 102,
  },
  referenceRoleTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  referenceDivider: {
    width: '70%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
    marginVertical: 4,
  },
  referenceRoleSubtitle: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '500',
  },
  referenceContinueButton: {
    marginTop: 18,
  },
  referenceContinueGradient: {
    minHeight: 48,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  referenceContinueText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '400',
  },
  roleCard: {
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7DDD6',
    paddingHorizontal: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#6D4B3A',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  roleCardActive: { transform: [{ translateY: -2 }], shadowOpacity: 0.1, shadowRadius: 10, elevation: 2 },
  roleImageWrap: { width: '100%', height: 128, borderRadius: 22, backgroundColor: '#F7F2EC', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  roleImage: { width: '88%', height: '88%' },
  roleTitle: { marginTop: 12, fontSize: 18, fontWeight: '900', color: colors.text },
  roleSubtitle: { marginTop: 4, fontSize: 12, fontWeight: '700', color: colors.mutedText },
  roleStrip: { width: '100%', height: 8, borderRadius: 99, marginTop: 14 },
  primaryButton: {
    marginTop: 22,
    width: '100%',
    minHeight: 54,
    borderRadius: 20,
    backgroundColor: '#2D5B9A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2D5B9A',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '900' },
  formCard: {
    marginTop: 22,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderWidth: 1,
    borderColor: '#E8DDD3',
    padding: 18,
    shadowColor: '#5E4336',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  formCardUnified: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 18,
    backgroundColor: '#FFFFFF',
  },
  authTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backButton: { borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#F3ECE6' },
  backButtonText: { color: colors.text, fontSize: 12, fontWeight: '800' },
  roleBadge: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  roleBadgeText: { fontSize: 12, fontWeight: '900' },
  authHeadline: { marginTop: 16, fontSize: 24, fontWeight: '900', color: colors.text },
  authSubtitle: { marginTop: 6, fontSize: 13, lineHeight: 18, color: colors.mutedText },
  tabWrap: { marginTop: 18, marginBottom: 6, flexDirection: 'row', backgroundColor: '#F3ECE6', borderRadius: 18, padding: 4, gap: 4 },
  tabButton: { flex: 1, minHeight: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  tabButtonText: { color: '#70635D', fontSize: 13, fontWeight: '800' },
  tabButtonTextActive: { color: '#FFFFFF' },
  fieldStack: { gap: 12, marginTop: 12 },
  fieldBlock: { gap: 7 },
  fieldLabel: { fontSize: 12, fontWeight: '800', color: '#7A6E67', letterSpacing: 0.3 },
  input: {
    minHeight: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E1D7CF',
    backgroundColor: '#FFFCFA',
    paddingHorizontal: 14,
    fontSize: 14,
    color: colors.text,
  },
  inputError: {
    borderColor: '#D94B4B',
    backgroundColor: '#FFF6F6',
  },
  multilineInput: { minHeight: 90, paddingTop: 14, textAlignVertical: 'top' },
  passwordWrap: {
    minHeight: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E1D7CF',
    backgroundColor: '#FFFCFA',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 8,
  },
  passwordInput: { flex: 1, fontSize: 14, color: colors.text },
  passwordInputError: { color: colors.text },
  passwordToggle: { paddingHorizontal: 8, paddingVertical: 8 },
  passwordToggleText: { fontSize: 12, fontWeight: '800', color: '#2D5B9A' },
  splitRow: { flexDirection: 'row', gap: 10 },
  splitCol: { flex: 1 },
  inlineActionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  secondaryChip: { borderRadius: 14, backgroundColor: '#EEF4FF', paddingHorizontal: 12, paddingVertical: 10 },
  secondaryChipText: { color: '#2D5B9A', fontSize: 12, fontWeight: '800' },
  inlineHintText: { marginTop: 8, fontSize: 11, fontWeight: '700', color: '#6D7D8E' },
  inlineVerifiedChip: { borderRadius: 14, backgroundColor: '#E7FBF1', paddingHorizontal: 12, paddingVertical: 10, minWidth: 78, alignItems: 'center' },
  inlineVerifiedText: { color: '#178F77', fontSize: 12, fontWeight: '800' },
  secondaryActionButton: { marginTop: 10, alignSelf: 'flex-start', borderRadius: 14, backgroundColor: '#E7F7F2', paddingHorizontal: 14, paddingVertical: 10 },
  secondaryActionText: { color: '#178F77', fontSize: 12, fontWeight: '800' },
  inlineOtpRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  inlineOtpInput: { flex: 1 },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 2 },
  switchText: { flex: 1, fontSize: 12, lineHeight: 18, color: colors.text, fontWeight: '600' },
  errorText: { marginTop: 4, fontSize: 11, fontWeight: '700', color: '#D94B4B' },
  verifiedText: { marginTop: 4, fontSize: 11, fontWeight: '800', color: '#178F77' },
});
