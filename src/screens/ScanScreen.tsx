import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton, ScreenTitle, SectionCard } from '../components/Common';
import { colors } from '../theme';
import type { Screen } from '../types';

export function ScanScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);

  const startScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
    }, 1400);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <SectionCard>
        <ScreenTitle title="Scan QR Code" subtitle="Point the camera at the QR label on any SRV product box." />
        <View style={styles.frameWrap}>
          <View style={styles.frame}>
            <View style={styles.bracketTopLeft} />
            <View style={styles.bracketTopRight} />
            <View style={styles.bracketBottomLeft} />
            <View style={styles.bracketBottomRight} />
            <Text style={styles.frameMark}>{scanning ? 'Scanning...' : scanned ? 'Verified' : 'Align QR here'}</Text>
          </View>
        </View>

        {scanned ? (
          <View style={styles.successBox}>
            <Text style={styles.successTitle}>SRV MCB 32A detected</Text>
            <Text style={styles.successText}>You earned +80 reward points.</Text>
          </View>
        ) : null}

        <PrimaryButton
          label={scanned ? 'Claim Points & Continue' : scanning ? 'Scanning...' : 'Start Scanning'}
          onPress={scanned ? () => onNavigate('home') : startScan}
          disabled={scanning}
        />

        <View style={styles.actionRow}>
          <Pressable style={styles.secondaryAction}>
            <Text style={styles.secondaryActionText}>Flashlight</Text>
          </Pressable>
          <Pressable style={styles.secondaryAction}>
            <Text style={styles.secondaryActionText}>Gallery</Text>
          </Pressable>
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={styles.howTitle}>How to scan</Text>
        {[
          'Look for the QR code sticker on your SRV product box.',
          'Place the code inside the frame and keep the phone steady.',
          'Claim the points and continue to your dashboard.',
        ].map((item, index) => (
          <View key={item} style={styles.howRow}>
            <View style={styles.howIndex}>
              <Text style={styles.howIndexText}>{index + 1}</Text>
            </View>
            <Text style={styles.howText}>{item}</Text>
          </View>
        ))}
      </SectionCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.appBackground },
  content: { padding: 18, gap: 16, paddingBottom: 120 },
  frameWrap: { alignItems: 'center', marginTop: 18, marginBottom: 18 },
  frame: { width: 248, height: 248, borderRadius: 28, backgroundColor: '#F4EDE6', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  bracketTopLeft: { position: 'absolute', top: 0, left: 0, width: 32, height: 32, borderLeftWidth: 4, borderTopWidth: 4, borderColor: colors.primary, borderTopLeftRadius: 20 },
  bracketTopRight: { position: 'absolute', top: 0, right: 0, width: 32, height: 32, borderRightWidth: 4, borderTopWidth: 4, borderColor: colors.primary, borderTopRightRadius: 20 },
  bracketBottomLeft: { position: 'absolute', bottom: 0, left: 0, width: 32, height: 32, borderLeftWidth: 4, borderBottomWidth: 4, borderColor: colors.primary, borderBottomLeftRadius: 20 },
  bracketBottomRight: { position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRightWidth: 4, borderBottomWidth: 4, borderColor: colors.primary, borderBottomRightRadius: 20 },
  frameMark: { color: '#927E72', fontSize: 16, fontWeight: '800' },
  successBox: { marginBottom: 16, padding: 14, borderRadius: 18, backgroundColor: '#EAF8F0' },
  successTitle: { fontSize: 14, fontWeight: '800', color: colors.success },
  successText: { marginTop: 4, fontSize: 12, color: '#5E7A69' },
  actionRow: { marginTop: 12, flexDirection: 'row', gap: 12 },
  secondaryAction: { flex: 1, minHeight: 48, borderRadius: 16, backgroundColor: '#F7EFE8', alignItems: 'center', justifyContent: 'center' },
  secondaryActionText: { color: colors.text, fontSize: 13, fontWeight: '700' },
  howTitle: { fontSize: 17, fontWeight: '800', color: colors.text },
  howRow: { flexDirection: 'row', gap: 12, marginTop: 14, alignItems: 'flex-start' },
  howIndex: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  howIndexText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  howText: { flex: 1, fontSize: 13, lineHeight: 18, color: colors.mutedText },
});
