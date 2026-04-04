import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { AppIcon, C, PageHeader, PrimaryBtn, usePreferenceContext } from './ProfileShared';

export function BankDetailsPage({ onBack }: { onBack: () => void }) {
  const { t, theme } = usePreferenceContext();
  const [upi, setUpi] = useState('');
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <PageHeader title={t('bankDetails')} onBack={onBack} />
      <View style={{ flex: 1, padding: 16, gap: 16 }}>
        <View style={styles.card}>
          <View style={styles.assetPoster}>
            <View style={styles.posterGlow} />
            <View style={styles.posterTopRow}>
              <View style={styles.posterBadge}>
                <AppIcon name="bank" size={22} color={C.gold} />
              </View>
              <View>
                <Text style={styles.posterEyebrow}>BANK TRANSFER</Text>
                <Text style={styles.posterHeading}>Secure payouts to your bank</Text>
              </View>
            </View>
            <View style={styles.posterBankWrap}>
              <View style={styles.posterBankRoof} />
              <View style={styles.posterColumnsRow}>
                <View style={styles.posterColumn} />
                <View style={styles.posterColumn} />
                <View style={styles.posterColumn} />
              </View>
              <View style={styles.posterBankBase} />
            </View>
          </View>
          <View style={styles.headerRow}>
            <View style={styles.iconWrap}><AppIcon name="bank" size={24} color={C.gold} /></View>
            <View><Text style={styles.title}>UPI / Bank Transfer</Text><Text style={styles.sub}>Add your UPI ID for instant payouts</Text></View>
          </View>
          <Text style={styles.label}>UPI ID</Text>
          <View style={styles.inputWrap}>
            <AppIcon name="bank" size={18} color={C.gold} />
            <TextInput style={[styles.input, { color: theme.textPrimary }]} placeholder="e.g. yourname@upi" placeholderTextColor={theme.textMuted} value={upi} onChangeText={setUpi} autoCapitalize="none" />
          </View>
        </View>
        <PrimaryBtn label={t('save')} onPress={() => Alert.alert('Saved', 'Bank details saved successfully!')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: C.surface, borderRadius: 22, padding: 20, borderWidth: 1, borderColor: C.border, gap: 14 },
  assetPoster: { width: '100%', height: 120, borderRadius: 22, backgroundColor: '#FFF7E8', overflow: 'hidden', paddingHorizontal: 18, paddingVertical: 14, justifyContent: 'space-between', borderWidth: 1, borderColor: '#F4DFC0' },
  posterGlow: { position: 'absolute', right: -18, top: -18, width: 96, height: 96, borderRadius: 48, backgroundColor: '#FFE5AB' },
  posterTopRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  posterBadge: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#FFF1CC', alignItems: 'center', justifyContent: 'center' },
  posterEyebrow: { fontSize: 11, fontWeight: '800', color: '#B07A12', letterSpacing: 1 },
  posterHeading: { fontSize: 18, fontWeight: '900', color: '#6A4800', maxWidth: 170, lineHeight: 22 },
  posterBankWrap: { alignSelf: 'flex-end', alignItems: 'center', justifyContent: 'flex-end' },
  posterBankRoof: { width: 86, height: 0, borderLeftWidth: 43, borderRightWidth: 43, borderBottomWidth: 24, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#D89A1A' },
  posterColumnsRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, backgroundColor: '#FFE8B8', paddingHorizontal: 10, paddingTop: 8 },
  posterColumn: { width: 12, height: 28, borderRadius: 4, backgroundColor: '#C88807' },
  posterBankBase: { width: 106, height: 10, borderRadius: 4, backgroundColor: '#B87900' },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 6 },
  iconWrap: { width: 56, height: 56, borderRadius: 18, backgroundColor: C.goldLight, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '800', color: C.dark },
  sub: { fontSize: 13, color: C.muted, marginTop: 2 },
  label: { fontSize: 12, fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', height: 52, backgroundColor: C.bg, borderRadius: 14, borderWidth: 1.5, borderColor: C.border, paddingHorizontal: 14, gap: 8 },
  input: { flex: 1, fontSize: 15, fontWeight: '600' },
});
