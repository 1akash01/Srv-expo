import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { ScreenTitle, SectionCard, StatPill } from '../../components/Common';
import { banners, featuredProducts, recentActivity } from '../../data/mock';
import { colors } from '../../theme';
import type { AppLanguage, Screen, UserRole } from '../../types';

const copy = {
  en: {
    greeting: 'Good morning',
    dealerDashboard: 'Dealer dashboard',
    electricianDashboard: 'Electrician dashboard',
    weekly: 'Weekly',
    level: 'Level',
    role: 'Role',
    dealer: 'Dealer',
    electrician: 'Electrician',
    shopNow: 'Shop Now',
    scanQr: 'Scan QR',
    earnPoints: 'Earn points',
    support: 'Support',
    rewards: 'Rewards',
    redeemNow: 'Redeem now',
    profile: 'Profile',
    moreOptions: 'More options',
    featuredProducts: 'Featured Products',
    viewAll: 'View all',
    recentActivity: 'Recent Activity',
  },
  hi: {
    greeting: 'सुप्रभात',
    dealerDashboard: 'डीलर डैशबोर्ड',
    electricianDashboard: 'इलेक्ट्रीशियन डैशबोर्ड',
    weekly: 'साप्ताहिक',
    level: 'लेवल',
    role: 'रोल',
    dealer: 'डीलर',
    electrician: 'इलेक्ट्रीशियन',
    shopNow: 'अभी देखें',
    scanQr: 'क्यूआर स्कैन',
    earnPoints: 'पॉइंट कमाएं',
    support: 'सहायता',
    rewards: 'रिवॉर्ड्स',
    redeemNow: 'रिडीम करें',
    profile: 'प्रोफाइल',
    moreOptions: 'और विकल्प',
    featuredProducts: 'फीचर्ड प्रोडक्ट्स',
    viewAll: 'सभी देखें',
    recentActivity: 'हाल की गतिविधि',
  },
  pa: {
    greeting: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ',
    dealerDashboard: 'ਡੀਲਰ ਡੈਸ਼ਬੋਰਡ',
    electricianDashboard: 'ਇਲੈਕਟ੍ਰੀਸ਼ਨ ਡੈਸ਼ਬੋਰਡ',
    weekly: 'ਹਫਤਾਵਾਰੀ',
    level: 'ਲੇਵਲ',
    role: 'ਰੋਲ',
    dealer: 'ਡੀਲਰ',
    electrician: 'ਇਲੈਕਟ੍ਰੀਸ਼ਨ',
    shopNow: 'ਹੁਣੇ ਵੇਖੋ',
    scanQr: 'ਕਿਊਆਰ ਸਕੈਨ',
    earnPoints: 'ਪੌਇੰਟ ਕਮਾਓ',
    support: 'ਸਹਾਇਤਾ',
    rewards: 'ਰਿਵਾਰਡਸ',
    redeemNow: 'ਰੀਡੀਮ ਕਰੋ',
    profile: 'ਪ੍ਰੋਫਾਈਲ',
    moreOptions: 'ਹੋਰ ਵਿਕਲਪ',
    featuredProducts: 'ਫੀਚਰਡ ਪ੍ਰੋਡਕਟਸ',
    viewAll: 'ਸਭ ਵੇਖੋ',
    recentActivity: 'ਹਾਲੀਆ ਗਤੀਵਿਧੀ',
  },
} as const;

