/**
 * OnboardingScreen — SRV App
 * Expo · React Native · 2026 Premium Design
 * Rich color palette · Clean typography · Smooth animations
 * Zero external font deps — uses system fonts for reliability
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = 'electrician' | 'dealer';

type AuthMode = 'login' | 'signup';

// ─── Mock Dealer Directory ────────────────────────────────────────────────────

const dealerDirectory: Record<string, { dealerName: string; city: string }> = {
  '9876543210': { dealerName: 'Sharma Electricals', city: 'Delhi' },
  '9988776655': { dealerName: 'Ravi Traders', city: 'Mumbai' },
  '9123456789': { dealerName: 'Gupta Power House', city: 'Jaipur' },
};

// ─── Design Tokens ────────────────────────────────────────────────────────────

const TOKENS = {
  // Base palette
  ink:       '#0F0E0C',
  inkLight:  '#2C2A26',
  inkMid:    '#5C5850',
  inkFaint:  '#9A9590',
  offWhite:  '#F8F7F4',
  white:     '#FFFFFF',
  border:    '#E8E5DF',
  borderMid: '#D4D0C8',

  // Electrician — deep amber-orange
  E_accent:      '#D45D10',
  E_accentDeep:  '#A83E04',
  E_soft:        '#FEF3EC',
  E_softMid:     '#FBDFC8',
  E_tint:        '#FF7832',

  // Dealer — deep indigo-blue
  D_accent:      '#1A4FCC',
  D_accentDeep:  '#0E338A',
  D_soft:        '#EDF2FD',
  D_softMid:     '#C3D3F7',
  D_tint:        '#3B6EF0',

  // Radii
  r_sm:  10,
  r_md:  14,
  r_lg:  20,
  r_xl:  26,
  r_full: 999,
};

// ─── Role Theme ───────────────────────────────────────────────────────────────

type RoleTheme = {
  accent: string;
  accentDeep: string;
  soft: string;
  softMid: string;
  tint: string;
  btnFrom: string;
  btnTo: string;
};

const ELEC_THEME: RoleTheme = {
  accent:     TOKENS.E_accent,
  accentDeep: TOKENS.E_accentDeep,
  soft:       TOKENS.E_soft,
  softMid:    TOKENS.E_softMid,
  tint:       TOKENS.E_tint,
  btnFrom:    TOKENS.E_tint,
  btnTo:      TOKENS.E_accentDeep,
};

const DEAL_THEME: RoleTheme = {
  accent:     TOKENS.D_accent,
  accentDeep: TOKENS.D_accentDeep,
  soft:       TOKENS.D_soft,
  softMid:    TOKENS.D_softMid,
  tint:       TOKENS.D_tint,
  btnFrom:    TOKENS.D_tint,
  btnTo:      TOKENS.D_accentDeep,
};

// ─── Helper: Animated Fade+Slide ─────────────────────────────────────────────

function useFadeIn(trigger: boolean, delay = 0) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (trigger) {
      anim.setValue(0);
      Animated.timing(anim, {
        toValue: 1,
        duration: 340,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [trigger]);
  const opacity = anim;
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [14, 0] });
  return { opacity, translateY };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

// Banner
function TopBanner() {
  return (
    <View style={s.banner}>
      <Text style={s.bannerWelcome}>Welcome to</Text>
      <Text style={s.bannerBrand}>SRV</Text>
      <View style={s.bannerStatus}>
        <View style={s.bannerDot} />
      </View>
    </View>
  );
}

// Logo
function LogoZone() {
  return (
    <View style={s.logoZone}>
      <View style={s.logoBox}>
        <View style={s.logoInnerShine} />
        <Text style={s.logoText}>SRV</Text>
      </View>
      <Text style={s.logoTag}>Smart Rewards & Verification</Text>
    </View>
  );
}

// Role Card
function RoleCard({
  title, subtitle, symbol, selected, theme, isElec, onPress,
}: {
  title: string;
  subtitle: string;
  symbol: string;
  selected: boolean;
  theme: RoleTheme;
  isElec: boolean;
  onPress: () => void;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const onIn  = () => Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
  const onOut = () => Animated.spring(scaleAnim, { toValue: 1.0,  useNativeDriver: true, speed: 28, bounciness: 2 }).start();

  return (
    <Animated.View style={[s.roleCardWrap, { transform: [{ scale: scaleAnim }] }]}>
      <Pressable
        onPress={onPress}
        onPressIn={onIn}
        onPressOut={onOut}
        style={[
          s.roleCard,
          selected && {
            borderColor: theme.accent,
            backgroundColor: theme.soft,
          },
        ]}
      >
        {/* Icon */}
        <View style={[s.roleIconBox, { backgroundColor: selected ? theme.softMid : TOKENS.border }]}>
          <Text style={s.roleIconSymbol}>{symbol}</Text>
        </View>

        <Text style={s.roleCardTitle}>{title}</Text>
        <Text style={s.roleCardSub}>{subtitle}</Text>

        {/* Check */}
        <View style={[
          s.roleCheck,
          selected
            ? { backgroundColor: theme.accent, borderColor: theme.accent }
            : { backgroundColor: 'transparent', borderColor: TOKENS.borderMid },
        ]}>
          {selected && (
            <Text style={s.roleCheckMark}>✓</Text>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

// Proceed Button
function ProceedButton({
  label, onPress, disabled, theme,
}: {
  label: string;
  onPress: () => void;
  disabled: boolean;
  theme: RoleTheme;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const onIn  = () => !disabled && Animated.spring(scaleAnim, { toValue: 0.975, useNativeDriver: true, speed: 60 }).start();
  const onOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 30 }).start();

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], marginTop: 18 }}>
      <Pressable
        onPress={onPress}
        onPressIn={onIn}
        onPressOut={onOut}
        disabled={disabled}
        style={[
          s.proceedBtn,
          { backgroundColor: disabled ? TOKENS.borderMid : theme.accent },
        ]}
      >
        <Text style={[s.proceedBtnLabel, { color: disabled ? TOKENS.inkFaint : TOKENS.white }]}>
          {label}
        </Text>
        {!disabled && <Text style={s.proceedArrow}>→</Text>}
      </Pressable>
    </Animated.View>
  );
}

