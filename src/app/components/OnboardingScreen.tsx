import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { FormInput, LogoMark, PrimaryButton, SectionCard } from '../../components/Common';
import { dealerDirectory, roleContent } from '../../data/mock';
import { colors } from '../../theme';
import type { UserRole } from '../../types';

export function OnboardingScreen({ onGetStarted }: { onGetStarted: (role: UserRole) => void }) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<UserRole>('electrician');
  const [roleLocked, setRoleLocked] = useState(false);
  const [loginPhone, setLoginPhone] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [loginOtp, setLoginOtp] = useState('');
  const [signupOtp, setSignupOtp] = useState('');
  const [loginOtpSent, setLoginOtpSent] = useState(false);
  const [signupOtpSent, setSignupOtpSent] = useState(false);
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [dealerPhone, setDealerPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const content = roleContent[role];
  const isDealer = role === 'dealer';
  const dealerMatch = dealerPhone.length === 10 ? dealerDirectory[dealerPhone] : undefined;

  useEffect(() => {
    setLoginOtpSent(loginPhone.length === 10);
    if (loginPhone.length !== 10) {
      setLoginOtp('');
    }
  }, [loginPhone]);

  useEffect(() => {
    setSignupOtpSent(signupPhone.length === 10);
    if (signupPhone.length !== 10) {
      setSignupOtp('');
    }
  }, [signupPhone]);

  const canContinue = useMemo(() => {
    if (mode === 'login') {
      return loginPhone.length === 10 && loginOtp.length === 4 && password.trim().length >= 6;
    }
    if (fullName.trim().length < 3 || signupPhone.length !== 10 || signupOtp.length !== 4) {
      return false;
    }
    if (isDealer) {
      return businessName.trim().length >= 3;
    }
    return dealerPhone.length === 10;
  }, [businessName, dealerPhone.length, fullName, isDealer, loginOtp.length, loginPhone.length, mode, password, signupOtp.length, signupPhone.length]);

  const lockRole = (nextRole: UserRole) => {
    setRole(nextRole);
    setRoleLocked(true);
    setDealerPhone('');
  };

  const handleContinue = () => {
    if (!canContinue || loading) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onGetStarted(role);
    }, 900);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.shell}>
        <LinearGradient colors={content.tone} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          {roleLocked ? (
            <Pressable onPress={() => setRoleLocked(false)} style={styles.backButton}>
              <Text style={styles.backText}>Back</Text>
            </Pressable>
          ) : null}
          <Text style={styles.heroTitle}>{content.title}</Text>
          <Text style={styles.heroRole}>{isDealer ? 'Dealer' : 'Electrician'}</Text>
          <Text style={styles.heroDescription}>{content.description}</Text>
          <LogoMark />
        </LinearGradient>

        <SectionCard style={styles.formCard}>
          <View style={styles.tabRow}>
            {(['login', 'signup'] as const).map((item) => {
              const active = mode === item;
              return (
                <Pressable key={item} onPress={() => setMode(item)} style={[styles.tab, active && styles.tabActive]}>
                  <Text style={[styles.tabText, active && styles.tabTextActive]}>{item === 'login' ? 'Login' : 'Create Account'}</Text>
                </Pressable>
              );
            })}
          </View>

          {!roleLocked ? (
            <View style={styles.roleGrid}>
              <Pressable onPress={() => lockRole('dealer')} style={[styles.roleCard, role === 'dealer' && styles.roleCardActive]}>
                <Text style={[styles.roleGlyph, role === 'dealer' && styles.roleGlyphActive]}>DL</Text>
                <Text style={styles.roleTitle}>Dealer</Text>
                <Text style={styles.roleSub}>Business access</Text>
              </Pressable>
              <Pressable onPress={() => lockRole('electrician')} style={[styles.roleCard, role === 'electrician' && styles.roleCardActive]}>
                <Text style={[styles.roleGlyph, role === 'electrician' && styles.roleGlyphActive]}>EL</Text>
                <Text style={styles.roleTitle}>Electrician</Text>
                <Text style={styles.roleSub}>Rewards access</Text>
              </Pressable>
            </View>
          ) : null}

          <View style={styles.formBody}>
            {mode === 'signup' ? (
              <>
                <FormInput
                  label="Full Name"
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder={isDealer ? 'Owner or manager name' : 'Enter your full name'}
                />

                {isDealer ? (
                  <FormInput
                    label="Business Name"
                    value={businessName}
                    onChangeText={setBusinessName}
                    placeholder="Enter shop or firm name"
                  />
                ) : (
                  <View style={styles.infoBox}>
                    <FormInput
                      label="Dealer Phone"
                      value={dealerPhone}
                      onChangeText={(value) => setDealerPhone(value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="Enter dealer mobile number"
                      keyboardType="phone-pad"
                    />
                    <View style={styles.matchRow}>
                      <View style={styles.matchBadge}>
                        <Text style={styles.matchBadgeText}>{dealerPhone.length === 10 ? 'Verify' : 'Pending'}</Text>
                      </View>
                      <Text style={styles.matchText}>
                        {dealerMatch ? `${dealerMatch.dealerName}, ${dealerMatch.city}` : 'Enter a 10-digit dealer number'}
                      </Text>
                    </View>
                  </View>
                )}

                <PhoneBlock value={signupPhone} onChangeText={setSignupPhone} />
                {signupOtpSent ? <OtpBlock phone={signupPhone} value={signupOtp} onChangeText={setSignupOtp} /> : null}
              </>
            ) : (
              <>
                <PhoneBlock value={loginPhone} onChangeText={setLoginPhone} />
                {loginOtpSent ? <OtpBlock phone={loginPhone} value={loginOtp} onChangeText={setLoginOtp} /> : null}
                <FormInput label="Password" value={password} onChangeText={setPassword} placeholder="Enter password" secureTextEntry />
              </>
            )}

            <PrimaryButton
              label={loading ? 'Opening dashboard...' : mode === 'login' ? 'Continue to dashboard' : 'Complete registration'}
              onPress={handleContinue}
              disabled={!canContinue || loading}
            />
          </View>
        </SectionCard>
      </View>
    </ScrollView>
  );
}

