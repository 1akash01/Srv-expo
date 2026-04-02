/**
 * HomeScreen.tsx — SRV Electricals
 * ✅ Real website banners (full image, no text overlay)
 * ✅ Swipe gesture to change slides (PanResponder)
 * ✅ Auto-slide every 4 seconds
 * ✅ Wallet button added next to Bell
 * ✅ Animated progress bar
 * ✅ All existing features preserved
 */

import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Linking,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import ProfileFlipCard from './ProfileFlipCard';

// ─── Theme ────────────────────────────────────────────────────────────────────
const Colors = {
  primary: '#E8453C',
  primaryLight: '#FFF0F0',
  background: '#F0F4FF',
  surface: '#FFFFFF',
  border: '#EEEEF3',
  textDark: '#2D3561',
  textMuted: '#B0B0C0',
  success: '#22c55e',
  successLight: '#e6fdf0',
  gold: '#F59E0B',
  blue: '#3B82F6',
};

// ─── Banner Slides — Real srvelectricals.com images ───────────────────────────
// These are the actual homepage slideshow/hero banner images from the website.
// Replace any URL below with newer ones if the site updates its CDN.
const BANNER_SLIDES = [
  {
    img: 'https://srvelectricals.com/cdn/shop/files/ACO_100A_FP_533x.png?v=1757426480',
    link: 'https://srvelectricals.com/products/automatic-change-over-100a-tp',
    tag: 'New Arrival',
    title: 'AUTOMATIC',
    sub: 'CHANGE OVER SWITCH',
    colors: ['#0f2027', '#203a43', '#2c5364'] as const,
  },
  {
    img: 'https://srvelectricals.com/cdn/shop/files/F8_3_18-40.png?v=1757426631&width=533',
    link: 'https://srvelectricals.com/products/fan-box-3-range',
    tag: '🔥 Best Seller',
    title: 'FAN BOX',
    sub: '3″ RANGE — 18 TO 40 PC',
    colors: ['#1a0005', '#2d0b00', '#3a1000'] as const,
  },
  {
    img: 'https://srvelectricals.com/cdn/shop/files/3x3_679e5d30-ecf2-446e-9452-354bbf4c4a26.png?v=1757426377&width=533',
    link: 'https://srvelectricals.com/products/module-box-platinum-range',
    tag: '💎 Premium',
    title: 'MODULE BOX',
    sub: 'PLATINUM RANGE',
    colors: ['#001a05', '#062a06', '#0a3a08'] as const,
  },
  {
    img: 'https://srvelectricals.com/cdn/shop/files/AP-Turtle-Fan.webp?v=1747938680&width=533',
    link: 'https://srvelectricals.com/products/7159',
    tag: '⭐ Popular',
    title: 'KITCHEN FAN',
    sub: 'TURTLE SERIES',
    colors: ['#1a0a00', '#2d1800', '#3a2000'] as const,
  },
  {
    img: 'https://srvelectricals.com/cdn/shop/files/CRD_PL_3.png?v=1757426566&width=533',
    link: 'https://srvelectricals.com/products/concealed-box-3-range',
    tag: '🏆 Top Pick',
    title: 'CONCEALED BOX',
    sub: '3″ PRECISION RANGE',
    colors: ['#0a001a', '#16002e', '#220040'] as const,
  },
];

// ─── Products ─────────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    name: 'Fan Box 3" Range',
    description: 'F8/FC/FDB 18/40 PC',
    img: 'https://srvelectricals.com/cdn/shop/files/F8_3_18-40.png?v=1757426631&width=300',
    link: 'https://srvelectricals.com/products/fan-box-3-range',
    price: '₹89', points: 10, bg: '#FEF9E7',
  },
  {
    name: 'Concealed Box 3"',
    description: 'CRD PL 3" Precision',
    img: 'https://srvelectricals.com/cdn/shop/files/CRD_PL_3.png?v=1757426566&width=300',
    link: 'https://srvelectricals.com/products/concealed-box-3-range',
    price: '₹120', points: 15, bg: '#EFF6FF',
  },
  {
    name: 'Module Box Platinum',
    description: 'Platinum Range',
    img: 'https://srvelectricals.com/cdn/shop/files/3x3_679e5d30-ecf2-446e-9452-354bbf4c4a26.png?v=1757426377&width=300',
    link: 'https://srvelectricals.com/products/module-box-platinum-range',
    price: '₹245', points: 25, bg: '#F3F0FF',
  },
  {
    name: 'Kitchen Fan Turtle',
    description: 'Premium Ventilation',
    img: 'https://srvelectricals.com/cdn/shop/files/AP-Turtle-Fan.webp?v=1747938680&width=300',
    link: 'https://srvelectricals.com/products/7159',
    price: '₹1,610', points: 45, bg: '#FFF0F0',
  },
];

