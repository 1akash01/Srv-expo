import React from 'react';
import { Alert, Image, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppIcon, C, IconName, PageHeader, usePreferenceContext } from './ProfileShared';

const referImage = require('./assets/referfriend.png');

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
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Invite Friends</Text>
          <Image source={referImage} style={styles.heroImage} resizeMode="contain" />
          <Text style={styles.heroSub}>Copy Your Code, Share It With Your Friends.</Text>
        </View>
        <View style={styles.codeCard}>
          <View style={styles.codeRow}>
            <Text style={styles.codeValue}>{referCode}</Text>
            <TouchableOpacity style={styles.copyBtn} onPress={copyCode}><Text style={styles.copyText}>Copy</Text></TouchableOpacity>
          </View>
        </View>
        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.divider} />
        </View>
        <Text style={styles.sendTitle}>Send Invite With</Text>
        <View style={styles.shareRow}>
          {[['link', 'Share', shareCode], ['message', 'Message', shareCode], ['whatsapp', 'WhatsApp', shareCode]].map(([icon, label, fn]) => (
            <TouchableOpacity key={label as string} style={styles.shareBtn} onPress={fn as () => void} activeOpacity={0.8}>
              <AppIcon name={icon as IconName} size={24} color={label === 'WhatsApp' ? '#16A34A' : C.primary} />
            </TouchableOpacity>
          ))}
        </View>
        <View>
          <Text style={styles.howTitle}>How It Works?</Text>
          <Text style={styles.howText}>1. Invite Your Friends</Text>
          <Text style={styles.howText}>2. They Hit The Road With 20% off</Text>
          <Text style={styles.howText}>3. You Make Saving!</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  heroCard: { backgroundColor: C.surface, borderRadius: 22, padding: 20, alignItems: 'center', gap: 10 },
  heroTitle: { fontSize: 18, fontWeight: '900', color: C.primary },
  heroImage: { width: '100%', height: 180, maxWidth: 260 },
  heroSub: { fontSize: 14, color: C.muted, textAlign: 'center', lineHeight: 20 },
  codeCard: { backgroundColor: C.surface, borderRadius: 22, padding: 8, borderWidth: 1, borderColor: C.border },
  codeRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: C.primary, borderRadius: 22, paddingLeft: 16, paddingRight: 6, paddingVertical: 6 },
  codeValue: { flex: 1, fontSize: 24, fontWeight: '900', color: C.dark, letterSpacing: 2 },
  copyBtn: { backgroundColor: C.primary, borderRadius: 18, paddingHorizontal: 24, height: 38, alignItems: 'center', justifyContent: 'center' },
  copyText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  divider: { flex: 1, height: 1, backgroundColor: C.border },
  dividerText: { fontSize: 13, fontWeight: '700', color: C.muted },
  sendTitle: { textAlign: 'center', fontSize: 18, fontWeight: '800', color: C.primary },
  shareRow: { flexDirection: 'row', gap: 16, justifyContent: 'center' },
  shareBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center' },
  howTitle: { fontSize: 18, fontWeight: '900', color: C.dark, marginBottom: 8 },
  howText: { fontSize: 14, fontWeight: '700', color: C.dark, lineHeight: 24 },
});
