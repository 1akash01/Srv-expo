import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppIcon, C, PageHeader, usePreferenceContext } from './ProfileShared';

export function OffersPage({ onBack }: { onBack: () => void }) {
  const { t } = usePreferenceContext();
  const offers = [{ id: 'offer-1', title: '5% extra redemption value', sub: 'Valid for this week only' }, { id: 'offer-2', title: 'Double scan points', sub: 'Applicable on selected SRV products' }];
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <PageHeader title={t('offer')} onBack={onBack} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }} showsVerticalScrollIndicator={false}>
        {offers.map((offer) => (
          <TouchableOpacity key={offer.id} style={styles.card} onPress={() => Alert.alert('Offer applied', `${offer.title} is ready for you.`)} activeOpacity={0.8}>
            <View style={styles.iconWrap}><AppIcon name="offer" size={18} color={C.gold} /></View>
            <View style={{ flex: 1 }}><Text style={styles.title}>{offer.title}</Text><Text style={styles.sub}>{offer.sub}</Text></View>
            <Text style={styles.cta}>Claim</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: C.surface, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: C.border },
  iconWrap: { width: 44, height: 44, borderRadius: 14, backgroundColor: C.goldLight, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 14, fontWeight: '800', color: C.dark },
  sub: { fontSize: 12, color: C.muted, marginTop: 3 },
  cta: { fontSize: 12, fontWeight: '800', color: C.primary },
});
