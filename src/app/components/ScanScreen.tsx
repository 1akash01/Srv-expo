import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

const Colors = {
  primary: '#E8453C',
  background: '#EEF0F7',
  surface: '#FFFFFF',
  border: '#EEEEF3',
  textDark: '#1C1E2E',
  textMuted: '#9898A8',
  success: '#22c55e',
};

type Screen = 'home' | 'scan' | 'rewards' | 'profile' | 'product' | 'wallet';

function AnimatedQR({ size, scanning }: { size: number; scanning: boolean }) {
  const dotAnimations = useRef(
    Array.from({ length: 25 }, () => new Animated.Value(0.2))
  ).current;

  useEffect(() => {
    if (scanning) {
      const animations = dotAnimations.map((anim, i) =>
        Animated.loop(
          Animated.sequence([
            Animated.delay((i * 80) % 600),
            Animated.timing(anim, { toValue: 1, duration: 350, useNativeDriver: true }),
            Animated.timing(anim, { toValue: 0.2, duration: 350, useNativeDriver: true }),
          ])
        )
      );
      Animated.parallel(animations).start();
    } else {
      dotAnimations.forEach((anim) => { anim.stopAnimation(); anim.setValue(0.2); });
    }
  }, [scanning]);

  const pattern = [
    [1,1,0,1,1],[1,0,1,1,0],[0,1,1,0,1],[1,1,0,1,1],[1,0,1,1,1],
  ];
  const dotSize = Math.floor(size / 11);
  const gap = dotSize * 0.55;

  return (
    <View style={{ gap }}>
      {pattern.map((row, r) => (
        <View key={r} style={{ flexDirection: 'row', gap }}>
          {row.map((cell, c) => (
            <Animated.View
              key={c}
              style={{
                width: dotSize * 1.9, height: dotSize * 1.9,
                borderRadius: dotSize * 0.5,
                backgroundColor: cell ? '#1C1E2E' : 'rgba(28,30,46,0.12)',
                opacity: cell ? dotAnimations[r * 5 + c] : 0.12,
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

export function ScanScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const { width } = useWindowDimensions();
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const frameSize = Math.min(width - 64, 260);

  const laserY = useRef(new Animated.Value(0)).current;
  const laserOpacity = useRef(new Animated.Value(0)).current;
  const cornerOpacity = useRef(new Animated.Value(1)).current;
  const cornerScale = useRef(new Animated.Value(1)).current;
  const successScale = useRef(new Animated.Value(0)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;
  const frameGlow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (scanning) {
      laserOpacity.setValue(1);
      laserY.setValue(0);
      Animated.loop(
        Animated.sequence([
          Animated.timing(laserY, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.sine), useNativeDriver: true }),
          Animated.timing(laserY, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.sine), useNativeDriver: true }),
        ])
      ).start();
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(cornerOpacity, { toValue: 0.3, duration: 400, useNativeDriver: true }),
            Animated.timing(cornerScale, { toValue: 0.96, duration: 400, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(cornerOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.timing(cornerScale, { toValue: 1, duration: 400, useNativeDriver: true }),
          ]),
        ])
      ).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(frameGlow, { toValue: 1, duration: 800, useNativeDriver: false }),
          Animated.timing(frameGlow, { toValue: 0, duration: 800, useNativeDriver: false }),
        ])
      ).start();
    } else {
      laserOpacity.setValue(0);
      laserY.stopAnimation(); cornerOpacity.stopAnimation(); cornerOpacity.setValue(1);
      cornerScale.stopAnimation(); cornerScale.setValue(1);
      frameGlow.stopAnimation(); frameGlow.setValue(0);
    }
  }, [scanning]);

  useEffect(() => {
    if (scanned) {
      successScale.setValue(0.3); successOpacity.setValue(0);
      Animated.parallel([
        Animated.spring(successScale, { toValue: 1, useNativeDriver: true, tension: 55, friction: 7 }),
        Animated.timing(successOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    } else { successScale.setValue(0); successOpacity.setValue(0); }
  }, [scanned]);

  const startScan = () => { setScanned(false); setScanning(true); setTimeout(() => { setScanning(false); setScanned(true); }, 3000); };

  const laserTranslate = laserY.interpolate({ inputRange: [0, 1], outputRange: [0, frameSize - 8] });
  const frameBorderColor = frameGlow.interpolate({ inputRange: [0, 1], outputRange: [Colors.primary, '#FF8A85'] });

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={() => onNavigate('home')} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Scan QR Code</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Point camera at the QR sticker{'\n'}on any SRV product box</Text>

        <View style={styles.frameWrap}>
          <Animated.View style={[styles.frame, { width: frameSize, height: frameSize, borderColor: scanning ? frameBorderColor : 'transparent', borderWidth: scanning ? 2.5 : 0, shadowColor: Colors.primary, shadowOpacity: scanning ? 0.5 : 0, shadowRadius: 20, elevation: scanning ? 8 : 2 }]}>
            <View style={[StyleSheet.absoluteFill, styles.frameInner]} />

            {!scanned && (
              <View style={styles.qrCenter}>
                <AnimatedQR size={frameSize} scanning={scanning} />
              </View>
            )}

            <Animated.View style={[styles.laser, { width: frameSize - 28, opacity: laserOpacity, transform: [{ translateY: laserTranslate }] }]} />
            {scanning && <Animated.View style={[styles.laserGlow, { width: frameSize - 28, opacity: laserOpacity, transform: [{ translateY: laserTranslate }] }]} />}

            {scanned && (
              <Animated.View style={[styles.successOverlay, { transform: [{ scale: successScale }], opacity: successOpacity }]}>
                <Text style={styles.checkmark}>✅</Text>
                <Text style={styles.verifiedText}>Verified!</Text>
              </Animated.View>
            )}

            <Animated.View style={[StyleSheet.absoluteFill, { opacity: cornerOpacity, transform: [{ scale: cornerScale }] }]} pointerEvents="none">
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
            </Animated.View>
          </Animated.View>

          <View style={styles.statusRow}>
            {scanning && <><View style={styles.statusDot} /><Text style={styles.statusText}>Scanning...</Text></>}
            {!scanning && !scanned && <Text style={styles.statusIdle}>Align QR code within the frame</Text>}
            {scanned && <Text style={[styles.statusText, { color: Colors.success }]}>✓ QR Code detected</Text>}
          </View>
        </View>

        {scanned && (
          <Animated.View style={[styles.successBox, { transform: [{ scale: successScale }], opacity: successOpacity }]}>
            <Text style={styles.successTitle}>✅ SRV MCB 32A detected</Text>
            <Text style={styles.successSub}>You earned +80 reward points.</Text>
          </Animated.View>
        )}

        <TouchableOpacity onPress={scanned ? () => onNavigate('home') : startScan} disabled={scanning} style={[styles.primaryBtn, scanning && styles.primaryBtnDisabled]} activeOpacity={0.85}>
          <Text style={styles.primaryBtnText}>{scanned ? 'Claim Points & Continue' : scanning ? 'Scanning...' : 'Start Scanning'}</Text>
        </TouchableOpacity>

        <View style={styles.actionRow}>
          <Pressable style={styles.secondaryAction}><Text style={styles.actionIcon}>🔦</Text><Text style={styles.secondaryActionText}>Flashlight</Text></Pressable>
          <Pressable style={styles.secondaryAction}><Text style={styles.actionIcon}>🖼️</Text><Text style={styles.secondaryActionText}>Gallery</Text></Pressable>
        </View>

        <View style={styles.howCard}>
          <Text style={styles.howTitle}>How to Scan</Text>
          {[
            { step: '1', text: 'Look for the QR code sticker on your SRV product box.' },
            { step: '2', text: 'Place the code inside the frame and keep the phone steady.' },
            { step: '3', text: 'Claim the points and continue to your dashboard.' },
          ].map((item) => (
            <View key={item.step} style={styles.howRow}>
              <View style={styles.howIndex}><Text style={styles.howIndexText}>{item.step}</Text></View>
              <Text style={styles.howText}>{item.text}</Text>
            </View>
          ))}
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F2F3F7', alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 20, color: Colors.textDark, fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.textDark },
  scroll: { flex: 1 },
  content: { alignItems: 'center', padding: 20, gap: 16 },
  subtitle: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', lineHeight: 21 },
  frameWrap: { alignItems: 'center', gap: 14, marginTop: 4 },
  frame: { borderRadius: 24, backgroundColor: '#E8EAF4', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' },
  frameInner: { backgroundColor: '#ECEEF8', borderRadius: 24 },
  qrCenter: { alignItems: 'center', justifyContent: 'center' },
  laser: { position: 'absolute', top: 14, left: 14, height: 3, borderRadius: 3, backgroundColor: Colors.primary, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 8, elevation: 8 },
  laserGlow: { position: 'absolute', top: 14, left: 14, height: 14, borderRadius: 7, backgroundColor: Colors.primary, opacity: 0.15 },
  corner: { position: 'absolute', width: 28, height: 28 },
  cornerTL: { top: 14, left: 14, borderTopWidth: 4, borderLeftWidth: 4, borderColor: Colors.primary, borderTopLeftRadius: 8 },
  cornerTR: { top: 14, right: 14, borderTopWidth: 4, borderRightWidth: 4, borderColor: Colors.primary, borderTopRightRadius: 8 },
  cornerBL: { bottom: 14, left: 14, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: Colors.primary, borderBottomLeftRadius: 8 },
  cornerBR: { bottom: 14, right: 14, borderBottomWidth: 4, borderRightWidth: 4, borderColor: Colors.primary, borderBottomRightRadius: 8 },
  successOverlay: { position: 'absolute', alignItems: 'center', justifyContent: 'center', gap: 8, zIndex: 10 },
  checkmark: { fontSize: 52 },
  verifiedText: { fontSize: 18, fontWeight: '800', color: Colors.success },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 20 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  statusText: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  statusIdle: { fontSize: 13, color: Colors.textMuted },
  successBox: { width: '100%', padding: 16, borderRadius: 18, backgroundColor: '#E8FEF0', borderWidth: 1, borderColor: '#bbf7d0' },
  successTitle: { fontSize: 15, fontWeight: '800', color: Colors.success },
  successSub: { marginTop: 4, fontSize: 13, color: '#5E7A69' },
  primaryBtn: { width: '100%', backgroundColor: Colors.primary, borderRadius: 18, paddingVertical: 17, alignItems: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 6 },
  primaryBtnDisabled: { backgroundColor: '#C0C0CC', shadowOpacity: 0 },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  actionRow: { flexDirection: 'row', gap: 12, width: '100%' },
  secondaryAction: { flex: 1, minHeight: 52, borderRadius: 16, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  actionIcon: { fontSize: 18 },
  secondaryActionText: { color: Colors.textDark, fontSize: 13, fontWeight: '700' },
  howCard: { width: '100%', backgroundColor: Colors.surface, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: Colors.border },
  howTitle: { fontSize: 17, fontWeight: '800', color: Colors.textDark, marginBottom: 4 },
  howRow: { flexDirection: 'row', gap: 14, marginTop: 16, alignItems: 'flex-start' },
  howIndex: { width: 30, height: 30, borderRadius: 15, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  howIndexText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  howText: { flex: 1, fontSize: 13, lineHeight: 20, color: Colors.textMuted },
});