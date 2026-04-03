import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppIcon, C, PageHeader, usePreferenceContext } from './ProfileShared';

export function ScanHistoryPage({ onBack }: { onBack: () => void }) {
  const { t } = usePreferenceContext();
  const scanHistory = [{ product: 'Fan Box 3"', points: '+10', time: 'Today, 10:23 AM', code: 'SRV-001' }, { product: 'Junction Box', points: '+15', time: 'Yesterday, 3:45 PM', code: 'SRV-002' }];
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <PageHeader title={t('scanHistory')} onBack={onBack} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }} showsVerticalScrollIndicator={false}>
        <View style={styles.totalCard}><View><Text style={styles.totalLabel}>Total Scans</Text><Text style={styles.totalValue}>24</Text></View><View style={styles.totalDivider} /><View><Text style={styles.totalLabel}>Points Earned</Text><Text style={[styles.totalValue, { color: C.gold }]}>4,250</Text></View></View>
        {scanHistory.map((item, i) => (
          <View key={i} style={styles.card}>
            <View style={styles.iconWrap}><AppIcon name="scan" size={22} color={C.primary} /></View>
            <View style={{ flex: 1 }}><Text style={styles.title}>{item.product}</Text><Text style={styles.sub}>{`Code: ${item.code} · ${item.time}`}</Text></View>
            <Text style={styles.cta}>{item.points}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  totalCard: { backgroundColor: C.navy, borderRadius: 22, padding: 22, flexDirection: 'row', alignItems: 'center', gap: 20 },
  totalLabel: { fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: '600' },
  totalValue: { fontSize: 28, fontWeight: '900', color: '#fff' },
  totalDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.15)' },
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: C.surface, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: C.border },
  iconWrap: { width: 44, height: 44, borderRadius: 14, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 14, fontWeight: '800', color: C.dark },
  sub: { fontSize: 12, color: C.muted, marginTop: 3 },
  cta: { fontSize: 12, fontWeight: '800', color: C.primary },
});
