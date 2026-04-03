import React from 'react';
import { Alert, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppIcon, C, IconName, PageHeader, usePreferenceContext } from './ProfileShared';

export function ReferFriendPage({ onBack }: { onBack: () => void }) {
  const { t } = usePreferenceContext();
  const referCode = '330276';
  const copyCode = async () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(referCode);
      return Alert.alert('Copied!', 'Referral code copied to clipboard.');
    }
    await Share.share({ message: `SRV referral code: ${referCode}` });
  };
  const shareCode = async () => { await Share.share({ message: `Join SRV Electricals and use my referral code: ${referCode}` }); };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <PageHeader title={t('referFriend')} onBack={onBack} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}><AppIcon name="refer" size={46} color="#fff" /><Text style={styles.heroTitle}>Invite Friends</Text><Text style={styles.heroSub}>Copy Your Code, Share It With Your Friends.</Text></View>
        <View style={styles.codeCard}><Text style={styles.codeLabel}>Your Referral Code</Text><View style={styles.codeRow}><Text style={styles.codeValue}>{referCode}</Text><TouchableOpacity style={styles.copyBtn} onPress={copyCode}><Text style={styles.copyText}>Copy</Text></TouchableOpacity></View></View>
        <View style={styles.shareRow}>
          {[['link', 'Share', shareCode], ['message', 'Message', shareCode], ['whatsapp', 'WhatsApp', shareCode]].map(([icon, label, fn]) => (
            <TouchableOpacity key={label as string} style={styles.shareBtn} onPress={fn as () => void} activeOpacity={0.8}>
              <AppIcon name={icon as IconName} size={26} color={label === 'WhatsApp' ? '#16A34A' : C.primary} />
              <Text style={styles.shareBtnText}>{label as string}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  heroCard: { backgroundColor: C.navy, borderRadius: 28, padding: 36, alignItems: 'center', gap: 10 },
  heroTitle: { fontSize: 26, fontWeight: '900', color: '#fff' },
  heroSub: { fontSize: 14, color: 'rgba(255,255,255,0.65)', textAlign: 'center', lineHeight: 20 },
  codeCard: { backgroundColor: C.surface, borderRadius: 22, padding: 20, borderWidth: 1, borderColor: C.border, gap: 10 },
  codeLabel: { fontSize: 13, fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5 },
  codeRow: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1.5, borderColor: C.primary, borderRadius: 16, padding: 4, paddingLeft: 16 },
  codeValue: { flex: 1, fontSize: 24, fontWeight: '900', color: C.dark, letterSpacing: 3 },
  copyBtn: { backgroundColor: C.primary, borderRadius: 13, paddingHorizontal: 22, height: 46, alignItems: 'center', justifyContent: 'center' },
  copyText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  shareRow: { flexDirection: 'row', gap: 16, justifyContent: 'center' },
  shareBtn: { width: 80, height: 80, borderRadius: 20, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center', gap: 6 },
  shareBtnText: { fontSize: 11, fontWeight: '700', color: C.primary },
});