export function HomeScreen({ onNavigate, role, language }: { onNavigate: (screen: Screen) => void; role: UserRole; language: AppLanguage }) {
  const { width } = useWindowDimensions();
  const [slide, setSlide] = useState(0);
  const t = copy[language];
  const compactPhone = width < 370;
  const screenPadding = compactPhone ? 12 : 18;
  const contentWidth = width - screenPadding * 2;
  const gridGap = 12;
  const twoColWidth = (contentWidth - gridGap) / 2;

  useEffect(() => {
    const id = setInterval(() => setSlide((value) => (value + 1) % banners.length), 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { padding: screenPadding }]} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#6E241B', '#B13127', '#D56C3E']} style={[styles.hero, compactPhone && styles.heroCompact]}>
        <ScreenTitle
          title={t.greeting}
          subtitle={role === 'dealer' ? t.dealerDashboard : t.electricianDashboard}
          right={<Text style={styles.heroChip}>4,250 pts</Text>}
        />
        <View style={[styles.statRow, compactPhone && styles.statRowCompact]}>
          <StatPill label={t.weekly} value="+120" accent="#FFD27A" />
          <StatPill label={t.level} value="Gold" accent="#FFFFFF" />
          <StatPill label={t.role} value={role === 'dealer' ? t.dealer : t.electrician} accent="#FFFFFF" />
        </View>
      </LinearGradient>

      <LinearGradient colors={banners[slide].colors} style={[styles.banner, compactPhone && styles.bannerCompact]}>
        <Text style={styles.bannerTag}>{banners[slide].tag}</Text>
        <Text style={styles.bannerBrand}>SRV ELECTRICALS</Text>
        <Text style={styles.bannerTitle}>{banners[slide].title}</Text>
        <Text style={styles.bannerSub}>{banners[slide].subtitle}</Text>
        <Pressable style={styles.bannerButton}>
          <Text style={styles.bannerButtonText}>{t.shopNow}</Text>
        </Pressable>
      </LinearGradient>

      <View style={styles.dotRow}>
        {banners.map((item, index) => (
          <Pressable key={item.id} onPress={() => setSlide(index)} style={[styles.dot, index === slide && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.quickGrid}>
        {[
          { key: 'scan', label: t.scanQr, sub: t.earnPoints, glyph: 'QR', action: () => onNavigate('scan') },
          { key: 'wa', label: 'WhatsApp', sub: t.support, glyph: 'WA', action: () => Linking.openURL('https://wa.me/918837684004?text=Hello%20SRV%20Electricals') },
          { key: 'reward', label: t.rewards, sub: t.redeemNow, glyph: 'RW', action: () => onNavigate('rewards') },
          { key: 'profile', label: t.profile, sub: t.moreOptions, glyph: 'ME', action: () => onNavigate('profile') },
        ].map((item) => (
          <Pressable key={item.key} onPress={item.action} style={[styles.quickCard, { width: twoColWidth }]}>
            <View style={styles.quickGlyphBox}>
              <Text style={styles.quickGlyph}>{item.glyph}</Text>
            </View>
            <Text style={styles.quickTitle}>{item.label}</Text>
            <Text style={styles.quickSub}>{item.sub}</Text>
          </Pressable>
        ))}
      </View>

      <SectionCard>
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>{t.featuredProducts}</Text>
          <Pressable onPress={() => onNavigate('product')}>
            <Text style={styles.linkText}>{t.viewAll}</Text>
          </Pressable>
        </View>
        <View style={styles.productGrid}>
          {featuredProducts.map((product) => (
            <View key={product.id} style={[styles.productCard, { width: twoColWidth }]}>
              <LinearGradient colors={product.colors} style={styles.productImageWrap}>
                <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="contain" />
              </LinearGradient>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productDescription}>{product.description}</Text>
              <View style={styles.productMeta}>
                <Text style={styles.productPrice}>{product.price}</Text>
                <Text style={styles.productPoints}>+{product.points} pts</Text>
              </View>
            </View>
          ))}
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={styles.sectionTitle}>{t.recentActivity}</Text>
        <View style={{ marginTop: 10 }}>
          {recentActivity.map((item, index) => (
            <View key={item.id} style={[styles.activityRow, index < recentActivity.length - 1 && styles.activityBorder]}>
              <View style={styles.activityGlyph}>
                <Text style={styles.activityGlyphText}>{item.positive ? '+' : '-'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.activityLabel}>{item.label}</Text>
                <Text style={styles.activityTime}>{item.time}</Text>
              </View>
              <Text style={[styles.activityAmount, item.positive ? styles.positive : styles.negative]}>{item.amount}</Text>
            </View>
          ))}
        </View>
      </SectionCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.appBackground },
  content: { padding: 18, gap: 16, paddingBottom: 120 },
  hero: { borderRadius: 28, padding: 18 },
  heroCompact: { padding: 14, borderRadius: 24 },
  heroChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.16)', color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  statRow: { marginTop: 18, flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  statRowCompact: { gap: 8 },
  banner: { borderRadius: 26, padding: 20, minHeight: 176 },
  bannerCompact: { padding: 16, minHeight: 158, borderRadius: 22 },
  bannerTag: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.14)', color: '#FFD8CA', fontSize: 11, fontWeight: '800' },
  bannerBrand: { marginTop: 18, color: 'rgba(255,255,255,0.62)', letterSpacing: 2.2, fontSize: 11, fontWeight: '800' },
  bannerTitle: { marginTop: 10, fontSize: 28, fontWeight: '900', color: '#FFFFFF' },
  bannerSub: { marginTop: 6, color: 'rgba(255,255,255,0.82)', fontSize: 12, letterSpacing: 2 },
  bannerButton: { alignSelf: 'flex-start', marginTop: 18, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.14)' },
  bannerButtonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 12 },
  dotRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: -4 },
  dot: { width: 7, height: 7, borderRadius: 999, backgroundColor: '#D7C7BD' },
  dotActive: { width: 22, backgroundColor: colors.primary },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  quickCard: { borderRadius: 22, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: colors.border, padding: 14 },
  quickGlyphBox: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#FCECE5', alignItems: 'center', justifyContent: 'center' },
  quickGlyph: { color: colors.primary, fontWeight: '800', fontSize: 12 },
  quickTitle: { marginTop: 12, fontSize: 15, fontWeight: '800', color: colors.text },
  quickSub: { marginTop: 4, fontSize: 12, color: colors.mutedText },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: colors.text },
  linkText: { fontSize: 12, fontWeight: '800', color: colors.primary },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  productCard: {},
  productImageWrap: { borderRadius: 18, minHeight: 112, alignItems: 'center', justifyContent: 'center' },
  productImage: { width: 92, height: 92 },
  productName: { marginTop: 10, fontSize: 13, fontWeight: '800', color: colors.text },
  productDescription: { marginTop: 4, fontSize: 11, color: colors.mutedText },
  productMeta: { marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { fontSize: 12, fontWeight: '800', color: colors.text },
  productPoints: { fontSize: 11, fontWeight: '800', color: colors.success },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  activityBorder: { borderBottomWidth: 1, borderBottomColor: '#F2E7DE' },
  activityGlyph: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#FCECE5', alignItems: 'center', justifyContent: 'center' },
  activityGlyphText: { color: colors.primary, fontSize: 16, fontWeight: '900' },
  activityLabel: { fontSize: 13, fontWeight: '700', color: colors.text },
  activityTime: { marginTop: 3, fontSize: 11, color: colors.mutedText },
  activityAmount: { fontSize: 13, fontWeight: '800' },
  positive: { color: colors.success },
  negative: { color: colors.primary },
});