// Segmented Tab
function SegmentedTab({
  mode, onSwitch, theme,
}: {
  mode: AuthMode;
  onSwitch: (m: AuthMode) => void;
  theme: RoleTheme;
}) {
  return (
    <View style={s.segWrap}>
      {(['login', 'signup'] as AuthMode[]).map((m) => (
        <Pressable
          key={m}
          onPress={() => onSwitch(m)}
          style={[s.segPill, mode === m && [s.segPillActive, { shadowColor: theme.accent }]]}
        >
          <Text style={[
            s.segLabel,
            { color: mode === m ? theme.accent : TOKENS.inkFaint },
            mode === m && s.segLabelActive,
          ]}>
            {m === 'login' ? 'Login' : 'Create Account'}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

// Styled Field
function Field({
  label, value, onChangeText, placeholder, keyboardType, secureTextEntry,
  theme, suffix,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'phone-pad' | 'numeric';
  secureTextEntry?: boolean;
  theme: RoleTheme;
  suffix?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const onFocus = () => {
    setFocused(true);
    Animated.timing(borderAnim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
  };
  const onBlur = () => {
    setFocused(false);
    Animated.timing(borderAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [TOKENS.border, theme.accent],
  });

  return (
    <View style={s.fieldGroup}>
      <Text style={s.fieldLabel}>{label}</Text>
      <Animated.View style={[s.fieldBox, { borderColor }]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={TOKENS.inkFaint}
          keyboardType={keyboardType ?? 'default'}
          secureTextEntry={secureTextEntry}
          onFocus={onFocus}
          onBlur={onBlur}
          style={s.fieldInput}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {suffix}
      </Animated.View>
    </View>
  );
}

// Password Field
function PasswordField({
  label, value, onChangeText, placeholder, theme,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  theme: RoleTheme;
}) {
  const [show, setShow] = useState(false);
  return (
    <Field
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={!show}
      theme={theme}
      suffix={
        <Pressable onPress={() => setShow(p => !p)} style={s.eyeBtn} hitSlop={8}>
          <Text style={[s.eyeIcon, { color: show ? theme.accent : TOKENS.inkFaint }]}>
            {show ? '◉' : '◎'}
          </Text>
        </Pressable>
      }
    />
  );
}

// Phone Field
function PhoneField({
  value, onChangeText, theme,
}: {
  value: string;
  onChangeText: (v: string) => void;
  theme: RoleTheme;
}) {
  const [focused, setFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;
  const onFocus = () => { setFocused(true); Animated.timing(borderAnim, { toValue: 1, duration: 200, useNativeDriver: false }).start(); };
  const onBlur  = () => { setFocused(false); Animated.timing(borderAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start(); };
  const borderColor = borderAnim.interpolate({ inputRange: [0, 1], outputRange: [TOKENS.border, theme.accent] });
  const ok = value.length === 10;

  return (
    <View style={s.fieldGroup}>
      <Text style={s.fieldLabel}>Mobile Number</Text>
      <Animated.View style={[s.phoneBox, { borderColor }]}>
        <View style={[s.dialCodeBlock, { borderRightColor: focused ? theme.accent : TOKENS.border }]}>
          <Text style={[s.dialCode, { color: theme.accent }]}>+91</Text>
        </View>
        <TextInput
          value={value}
          onChangeText={(v) => onChangeText(v.replace(/\D/g, '').slice(0, 10))}
          keyboardType="phone-pad"
          placeholder="Enter mobile number"
          placeholderTextColor={TOKENS.inkFaint}
          onFocus={onFocus}
          onBlur={onBlur}
          style={s.phoneInput}
        />
        {ok && (
          <View style={[s.phoneOk, { backgroundColor: theme.soft }]}>
            <Text style={[s.phoneOkSymbol, { color: theme.accent }]}>✓</Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

// OTP Block
function OtpBlock({
  phone, value, onChangeText, theme,
}: {
  phone: string;
  value: string;
  onChangeText: (v: string) => void;
  theme: RoleTheme;
}) {
  const { opacity, translateY } = useFadeIn(true, 0);
  return (
    <Animated.View style={[s.otpBlock, { opacity, transform: [{ translateY }], borderColor: theme.softMid, backgroundColor: theme.soft }]}>
      <View style={s.otpTopRow}>
        <View style={[s.otpDot, { backgroundColor: theme.accent }]} />
        <Text style={s.otpSentText}>OTP sent to +91 {phone}</Text>
        <Text style={[s.otpResend, { color: theme.accent }]}>Resend</Text>
      </View>
      <Field
        label="Enter OTP"
        value={value}
        onChangeText={(v) => onChangeText(v.replace(/\D/g, '').slice(0, 4))}
        placeholder="4-digit code"
        keyboardType="numeric"
        theme={theme}
      />
    </Animated.View>
  );
}

// Dealer Verify Block
function DealerVerifyBlock({
  value, onChangeText, theme,
}: {
  value: string;
  onChangeText: (v: string) => void;
  theme: RoleTheme;
}) {
  const matched = value.length === 10 ? dealerDirectory[value] : undefined;
  return (
    <View style={[s.dealerVerifyBox, { borderColor: theme.softMid, backgroundColor: theme.soft }]}>
      <PhoneField value={value} onChangeText={onChangeText} theme={theme} />
      <View style={s.verifyStatusRow}>
        <View style={[s.verifyBadge, {
          backgroundColor: matched ? theme.accent : TOKENS.border,
        }]}>
          <Text style={[s.verifyBadgeText, { color: matched ? TOKENS.white : TOKENS.inkMid }]}>
            {matched ? '✓  Verified' : 'Pending'}
          </Text>
        </View>
        <Text style={s.verifyHint} numberOfLines={1}>
          {matched ? `${matched.dealerName}, ${matched.city}` : '10-digit dealer number'}
        </Text>
      </View>
    </View>
  );
}

// CTA Button
function CtaButton({
  label, onPress, disabled, loading, theme,
}: {
  label: string;
  onPress: () => void;
  disabled: boolean;
  loading: boolean;
  theme: RoleTheme;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const onIn  = () => !disabled && Animated.spring(scaleAnim, { toValue: 0.975, useNativeDriver: true, speed: 60 }).start();
  const onOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 30 }).start();

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], marginTop: 6 }}>
      <Pressable
        onPress={onPress}
        onPressIn={onIn}
        onPressOut={onOut}
        disabled={disabled || loading}
        style={[
          s.ctaBtn,
          { backgroundColor: disabled || loading ? TOKENS.borderMid : theme.accent },
        ]}
      >
        <Text style={[s.ctaBtnLabel, { color: disabled ? TOKENS.inkFaint : TOKENS.white }]}>
          {loading ? 'Opening dashboard...' : label}
        </Text>
        {!disabled && !loading && (
          <Text style={[s.ctaArrow, { color: TOKENS.white }]}>→</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

// Back Row
function BackRow({ role, onBack }: { role: UserRole; onBack: () => void }) {
  return (
    <View style={s.backRow}>
      <Pressable onPress={onBack} style={s.backBtn} hitSlop={8}>
        <Text style={s.backArrow}>←</Text>
        <Text style={s.backLabel}>Back</Text>
      </Pressable>
      <View style={[s.roleBadge, {
        backgroundColor: role === 'electrician' ? TOKENS.E_soft : TOKENS.D_soft,
        borderColor: role === 'electrician' ? TOKENS.E_softMid : TOKENS.D_softMid,
      }]}>
        <Text style={[s.roleBadgeText, { color: role === 'electrician' ? TOKENS.E_accent : TOKENS.D_accent }]}>
          {role === 'electrician' ? '⚡ Electrician' : '◈ Dealer'}
        </Text>
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function OnboardingScreen({ onGetStarted }: { onGetStarted: (role: UserRole) => void }) {
  const { width } = useWindowDimensions();
  const stackedRoles = width < 340;

  // Phase: 'role' | 'auth'
  const [phase, setPhase] = useState<'role' | 'auth'>('role');
  const [role, setRole] = useState<UserRole | null>(null);
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);

  // Form state
  const [loginPhone, setLoginPhone] = useState('');
  const [loginOtp, setLoginOtp] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const [signupName, setSignupName] = useState('');
  const [signupBiz, setSignupBiz] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupOtp, setSignupOtp] = useState('');
  const [signupDealerPhone, setSignupDealerPhone] = useState('');
  const [signupPass, setSignupPass] = useState('');

  // Mount animation
  const mountAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(mountAnim, { toValue: 1, duration: 700, easing: Easing.out(Easing.exp), useNativeDriver: true }).start();
  }, []);

  // Phase transition
  const phaseAnim = useRef(new Animated.Value(1)).current;
  const doPhaseTransition = (next: () => void) => {
    Animated.timing(phaseAnim, { toValue: 0, duration: 180, useNativeDriver: true, easing: Easing.in(Easing.quad) }).start(() => {
      next();
      Animated.timing(phaseAnim, { toValue: 1, duration: 300, useNativeDriver: true, easing: Easing.out(Easing.cubic) }).start();
    });
  };

  const theme: RoleTheme = role === 'dealer' ? DEAL_THEME : ELEC_THEME;

  const resetForm = () => {
    setLoginPhone(''); setLoginOtp(''); setLoginPass('');
    setSignupName(''); setSignupBiz(''); setSignupPhone('');
    setSignupOtp(''); setSignupDealerPhone(''); setSignupPass('');
    setMode('login');
    setLoading(false);
  };

  const handleSelectRole = (r: UserRole) => {
    setRole(r);
  };

  const handleProceed = () => {
    if (!role) return;
    resetForm();
    doPhaseTransition(() => setPhase('auth'));
  };

  const handleBack = () => {
    doPhaseTransition(() => { setPhase('role'); resetForm(); });
  };

  const handleSwitchMode = (m: AuthMode) => {
    doPhaseTransition(() => setMode(m));
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
  }, [mode, loginPhone, loginOtp, loginPass, signupName, signupBiz, signupPhone, signupOtp, signupDealerPhone, signupPass, role]);

  const handleContinue = () => {
    if (!canContinue || loading) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onGetStarted(role!);
    }, 900);
  };

  const mountStyle = {
    opacity: mountAnim,
    transform: [{ translateY: mountAnim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }],
  };

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}
    >
      <StatusBar barStyle="light-content" backgroundColor={TOKENS.ink} />

      {/* Background */}
      <View style={s.bg} />

      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[s.inner, mountStyle]}>

          <TopBanner />
          <LogoZone />

          {/* Main content area */}
          <Animated.View style={{ opacity: phaseAnim, transform: [{ translateY: phaseAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] }}>

            {phase === 'role' ? (
              /* ── Role Selection Phase ── */
              <View style={s.card}>
                <View style={s.cardSectionLabel}>
                  <Text style={s.sectionLabelText}>Choose your role</Text>
                </View>
                <View style={[s.roleGrid, stackedRoles && s.roleCol]}>
                  <RoleCard
                    title="Electrician"
                    subtitle="Scan rewards & fast field access"
                    symbol="⚡"
                    selected={role === 'electrician'}
                    theme={ELEC_THEME}
                    isElec={true}
                    onPress={() => handleSelectRole('electrician')}
                  />
                  <RoleCard
                    title="Dealer"
                    subtitle="Business & account management"
                    symbol="◈"
                    selected={role === 'dealer'}
                    theme={DEAL_THEME}
                    isElec={false}
                    onPress={() => handleSelectRole('dealer')}
                  />
                </View>
                <ProceedButton
                  label="Continue"
                  onPress={handleProceed}
                  disabled={!role}
                  theme={role === 'dealer' ? DEAL_THEME : ELEC_THEME}
                />
              </View>
            ) : (
              /* ── Auth Phase ── */
              <View>
                <BackRow role={role!} onBack={handleBack} />

                <View style={s.card}>
                  <SegmentedTab mode={mode} onSwitch={handleSwitchMode} theme={theme} />

                  <View style={s.formStack}>
                    {mode === 'login' ? (
                      /* ── Login ── */
                      <>
                        <PhoneField value={loginPhone} onChangeText={setLoginPhone} theme={theme} />
                        {loginPhone.length === 10 && (
                          <OtpBlock phone={loginPhone} value={loginOtp} onChangeText={setLoginOtp} theme={theme} />
                        )}
                        <PasswordField
                          label="Password"
                          value={loginPass}
                          onChangeText={setLoginPass}
                          placeholder="Enter password"
                          theme={theme}
                        />
                      </>
                    ) : (
                      /* ── Signup ── */
                      <>
                        <Field
                          label="Full Name"
                          value={signupName}
                          onChangeText={setSignupName}
                          placeholder={role === 'dealer' ? 'Owner or manager name' : 'Your full name'}
                          theme={theme}
                        />

                        {role === 'dealer' ? (
                          <Field
                            label="Business Name"
                            value={signupBiz}
                            onChangeText={setSignupBiz}
                            placeholder="Shop or firm name"
                            theme={theme}
                          />
                        ) : (
                          <View style={s.fieldGroup}>
                            <Text style={s.fieldLabel}>Dealer Phone</Text>
                            <DealerVerifyBlock
                              value={signupDealerPhone}
                              onChangeText={setSignupDealerPhone}
                              theme={theme}
                            />
                          </View>
                        )}

                        <PhoneField value={signupPhone} onChangeText={setSignupPhone} theme={theme} />
                        {signupPhone.length === 10 && (
                          <OtpBlock phone={signupPhone} value={signupOtp} onChangeText={setSignupOtp} theme={theme} />
                        )}
                        <PasswordField
                          label="Password"
                          value={signupPass}
                          onChangeText={setSignupPass}
                          placeholder="Create a strong password"
                          theme={theme}
                        />
                      </>
                    )}

                    <CtaButton
                      label={
                        mode === 'login'
                          ? 'Continue'
                          : 'Create Account'
                      }
                      onPress={handleContinue}
                      disabled={!canContinue}
                      loading={loading}
                      theme={theme}
                    />
                  </View>
                </View>
              </View>
            )}
          </Animated.View>

          {/* Footer */}
          <View style={s.footer}>
            {['Secure', 'Encrypted', 'Trusted'].map((word, i) => (
              <View key={word} style={s.footerItem}>
                {i > 0 && <View style={s.footerDot} />}
                <Text style={s.footerWord}>{word}</Text>
              </View>
            ))}
          </View>

        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: TOKENS.offWhite,
  },

  bg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: TOKENS.offWhite,
  },

  scroll: {
    flexGrow: 1,
  },

  inner: {
    flex: 1,
    paddingBottom: 40,
  },

  // ── Banner
  banner: {
    backgroundColor: TOKENS.ink,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: Platform.OS === 'ios' ? 54 : 16,
    paddingBottom: 14,
  },
  bannerWelcome: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.4)',
  },
  bannerBrand: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: TOKENS.white,
  },
  bannerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bannerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ADE80',
  },
  bannerLive: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: 'rgba(255,255,255,0.4)',
  },

  // ── Logo Zone
  logoZone: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 28,
    gap: 12,
  },
  logoBox: {
    width: 76,
    height: 76,
    backgroundColor: TOKENS.ink,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: TOKENS.ink,
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  logoInnerShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 38,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  logoText: {
    fontSize: 26,
    fontWeight: '900',
    color: TOKENS.white,
    letterSpacing: -0.5,
  },
  logoTag: {
    fontSize: 12,
    color: TOKENS.inkFaint,
    fontWeight: '400',
    letterSpacing: 0.2,
  },

  // ── Card
  card: {
    marginHorizontal: 18,
    backgroundColor: TOKENS.white,
    borderRadius: TOKENS.r_xl,
    borderWidth: 1,
    borderColor: TOKENS.border,
    padding: 18,
    shadowColor: TOKENS.inkLight,
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  cardSectionLabel: {
    marginBottom: 16,
  },
  sectionLabelText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: TOKENS.inkFaint,
  },

  // ── Role Cards
  roleGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  roleCol: {
    flexDirection: 'column',
  },
  roleCardWrap: {
    flex: 1,
  },
  roleCard: {
    backgroundColor: TOKENS.offWhite,
    borderRadius: TOKENS.r_lg,
    borderWidth: 1.5,
    borderColor: TOKENS.border,
    padding: 16,
    minHeight: 158,
    gap: 5,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  roleIconBox: {
    width: 46,
    height: 46,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  roleIconSymbol: {
    fontSize: 22,
  },
  roleCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: TOKENS.ink,
    letterSpacing: -0.3,
  },
  roleCardSub: {
    fontSize: 11,
    color: TOKENS.inkMid,
    lineHeight: 16,
    fontWeight: '400',
  },
  roleCheck: {
    marginTop: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleCheckMark: {
    fontSize: 11,
    fontWeight: '900',
    color: TOKENS.white,
  },

  // ── Proceed Button
  proceedBtn: {
    height: 54,
    borderRadius: TOKENS.r_md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  proceedBtnLabel: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.1,
  },
  proceedArrow: {
    fontSize: 18,
    fontWeight: '800',
    color: TOKENS.white,
  },

  // ── Back Row
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 18,
    marginBottom: 14,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: TOKENS.r_full,
    backgroundColor: TOKENS.white,
    borderWidth: 1,
    borderColor: TOKENS.border,
  },
  backArrow: {
    fontSize: 15,
    fontWeight: '700',
    color: TOKENS.inkMid,
  },
  backLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: TOKENS.inkMid,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: TOKENS.r_full,
    borderWidth: 1,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // ── Segmented Tab
  segWrap: {
    flexDirection: 'row',
    backgroundColor: TOKENS.offWhite,
    borderRadius: TOKENS.r_md,
    padding: 3,
    marginBottom: 20,
  },
  segPill: {
    flex: 1,
    height: 42,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segPillActive: {
    backgroundColor: TOKENS.white,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  segLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  segLabelActive: {
    fontWeight: '800',
  },

  // ── Form
  formStack: {
    gap: 14,
  },

  // ── Field
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: TOKENS.inkFaint,
    marginLeft: 2,
  },
  fieldBox: {
    height: 52,
    backgroundColor: TOKENS.white,
    borderRadius: TOKENS.r_md,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  fieldInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    color: TOKENS.ink,
    padding: 0,
  },
  eyeBtn: {
    paddingLeft: 8,
  },
  eyeIcon: {
    fontSize: 18,
  },

  // ── Phone Field
  phoneBox: {
    height: 52,
    backgroundColor: TOKENS.white,
    borderRadius: TOKENS.r_md,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  dialCodeBlock: {
    paddingHorizontal: 14,
    height: '100%',
    justifyContent: 'center',
    borderRightWidth: 1.5,
  },
  dialCode: {
    fontSize: 14,
    fontWeight: '800',
  },
  phoneInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    color: TOKENS.ink,
    paddingHorizontal: 14,
    padding: 0,
  },
  phoneOk: {
    marginRight: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneOkSymbol: {
    fontSize: 13,
    fontWeight: '900',
  },

  // ── OTP Block
  otpBlock: {
    borderRadius: TOKENS.r_md,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  otpTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  otpDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  otpSentText: {
    flex: 1,
    fontSize: 12,
    color: TOKENS.inkMid,
    fontWeight: '400',
  },
  otpResend: {
    fontSize: 12,
    fontWeight: '800',
  },

  // ── Dealer Verify
  dealerVerifyBox: {
    borderRadius: TOKENS.r_md,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  verifyStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  verifyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: TOKENS.r_full,
  },
  verifyBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  verifyHint: {
    flex: 1,
    fontSize: 12,
    color: TOKENS.inkMid,
  },

  // ── CTA
  ctaBtn: {
    height: 56,
    borderRadius: TOKENS.r_md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: TOKENS.ink,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  ctaBtnLabel: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.1,
  },
  ctaArrow: {
    fontSize: 18,
    fontWeight: '800',
  },

  // ── Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    gap: 12,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  footerDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: TOKENS.borderMid,
  },
  footerWord: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: TOKENS.inkFaint,
  },
});
