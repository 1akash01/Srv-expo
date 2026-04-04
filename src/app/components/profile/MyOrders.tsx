import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppIcon, C, PageHeader, usePreferenceContext } from './ProfileShared';

export function MyOrdersPage({ onBack }: { onBack: () => void }) {
  const { t } = usePreferenceContext();
  const orders = [{ id: 'ORD-1001', product: 'Fan Box 3"', status: 'Packed' }, { id: 'ORD-1002', product: 'MCB Box 8-Way', status: 'Shipped' }];
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <PageHeader title={t('myOrders')} onBack={onBack} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }} showsVerticalScrollIndicator={false}>
        {orders.map((order) => (
          <TouchableOpacity key={order.id} style={styles.card} onPress={() => Alert.alert('Order status', `${order.id}: ${order.status}`)} activeOpacity={0.8}>
            <View style={styles.iconWrap}><AppIcon name="order" size={18} color={C.purple} /></View>
            <View style={{ flex: 1 }}><Text style={styles.title}>{order.id}</Text><Text style={styles.sub}>{order.product}</Text></View>
            <Text style={styles.cta}>{order.status}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: C.surface, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: C.border },
  iconWrap: { width: 44, height: 44, borderRadius: 14, backgroundColor: C.purpleLight, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 14, fontWeight: '800', color: C.dark },
  sub: { fontSize: 12, color: C.muted, marginTop: 3 },
  cta: { fontSize: 12, fontWeight: '800', color: C.primary },
});