function PhoneBlock({ value, onChangeText }: { value: string; onChangeText: (value: string) => void }) {
  return (
    <View>
      <Text style={styles.fieldLabel}>Mobile Number</Text>
      <View style={styles.phoneShell}>
        <Text style={styles.countryCode}>+91</Text>
        <View style={styles.countryDivider} />
        <TextInput
          value={value}
          onChangeText={(next) => onChangeText(next.replace(/\D/g, '').slice(0, 10))}
          keyboardType="phone-pad"
          placeholder="Enter mobile number"
          placeholderTextColor="#A8978D"
          style={styles.phoneInput}
        />
        {value.length === 10 ? <Text style={styles.okText}>OK</Text> : null}
      </View>
    </View>
  );
}

function OtpBlock({
  phone,
  value,
  onChangeText,
}: {
  phone: string;
  value: string;
  onChangeText: (value: string) => void;
}) {
  return (
    <View style={styles.infoBox}>
      <View style={styles.otpMeta}>
        <Text style={styles.otpMetaText}>OTP sent to +91 {phone}</Text>
        <Text style={styles.otpLink}>Resend OTP</Text>
      </View>
      <FormInput
        label="OTP"
        value={value}
        onChangeText={(next) => onChangeText(next.replace(/\D/g, '').slice(0, 4))}
        placeholder="Enter 4-digit OTP"
        keyboardType="numeric"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 18, backgroundColor: colors.appBackground, flexGrow: 1 },
  shell: { borderRadius: 32, overflow: 'hidden', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  hero: { paddingHorizontal: 18, paddingTop: 20, paddingBottom: 18 },
  backButton: { alignSelf: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.14)' },
  backText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  heroTitle: { marginTop: 8, fontSize: 30, fontWeight: '900', color: '#FFFFFF', textAlign: 'center' },
  heroRole: { marginTop: 6, fontSize: 15, fontWeight: '700', color: 'rgba(255,255,255,0.94)', textAlign: 'center' },
  heroDescription: { marginTop: 8, fontSize: 12, lineHeight: 18, color: 'rgba(255,255,255,0.82)', textAlign: 'center', paddingHorizontal: 18 },
  formCard: { marginTop: 12, borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: '#FFF8F4' },
  tabRow: { flexDirection: 'row', backgroundColor: '#FAEFE7', borderRadius: 18, padding: 4 },
  tab: { flex: 1, minHeight: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  tabActive: { backgroundColor: '#FFFFFF' },
  tabText: { fontSize: 15, fontWeight: '700', color: '#9C8579' },
  tabTextActive: { color: colors.primary },
  roleGrid: { marginTop: 14, flexDirection: 'row', gap: 12 },
  roleCard: { flex: 1, borderRadius: 20, borderWidth: 1, borderColor: '#E8DDD3', backgroundColor: '#FFFFFF', padding: 14 },
  roleCardActive: { borderColor: '#F1A48C', backgroundColor: '#FFF3EE' },
  roleGlyph: { width: 42, height: 42, borderRadius: 14, textAlign: 'center', textAlignVertical: 'center', paddingTop: 11, overflow: 'hidden', backgroundColor: '#F6EEE8', color: '#9A8075', fontWeight: '800', fontSize: 12 },
  roleGlyphActive: { backgroundColor: colors.primary, color: '#FFFFFF' },
  roleTitle: { marginTop: 12, fontSize: 16, fontWeight: '800', color: colors.text },
  roleSub: { marginTop: 4, fontSize: 12, color: colors.mutedText },
  formBody: { marginTop: 16, gap: 14 },
  infoBox: { borderRadius: 20, borderWidth: 1, borderColor: '#E8DDD3', backgroundColor: '#FFFFFF', padding: 12, gap: 12 },
  fieldLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.4, fontWeight: '800', color: '#8F5B47', marginBottom: 8 },
  phoneShell: { minHeight: 58, borderRadius: 20, borderWidth: 1.5, borderColor: '#F0C7B9', backgroundColor: '#FFFFFF', paddingHorizontal: 14, alignItems: 'center', flexDirection: 'row' },
  countryCode: { fontSize: 18, fontWeight: '800', color: '#BC5036' },
  countryDivider: { width: 1, height: 24, backgroundColor: '#E8DDD3', marginHorizontal: 12 },
  phoneInput: { flex: 1, fontSize: 16, color: colors.text },
  okText: { color: colors.success, fontSize: 12, fontWeight: '800' },
  otpMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  otpMetaText: { flex: 1, fontSize: 12, color: colors.mutedText },
  otpLink: { fontSize: 12, fontWeight: '800', color: colors.primary },
  matchRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  matchBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: '#FCEAE4' },
  matchBadgeText: { fontSize: 11, fontWeight: '800', color: colors.primary },
  matchText: { flex: 1, fontSize: 12, color: colors.mutedText, lineHeight: 17 },
});

