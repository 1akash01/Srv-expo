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
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 6 },
  iconWrap: { width: 56, height: 56, borderRadius: 18, backgroundColor: C.goldLight, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '800', color: C.dark },
  sub: { fontSize: 13, color: C.muted, marginTop: 2 },
  label: { fontSize: 12, fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', height: 52, backgroundColor: C.bg, borderRadius: 14, borderWidth: 1.5, borderColor: C.border, paddingHorizontal: 14, gap: 8 },
  input: { flex: 1, fontSize: 15, fontWeight: '600' },
});
