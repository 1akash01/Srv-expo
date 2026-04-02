/**
 * ProfileFlipCard — Expo React Native
 * 3D flip animation using react-native-reanimated
 * Front: profile info | Back: dealer/address info + QR
 */

import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Profile {
  name?: string;
  phone?: string;
  dealer_code?: string;
  electrician_code?: string;
  dealer_name?: string;
  dealer_town?: string;
  dealer_phone?: string;
  town?: string;
  district?: string;
  state?: string;
}

interface Props {
  profile?: Profile;
  role?: 'dealer' | 'electrician';
}

// ─── BackRow helper ───────────────────────────────────────────────────────────
function BackRow({ icon, label, bold, accent }: { icon: string; label?: string; bold?: boolean; accent?: boolean }) {
  return (
    <View style={bStyles.row}>
      <Text style={bStyles.icon}>{icon}</Text>
      <Text
        numberOfLines={1}
        style={[
          bStyles.label,
          bold && bStyles.labelBold,
          accent && bStyles.labelAccent,
        ]}
      >
        {label || '—'}
      </Text>
    </View>
  );
}

const bStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 5 },
  icon: { fontSize: 12, width: 16 },
  label: { fontSize: 11, fontWeight: '500', color: 'rgba(255,255,255,0.65)', flex: 1 },
  labelBold: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  labelAccent: { color: '#FFD54F', fontWeight: '700' },
});

// ─── Flip Icon SVG-like using Text ────────────────────────────────────────────
function FlipIcon() {
  return (
    <View style={styles.flipIconBox}>
      <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>⇄</Text>
    </View>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProfileFlipCard({ profile, role }: Props) {
  const [flipped, setFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  // On mount: auto flip to back at 5s, return at 9.5s
  useEffect(() => {
    const t1 = setTimeout(() => doFlip(true), 5000);
    const t2 = setTimeout(() => doFlip(false), 9500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const doFlip = (toBack: boolean) => {
    setFlipped(toBack);
    Animated.spring(flipAnim, {
      toValue: toBack ? 1 : 0,
      useNativeDriver: true,
      tension: 60,
      friction: 8,
    }).start();
  };

  const handlePress = () => {
    const next = !flipped;
    doFlip(next);
    if (next) {
      setTimeout(() => doFlip(false), 5000);
    }
  };

  const initials = (profile?.name || 'U')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const code = role === 'dealer' ? profile?.dealer_code : profile?.electrician_code;

  // Interpolate front and back rotations
  const frontRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const backRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });
  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.49, 0.5, 1],
    outputRange: [1, 1, 0, 0],
  });
  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.49, 0.5, 1],
    outputRange: [0, 0, 1, 1],
  });

  // QR from quickchart.io
  const qrValue = code || profile?.phone || 'SRV';
  const qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(qrValue)}&size=200&margin=1&dark=000000&light=ffffff`;

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={1}>
      <View style={styles.cardContainer}>

        {/* ── FRONT FACE ── */}
        <Animated.View
          style={[
            styles.face,
            styles.front,
            { opacity: frontOpacity, transform: [{ rotateY: frontRotate }] },
          ]}
        >
          {/* Avatar */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          {/* Info */}
          <View style={styles.info}>
            <Text style={styles.roleLabel}>
              {role === 'dealer' ? '🏪 Dealer Account' : '🔌 Electrician Account'}
            </Text>
            <Text style={styles.name} numberOfLines={1}>
              {profile?.name || 'Harshvardhan'}
            </Text>
            <View style={styles.codePill}>
              <Text style={styles.codeText}>{code || 'PB03900-001'}</Text>
            </View>
          </View>

          {/* Flip hint */}
          <View style={styles.flipHint}>
            <FlipIcon />
            <Text style={styles.flipLabel}>FLIP</Text>
          </View>
        </Animated.View>

        {/* ── BACK FACE ── */}
        <Animated.View
          style={[
            styles.face,
            styles.back,
            { opacity: backOpacity, transform: [{ rotateY: backRotate }] },
          ]}
        >
          {/* Left: address */}
          <View style={styles.backLeft}>
            <Text style={styles.backSectionLabel}>
              {role === 'dealer' ? 'Shop Address' : 'Connected Dealer'}
            </Text>
            {role === 'dealer' ? (
              <>
                <BackRow icon="🏪" label={profile?.name || 'Harshvardhan'} bold />
                <BackRow icon="📍" label={profile?.town || 'Chauke'} />
                <BackRow icon="🏙️" label={`${profile?.district || 'Mansa'}, ${profile?.state || 'Punjab'}`} />
                <BackRow icon="📱" label={`+91 ${profile?.phone || '9162038214'}`} />
              </>
            ) : (
              <>
                <BackRow icon="🏪" label={profile?.dealer_name || 'Bansal Chauke'} bold />
                <BackRow icon="📍" label={profile?.dealer_town || 'Chauke'} />
                <BackRow icon="📱" label={`+91 ${profile?.dealer_phone || '9465258788'}`} />
                <BackRow icon="🔖" label={profile?.dealer_code || 'PB-03-900017-001'} accent />
              </>
            )}
          </View>

          {/* Right: QR code */}
          <View style={styles.backRight}>
            <View style={styles.qrBox}>
              <Image
                source={{ uri: qrUrl }}
                style={styles.qrImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.qrLabel} numberOfLines={2}>
              {qrValue}
            </Text>
          </View>
        </Animated.View>

      </View>

      <Text style={styles.tapHint}>
        Tap card to {flipped ? 'see profile' : 'see address & QR'}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const CARD_HEIGHT = 130;

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    height: CARD_HEIGHT,
    position: 'relative',
  },

  // Both faces share absolute positioning
  face: {
    position: 'absolute',
    width: '100%',
    height: CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: '#2D3561',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    overflow: 'hidden',
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },

  front: {
    gap: 14,
  },

  back: {
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },

  // ── Front ──
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 18,
    flexShrink: 0,
    backgroundColor: '#FF6B6B',
    alignItems: 'center',
    justifyContent: 'center',
    // gradient simulation with border
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.18)',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },

  info: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  roleLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  name: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 17,
  },
  codePill: {
    marginTop: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  codeText: {
    color: '#FFD54F',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  flipHint: {
    flexShrink: 0,
    alignItems: 'center',
    gap: 3,
  },
  flipIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipLabel: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.3)',
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // ── Back ──
  backLeft: {
    flex: 1,
    minWidth: 0,
  },
  backSectionLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },

  backRight: {
    flexShrink: 0,
    width: 88,
    alignItems: 'center',
    gap: 4,
  },
  qrBox: {
    width: 80,
    height: 80,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    padding: 3,
  },
  qrImage: {
    width: '100%',
    height: '100%',
  },
  qrLabel: {
    fontSize: 7,
    color: 'rgba(255,255,255,0.35)',
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
    lineHeight: 10,
  },

  // ── Hint below card ──
  tapHint: {
    textAlign: 'center',
    fontSize: 10,
    color: 'rgba(255,255,255,0.3)',
    marginTop: 6,
    letterSpacing: 0.3,
  },
});