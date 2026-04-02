import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

// ─── Theme ────────────────────────────────────────────────────────────────────
const Colors = {
  primary: '#E8453C',
  primaryLight: '#FFF0F0',
  background: '#F2F3F7',
  surface: '#FFFFFF',
  border: '#EEEEF3',
  textDark: '#1C1E2E',
  textMuted: '#9898A8',
  success: '#22c55e',
  successLight: '#e6fdf0',
  warning: '#F59E0B',
  gold: '#F59E0B',
  blue: '#3B82F6',
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const BANNER_SLIDES = [
  { tag: '🆕 New Arrival', emoji: '⚡', title: 'AUTOMATIC', sub: 'CHANGE OVER SWITCH', colors: ['#1a1a2e', '#16213e', '#0f3460'] as const },
  { tag: '🔥 Best Seller', emoji: '🔌', title: 'MODULAR', sub: 'SWITCH PLATES', colors: ['#0d0d1a', '#1a1a2e', '#1a0010'] as const },
  { tag: '💎 Premium', emoji: '📦', title: 'JUNCTION', sub: 'BOX SERIES', colors: ['#1a0005', '#2d0000', '#2d0010'] as const },
  { tag: '⭐ Popular', emoji: '💨', title: 'FAN BOX', sub: 'CONCEALED RANGE', colors: ['#001a05', '#0a2a0a', '#0a2a05'] as const },
];

const products = [
  { name: 'Fan Box 3" Range', description: 'F8/FC/FDB 18/40 PC', img: 'https://srvelectricals.com/cdn/shop/files/F8_3_18-40.png?v=1757426631&width=240', price: '₹89', points: 10, bg: '#FEF9E7' },
  { name: 'Concealed Box 3"', description: 'CRD PL 3" Precision', img: 'https://srvelectricals.com/cdn/shop/files/CRD_PL_3.png?v=1757426566&width=240', price: '₹120', points: 15, bg: '#EFF6FF' },
  { name: 'Module Box Platinum', description: 'Platinum Range', img: 'https://srvelectricals.com/cdn/shop/files/3x3_679e5d30-ecf2-446e-9452-354bbf4c4a26.png?v=1757426377&width=240', price: '₹245', points: 25, bg: '#F3F0FF' },
  { name: 'Kitchen Fan Royal', description: 'Premium Ventilation', img: 'https://srvelectricals.com/cdn/shop/files/Kitchen-Fan-Royal.png?v=1741846906&width=240', price: '₹599', points: 45, bg: '#FFF0F0' },
];

const recentActivity = [
  { emoji: '📷', bg: Colors.primaryLight, label: 'SRV Switch 16A scanned', time: 'Today, 10:23 AM', amount: '+50', amtColor: Colors.success },
  { emoji: '🕐', bg: Colors.successLight, label: 'Cashback redeemed', time: 'Yesterday', amount: '−200', amtColor: Colors.primary },
  { emoji: '⭐', bg: '#FFF8E1', label: 'Referral bonus earned', time: '2 days ago', amount: '+100', amtColor: Colors.success },
];

type Screen = 'home' | 'scan' | 'rewards' | 'profile' | 'product' | 'wallet';

export function HomeScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const { width } = useWindowDimensions();
  const [slide, setSlide] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const cardW = (width - 14 * 2 - 12) / 2;

  useEffect(() => {
    const t = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0.2, duration: 200, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
      setSlide((p) => (p + 1) % BANNER_SLIDES.length);
    }, 3800);
    return () => clearInterval(t);
  }, [fadeAnim]);

  const handleWhatsApp = () =>
    Linking.openURL('https://wa.me/918837684004?text=Hello%20SRV%20Electricals%2C%20I%20need%20support');

  const current = BANNER_SLIDES[slide];

  const quickActions = [
    { emoji: '📷', bg: Colors.primaryLight, title: 'Scan QR', sub: 'Earn points', onPress: () => onNavigate('scan'), badge: null },
    { emoji: '💬', bg: '#e6fdf0', title: 'WhatsApp', sub: 'Support', onPress: handleWhatsApp, badge: 'LIVE' },
    { emoji: '⭐', bg: '#FFF8E1', title: 'Rewards', sub: '4 new', onPress: () => onNavigate('rewards'), badge: null },
    { emoji: '👤', bg: '#EFF4FF', title: 'Profile', sub: 'Level 3', onPress: () => onNavigate('profile'), badge: null },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={['#2D3561', '#3D4575']} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greetingSmall}>Good morning,</Text>
            <Text style={styles.greetingName}>Harsh Vardhan 👋</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => onNavigate('wallet')} style={styles.headerBtn}>
              <Text style={{ fontSize: 18 }}>💳</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerBtn}>
              <Text style={{ fontSize: 18 }}>🔔</Text>
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.pointsCard}>
          <View>
            <Text style={styles.pointsLabel}>TOTAL POINTS</Text>
            <Text style={styles.pointsValue}>4,250</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <Text style={{ color: Colors.success, fontSize: 14 }}>↗ </Text>
              <Text style={styles.trendText}>+120 pts this week</Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end', justifyContent: 'center', gap: 8 }}>
            <View style={styles.goldBadge}>
              <View style={styles.goldDot} />
              <Text style={styles.goldText}>Gold</Text>
            </View>
            <Text style={styles.platinumHint}>750 pts → Platinum</Text>
          </View>
        </View>

        <View style={styles.progressMeta}>
          <Text style={styles.progressLabel}>Gold</Text>
          <Text style={styles.progressLabel}>Platinum at 5,000 pts</Text>
        </View>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: '85%' }]} />
        </View>
      </LinearGradient>

      <View style={styles.body}>
        {/* Banner */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <LinearGradient colors={current.colors} style={styles.banner}>
            <View style={{ gap: 6, marginBottom: 16 }}>
              <View style={styles.bannerTag}>
                <Text style={styles.bannerTagText}>{current.tag}</Text>
              </View>
              <Text style={{ fontSize: 40 }}>{current.emoji}</Text>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 3 }}>
                  <Text style={styles.bannerBrandSRV}>SRV</Text>
                  <Text style={styles.bannerBrandSub}> ELECTRICALS</Text>
                </View>
                <Text style={styles.bannerTitle}>{current.title}</Text>
                <Text style={styles.bannerSub}>{current.sub}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://srvelectricals.com')}
              style={styles.shopBtn}
            >
              <Text style={styles.shopBtnText}>Shop Now →</Text>
            </TouchableOpacity>
            <View style={styles.dotsRow}>
              {BANNER_SLIDES.map((_, i) => (
                <TouchableOpacity key={i} onPress={() => setSlide(i)}>
                  <View style={[styles.dot, i === slide && styles.dotActive]} />
                </TouchableOpacity>
              ))}
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Quick Actions */}
        <Text style={styles.sectionLabel}>QUICK ACTIONS</Text>
        <View style={styles.quickGrid}>
          {quickActions.map((item, i) => (
            <TouchableOpacity
              key={i}
              onPress={item.onPress}
              style={[styles.quickCard, { width: cardW }]}
              activeOpacity={0.75}
            >
              <View style={styles.quickCardTop}>
                <View style={[styles.quickIconBox, { backgroundColor: item.bg }]}>
                  <Text style={{ fontSize: 22 }}>{item.emoji}</Text>
                </View>
                {item.badge && (
                  <View style={styles.liveBadge}>
                    <Text style={styles.liveBadgeText}>{item.badge}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.quickTitle}>{item.title}</Text>
              <Text style={styles.quickSub}>{item.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* WhatsApp Banner */}
        <TouchableOpacity onPress={handleWhatsApp} style={styles.waBanner} activeOpacity={0.85}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
            <View style={styles.waIcon}>
              <Text style={{ fontSize: 22 }}>💬</Text>
            </View>
            <View>
              <Text style={styles.waTitle}>Got a Query?</Text>
              <Text style={styles.waSub}>Reach out to us on WhatsApp</Text>
            </View>
          </View>
          <View style={styles.waChatBtn}>
            <Text style={styles.waChatBtnText}>Chat Now</Text>
          </View>
        </TouchableOpacity>

        {/* Featured Products */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={styles.sectionLabel}>FEATURED PRODUCTS</Text>
          <TouchableOpacity onPress={() => onNavigate('product')} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.viewAllText}>View All</Text>
            <Text style={{ color: Colors.primary, fontSize: 14, fontWeight: '700' }}> ›</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.productsGrid}>
          {products.map((p, idx) => (
            <View key={idx} style={[styles.productCard, { width: cardW }]}>
              <View style={[styles.productImgBox, { backgroundColor: p.bg }]}>
                <Image source={{ uri: p.img }} style={styles.productImg} resizeMode="contain" />
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>{p.name}</Text>
                <Text style={styles.productDesc} numberOfLines={1}>{p.description}</Text>
                <View style={styles.productBottom}>
                  <Text style={styles.productPrice}>{p.price}</Text>
                  <View style={styles.ptsTag}>
                    <Text style={styles.ptsTagText}>+{p.points} pts</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Activity */}
        <Text style={[styles.sectionLabel, { marginBottom: 10 }]}>RECENT ACTIVITY</Text>
        <View style={styles.activityCard}>
          {recentActivity.map((item, i) => (
            <View key={i} style={[styles.activityRow, i < recentActivity.length - 1 && styles.activityRowBorder]}>
              <View style={[styles.activityIcon, { backgroundColor: item.bg }]}>
                <Text style={{ fontSize: 16 }}>{item.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.activityLabel}>{item.label}</Text>
                <Text style={styles.activityTime}>{item.time}</Text>
              </View>
              <Text style={[styles.activityAmt, { color: item.amtColor }]}>{item.amount}</Text>
            </View>
          ))}
        </View>
        <View style={{ height: 30 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 16, paddingTop: 56, paddingBottom: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  greetingSmall: { color: 'rgba(255,255,255,0.55)', fontSize: 12 },
  greetingName: { color: '#fff', fontWeight: '800', fontSize: 20 },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerBtn: { width: 42, height: 42, backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  notifDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  pointsCard: { backgroundColor: '#fff', borderRadius: 18, padding: 16, flexDirection: 'row', justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 6 },
  pointsLabel: { color: Colors.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginBottom: 4 },
  pointsValue: { color: Colors.textDark, fontWeight: '800', fontSize: 36 },
  trendText: { color: Colors.success, fontSize: 12, fontWeight: '600' },
  goldBadge: { backgroundColor: '#FFF8E1', borderWidth: 2, borderColor: Colors.gold, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: 6 },
  goldDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.gold },
  goldText: { color: '#B8860B', fontSize: 13, fontWeight: '700' },
  platinumHint: { color: '#D0D0E0', fontSize: 10, fontWeight: '600' },
  progressMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, marginBottom: 6 },
  progressLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: '600' },
  progressBg: { height: 7, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4, backgroundColor: Colors.gold },
  body: { paddingHorizontal: 14, paddingTop: 16 },
  banner: { borderRadius: 22, padding: 22, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 10 },
  bannerTag: { backgroundColor: 'rgba(255,107,107,0.22)', borderWidth: 1, borderColor: 'rgba(255,107,107,0.35)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, alignSelf: 'flex-start' },
  bannerTagText: { color: '#ff9090', fontSize: 11, fontWeight: '700' },
  bannerBrandSRV: { color: Colors.primary, fontWeight: '900', fontSize: 12, letterSpacing: 2 },
  bannerBrandSub: { color: 'rgba(255,255,255,0.35)', fontSize: 10, letterSpacing: 1.5 },
  bannerTitle: { color: '#fff', fontWeight: '900', fontSize: 28, letterSpacing: 1 },
  bannerSub: { color: 'rgba(255,255,255,0.5)', fontSize: 12, letterSpacing: 2.5, marginTop: 3 },
  shopBtn: { backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)', borderRadius: 22, paddingHorizontal: 20, paddingVertical: 10, alignSelf: 'flex-start' },
  shopBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 7, marginTop: 16 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.35)' },
  dotActive: { width: 24, height: 6, borderRadius: 3, backgroundColor: Colors.primary },
  sectionLabel: { color: Colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 12 },
  viewAllText: { color: Colors.primary, fontSize: 13, fontWeight: '600' },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  quickCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.border, borderRadius: 20, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  quickCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  quickIconBox: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  liveBadge: { backgroundColor: '#22c55e', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  liveBadgeText: { color: '#fff', fontSize: 8, fontWeight: '800' },
  quickTitle: { color: Colors.textDark, fontSize: 15, fontWeight: '700' },
  quickSub: { color: Colors.textMuted, fontSize: 12, marginTop: 3 },
  waBanner: { backgroundColor: '#e6fff2', borderWidth: 1, borderColor: '#bbf7d0', borderRadius: 20, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  waIcon: { width: 48, height: 48, backgroundColor: '#22c55e', borderRadius: 14, alignItems: 'center', justifyContent: 'center', shadowColor: '#22c55e', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 6 },
  waTitle: { fontSize: 15, fontWeight: '800', color: '#15803d' },
  waSub: { fontSize: 12, color: '#16a34a', marginTop: 2 },
  waChatBtn: { backgroundColor: '#22c55e', borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, shadowColor: '#22c55e', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.38, shadowRadius: 8, elevation: 6 },
  waChatBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  productsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  productCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.border, borderRadius: 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  productImgBox: { height: 120, alignItems: 'center', justifyContent: 'center' },
  productImg: { width: 90, height: 90 },
  productInfo: { padding: 12 },
  productName: { color: Colors.textDark, fontSize: 14, fontWeight: '700', marginBottom: 3 },
  productDesc: { color: Colors.textMuted, fontSize: 12, marginBottom: 10 },
  productBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { color: Colors.textDark, fontWeight: '800', fontSize: 16 },
  ptsTag: { backgroundColor: Colors.successLight, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  ptsTagText: { color: Colors.success, fontSize: 12, fontWeight: '700' },
  activityCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.border, borderRadius: 18, overflow: 'hidden', marginBottom: 8 },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  activityRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F5F5FB' },
  activityIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  activityLabel: { color: Colors.textDark, fontSize: 13, fontWeight: '600' },
  activityTime: { color: Colors.textMuted, fontSize: 11, marginTop: 2 },
  activityAmt: { fontSize: 16, fontWeight: '700' },
});