const RECENT_ACTIVITY = [
  { emoji: '📷', bg: Colors.primaryLight, label: 'SRV Switch 16A scanned', time: 'Today, 10:23 AM', amount: '+50', amtColor: Colors.success },
  { emoji: '🕐', bg: Colors.successLight, label: 'Cashback redeemed', time: 'Yesterday', amount: '−200', amtColor: Colors.primary },
  { emoji: '⭐', bg: '#FFF8E1', label: 'Referral bonus earned', time: '2 days ago', amount: '+100', amtColor: Colors.success },
];

const DUMMY_PROFILE = {
  name: 'Harshvardhan',
  phone: '9162038214',
  electrician_code: 'PB03900-001',
  dealer_code: 'PB-03-900017-001',
  dealer_name: 'Bansal Chauke',
  dealer_town: 'Chauke',
  dealer_phone: '9465258788',
  town: 'Chauke',
  district: 'Mansa',
  state: 'Punjab',
};

type Screen = 'home' | 'scan' | 'rewards' | 'profile' | 'product' | 'wallet' | 'onboarding';

// ─── Main Component ───────────────────────────────────────────────────────────
export function HomeScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const { width } = useWindowDimensions();
  const [slide, setSlide] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const waPulse = useRef(new Animated.Value(0)).current;
  const autoSlideRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cardW = (width - 14 * 2 - 12) / 2;

  // ── Banner dimensions: full-width, 16:9 ratio ──────────────────────────────
  const BANNER_WIDTH = width - 28; // paddingHorizontal 14 * 2
  const BANNER_HEIGHT = Math.round(BANNER_WIDTH * (9 / 16));

  // ── Animated slide transition ──────────────────────────────────────────────
  const goToSlide = (next: number) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.1, duration: 180, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start();
    setSlide(next);
  };

  // ── Auto-slide every 4 seconds ─────────────────────────────────────────────
  const resetAutoSlide = () => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    autoSlideRef.current = setInterval(() => {
      setSlide(prev => {
        const next = (prev + 1) % BANNER_SLIDES.length;
        Animated.sequence([
          // Animated.timing(fadeAnim, { toValue: 0.1, duration: 180, useNativeDriver: true }),
          Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
        ]).start();
        return next;
      });
    }, 4000);
  };

  useEffect(() => {
    resetAutoSlide();
    return () => { if (autoSlideRef.current) clearInterval(autoSlideRef.current); };
  }, []);

  // ── Swipe gesture (PanResponder) ───────────────────────────────────────────
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dx) > 10 && Math.abs(gs.dx) > Math.abs(gs.dy),
      onPanResponderRelease: (_, gs) => {
        if (gs.dx < -40) {
          // Swipe left → next
          setSlide(prev => {
            const next = (prev + 1) % BANNER_SLIDES.length;
            Animated.sequence([
              // Animated.timing(fadeAnim, { toValue: 0.1, duration: 150, useNativeDriver: true }),
              Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
            ]).start();
            return next;
          });
          resetAutoSlide();
        } else if (gs.dx > 40) {
          // Swipe right → prev
          setSlide(prev => {
            const next = (prev - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length;
            Animated.sequence([
              // Animated.timing(fadeAnim, { toValue: 0.1, duration: 150, useNativeDriver: true }),
              Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
            ]).start();
            return next;
          });
          resetAutoSlide();
        }
      },
    })
  ).current;

  // ── Progress bar animate on mount ─────────────────────────────────────────
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 0.85,
      duration: 1300,
      delay: 500,
      useNativeDriver: false,
    }).start();
  }, []);

  // ── WhatsApp pulse ─────────────────────────────────────────────────────────
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(waPulse, { toValue: 1, duration: 1300, useNativeDriver: false }),
        Animated.timing(waPulse, { toValue: 0, duration: 1300, useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const handleWhatsApp = () =>
    Linking.openURL('https://wa.me/918837684004?text=Hello%20SRV%20Electricals%2C%20I%20need%20support');

  const waShadowOpacity = waPulse.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.55] });
  const progressWidth = progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  const current = BANNER_SLIDES[slide];

  const quickActions = [
    { emoji: '📷', bg: Colors.primaryLight, title: 'Scan QR', sub: 'Earn points', onPress: () => onNavigate('scan'), badge: null },
    { emoji: '💬', bg: '#e6fdf0', title: 'WhatsApp', sub: 'Support', onPress: handleWhatsApp, badge: 'LIVE' },
    { emoji: '⭐', bg: '#FFF8E1', title: 'Rewards', sub: '4 new', onPress: () => onNavigate('rewards'), badge: null },
    { emoji: '👤', bg: '#EFF4FF', title: 'Profile', sub: 'Level 3', onPress: () => onNavigate('profile'), badge: null },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* ════════════════════════════════════════════
          HEADER
      ════════════════════════════════════════════ */}
      <LinearGradient
        colors={['#1a235a', '#132050', '#1A2E6E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        {/* Top bar */}
        <View style={styles.headerTop}>
          {/* Brand */}
          <View style={styles.brand}>
            <View style={styles.brandLogoBox}>
              {/* Replace with your actual logo image:
                  <Image source={require('./assets/srv_logo.png')} style={styles.brandLogoImg} resizeMode="contain" /> */}
              <Text style={styles.brandLogoText}>SRV</Text>
            </View>
            <View>
              <Text style={styles.brandSRV}>SRV</Text>
              <Text style={styles.brandSub}>ELECTRICALS</Text>
              <Text style={styles.brandTagline}>Always improving</Text>
            </View>
          </View>

          {/* ── Wallet + Bell ── */}
          <View style={styles.headerActions}>

            {/* 💳 WALLET BUTTON */}
            <TouchableOpacity
              onPress={() => onNavigate('wallet')}
              style={styles.headerBtn}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 18 }}>💳</Text>
              <View style={[styles.badgeDot, { backgroundColor: Colors.gold }]} />
            </TouchableOpacity>

            {/* 🔔 BELL BUTTON */}
            <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
              <Text style={{ fontSize: 18 }}>🔔</Text>
              <View style={[styles.badgeDot, { backgroundColor: Colors.primary }]} />
            </TouchableOpacity>

          </View>
        </View>

        {/* Profile flip card */}
        <ProfileFlipCard profile={DUMMY_PROFILE} role="electrician" />

        {/* Points strip */}
        <View style={styles.pointsStrip}>
          <View>
            <Text style={styles.pointsLabel}>TOTAL POINTS</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
              <Text style={styles.pointsValue}>4,250</Text>
              <Text style={styles.ptsCurrency}>pts</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5 }}>
              <Text style={{ color: Colors.success, fontSize: 13, fontWeight: '700' }}>↗</Text>
              <Text style={styles.trendText}>+120 pts this week</Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 8 }}>
            <View style={styles.goldBadge}>
              <View style={styles.goldDot} />
              <Text style={styles.goldText}>Gold</Text>
            </View>
            <View style={{ width: 118 }}>
              <View style={styles.progressMeta}>
                <Text style={styles.progressMetaText}>Gold</Text>
                <Text style={styles.progressMetaText}>5k → Platinum</Text>
              </View>
              <View style={styles.progressBg}>
                <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* ════════════════════════════════════════════
          BODY
      ════════════════════════════════════════════ */}
      <View style={styles.body}>

        {/* ── BANNER CAROUSEL ────────────────────────────────────────────────
            Full-width image, 16:9 ratio, swipe + auto-slide
        ─────────────────────────────────────────────────────────────────── */}
        <Animated.View
          style={{ opacity: fadeAnim, marginBottom: 20 }}
          {...panResponder.panHandlers}
        >
          <LinearGradient
            colors={current.colors}
            style={[styles.banner, { height: BANNER_HEIGHT + 89 }]}
          >
            {/* Decorative circles */}
            <View style={styles.bannerCircle1} />
            <View style={styles.bannerCircle2} />

            {/* ── Full product image fills the top area ── */}
            <TouchableOpacity
              onPress={() => Linking.openURL(current.link)}
              activeOpacity={0.92}
              style={[styles.bannerImgTouch, { height: BANNER_HEIGHT }]}
            >
              <Image
                source={{ uri: current.img }}
                style={styles.bannerImg}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {/* ── Bottom strip: tag + title + shop btn ── */}
            <View style={styles.bannerBottom}>
              <View style={{ flex: 1 }}>
                <View style={styles.bannerTagPill}>
                  <Text style={styles.bannerTagText}>{current.tag}</Text>
                </View>
                <Text style={styles.bannerTitle} numberOfLines={1}>{current.title}</Text>
                <Text style={styles.bannerSub} numberOfLines={1}>{current.sub}</Text>
              </View>
              <TouchableOpacity
                onPress={() => Linking.openURL(current.link)}
                style={styles.shopBtn}
              >
                <Text style={styles.shopBtnText}>Shop →</Text>
              </TouchableOpacity>
            </View>

            {/* Dots */}
            <View style={styles.dotsRow}>
              {BANNER_SLIDES.map((_, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => { goToSlide(i); resetAutoSlide(); }}
                  hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                >
                  <View style={[styles.dot, i === slide && styles.dotActive]} />
                </TouchableOpacity>
              ))}
            </View>
          </LinearGradient>
        </Animated.View>

        {/* ── QUICK ACTIONS ──────────────────────────────────────────────── */}
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

        {/* ── WHATSAPP BANNER ────────────────────────────────────────────── */}
        <Animated.View
          style={{
            shadowOpacity: waShadowOpacity,
            shadowColor: '#22c55e',
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 18,
            elevation: 6,
            marginBottom: 20,
            borderRadius: 20,
          }}
        >
          <TouchableOpacity onPress={handleWhatsApp} style={styles.waBanner} activeOpacity={0.85}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
              <View style={styles.waIconBox}>
                <Text style={{ fontSize: 22 }}>💬</Text>
              </View>
              <View>
                <Text style={styles.waTitle}>Got a Query?</Text>
                <Text style={styles.waSub}>Reach out on WhatsApp</Text>
              </View>
            </View>
            <View style={styles.waChatBtn}>
              <Text style={styles.waChatBtnText}>Chat Now</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* ── FEATURED PRODUCTS ──────────────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>FEATURED PRODUCTS</Text>
          <TouchableOpacity onPress={() => onNavigate('product')} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.viewAllText}>View All </Text>
            <Text style={{ color: Colors.primary, fontSize: 16, fontWeight: '700' }}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.productsGrid}>
          {PRODUCTS.map((p, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => Linking.openURL(p.link)}
              style={[styles.productCard, { width: cardW }]}
              activeOpacity={0.88}
            >
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
            </TouchableOpacity>
          ))}
        </View>

        {/* ── RECENT ACTIVITY ────────────────────────────────────────────── */}
        <Text style={[styles.sectionLabel, { marginBottom: 10 }]}>RECENT ACTIVITY</Text>
        <View style={styles.activityCard}>
          {RECENT_ACTIVITY.map((item, i) => (
            <View
              key={i}
              style={[
                styles.activityRow,
                i < RECENT_ACTIVITY.length - 1 && styles.activityRowBorder,
              ]}
            >
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

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 22,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    gap: 14,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Brand
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandLogoBox: {
    width: 44, height: 34,
    backgroundColor: '#19024a',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLogoImg: { width: 40, height: 30 },        // use if you have logo asset
  brandLogoText: { color: '#E8453C', fontWeight: '900', fontSize: 13, letterSpacing: 1 },
  brandSRV: { color: '#FF6B6B', fontWeight: '900', fontSize: 16, letterSpacing: 2, lineHeight: 18 },
  brandSub: { color: 'rgba(255,255,255,0.38)', fontSize: 8.5, fontWeight: '600', letterSpacing: 2.5 },
  brandTagline: { color: 'rgba(255,255,255,0.2)', fontSize: 7.5, fontStyle: 'italic', letterSpacing: 0.8 },

  // Header action buttons
  headerActions: { flexDirection: 'row', gap: 8 },
  headerBtn: {
    width: 40, height: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeDot: {
    position: 'absolute',
    top: 7, right: 7,
    width: 8, height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#0B1437',
  },

  // ── Points strip ────────────────────────────────────────────────────────────
  pointsStrip: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsLabel: { color: 'rgba(255,255,255,0.38)', fontSize: 9, fontWeight: '700', letterSpacing: 2, marginBottom: 3 },
  pointsValue: { color: '#fff', fontWeight: '900', fontSize: 30, letterSpacing: -1 },
  ptsCurrency: { color: 'rgba(255,255,255,0.45)', fontSize: 13, fontWeight: '600' },
  trendText: { color: Colors.success, fontSize: 11, fontWeight: '600' },
  goldBadge: {
    backgroundColor: 'rgba(245,158,11,0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(245,158,11,0.38)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  goldDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: Colors.gold },
  goldText: { color: Colors.gold, fontSize: 12, fontWeight: '700' },
  progressMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  progressMetaText: { color: 'rgba(255,255,255,0.3)', fontSize: 9, fontWeight: '600' },
  progressBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3, backgroundColor: Colors.gold },

  // ── Body ────────────────────────────────────────────────────────────────────
  body: { paddingHorizontal: 14, paddingTop: 18 },
  sectionLabel: { color: Colors.textMuted, fontSize: 9, fontWeight: '700', letterSpacing: 2, marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  viewAllText: { color: Colors.primary, fontSize: 13, fontWeight: '600' },

  // ── Banner ──────────────────────────────────────────────────────────────────
  banner: {
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  bannerCircle1: {
    position: 'absolute',
    width: 200, height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.03)',
    top: -60, right: -40,
  },
  bannerCircle2: {
    position: 'absolute',
    width: 120, height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.02)',
    bottom: 40, left: -20,
  },
  bannerImgTouch: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerImg: {
    width: '100%',
    height: '100%',
  },
  bannerBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    gap: 10,
  },
  bannerTagPill: {
    backgroundColor: 'rgba(255,107,107,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.3)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: 3,
  },
  bannerTagText: { color: '#ff9090', fontSize: 9.5, fontWeight: '700' },
  bannerTitle: { color: '#fff', fontWeight: '900', fontSize: 15, letterSpacing: 0.5 },
  bannerSub: { color: 'rgba(255,255,255,0.4)', fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase' },
  shopBtn: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 7,
    flexShrink: 0,
  },
  shopBtnText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingBottom: 10,
    marginTop: 2,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.3)' },
  dotActive: { width: 20, height: 6, borderRadius: 3, backgroundColor: '#FF6B6B' },

  // ── Quick actions ────────────────────────────────────────────────────────────
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  quickCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  quickIconBox: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  liveBadge: { backgroundColor: '#22c55e', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  liveBadgeText: { color: '#fff', fontSize: 8, fontWeight: '800' },
  quickTitle: { color: Colors.textDark, fontSize: 14, fontWeight: '700' },
  quickSub: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },

  // ── WhatsApp banner ──────────────────────────────────────────────────────────
  waBanner: {
    backgroundColor: '#e6fff2',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  waIconBox: {
    width: 48, height: 48,
    backgroundColor: '#22c55e',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waTitle: { fontSize: 14, fontWeight: '800', color: '#15803d' },
  waSub: { fontSize: 11, color: '#16a34a', marginTop: 2 },
  waChatBtn: {
    backgroundColor: '#22c55e',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  waChatBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  // ── Products ─────────────────────────────────────────────────────────────────
  productsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  productCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  productImgBox: { height: 110, alignItems: 'center', justifyContent: 'center' },
  productImg: { width: 88, height: 88 },
  productInfo: { padding: 12 },
  productName: { color: Colors.textDark, fontSize: 13, fontWeight: '700', marginBottom: 3 },
  productDesc: { color: Colors.textMuted, fontSize: 11, marginBottom: 10 },
  productBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { color: Colors.textDark, fontWeight: '800', fontSize: 15 },
  ptsTag: { backgroundColor: Colors.successLight, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  ptsTagText: { color: Colors.success, fontSize: 11, fontWeight: '700' },

  // ── Activity ─────────────────────────────────────────────────────────────────
  activityCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 8,
  },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  activityRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F5F5FB' },
  activityIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  activityLabel: { color: Colors.textDark, fontSize: 13, fontWeight: '600' },
  activityTime: { color: Colors.textMuted, fontSize: 11, marginTop: 2 },
  activityAmt: { fontSize: 15, fontWeight: '700' },
});