import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppIcon, C, EmptyState, PageHeader, usePreferenceContext } from './ProfileShared';

export function RedemptionPage({ onBack }: { onBack: () => void }) {
  const { t, theme } = usePreferenceContext();
  const [activeTab, setActiveTab] = useState<'Buy Schemes' | 'Bank Transfer' | 'Transfer Point'>('Buy Schemes');
  const tabs: Array<'Buy Schemes' | 'Bank Transfer' | 'Transfer Point'> = ['Buy Schemes', 'Bank Transfer', 'Transfer Point'];

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <PageHeader title={t('redemptionHistory')} onBack={onBack} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {[{ label: 'Redeem Product', value: '0' }, { label: 'Lifetime Redeem', value: '0' }].map((s) => (
            <View key={s.label} style={styles.statBox}>
              <Text style={styles.statLabel}>{s.label}</Text>
              <Text style={styles.statValue}>{s.value}</Text>
            </View>
          ))}
        </View>
        <View style={styles.pointsCard}>
          <Text style={styles.pointsVal}>0 {t('points')}</Text>
          <Text style={styles.pointsSub}>Redeemable Points</Text>
          <View style={styles.tabRow}>
            {tabs.map((tab) => (
              <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)} activeOpacity={0.8}>
                <AppIcon name={tab === 'Buy Schemes' ? 'gift' : tab === 'Bank Transfer' ? 'bank' : 'transfer'} size={22} color={activeTab === tab ? C.primary : C.mid} />
                <Text style={[styles.tabText, activeTab === tab && { color: C.primary }]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <Text style={styles.sectionTitle}>{t('redemptionHistory')}</Text>
        <EmptyState emoji="📋" message="No redemption history yet" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  statBox: { flex: 1, backgroundColor: C.surface, borderRadius: 18, padding: 16, borderWidth: 1.5, borderColor: C.primary },
  statLabel: { fontSize: 13, fontWeight: '800', color: C.primary, marginBottom: 6 },
  statValue: { fontSize: 22, fontWeight: '900', color: C.dark },
  pointsCard: { backgroundColor: C.surface, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: C.border },
  pointsVal: { fontSize: 22, fontWeight: '900', color: C.dark },
  pointsSub: { fontSize: 14, fontWeight: '700', marginBottom: 16, marginTop: 2, color: C.primary },
  tabRow: { flexDirection: 'row', gap: 10 },
  tab: { flex: 1, backgroundColor: '#F3F4F8', borderRadius: 16, padding: 12, alignItems: 'center', gap: 6, borderWidth: 1.5, borderColor: 'transparent' },
  tabActive: { backgroundColor: C.primaryLight, borderColor: C.primary },
  tabText: { fontSize: 11, fontWeight: '700', color: C.mid, textAlign: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: C.dark },
});
