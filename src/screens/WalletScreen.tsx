import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenTitle, SectionCard } from '../components/Common';
import { colors } from '../theme';

export function WalletScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <SectionCard>
        <ScreenTitle title="Wallet History" subtitle="Track redemption, transfers, and your current balance." />
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Redeem Product</Text>
            <Text style={styles.summaryValue}>0</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Lifetime Redeem</Text>
            <Text style={styles.summaryValue}>0</Text>
          </View>
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={styles.balanceTitle}>0 Points</Text>
        <Text style={styles.balanceSub}>Redeemable points</Text>
        <View style={styles.actionGrid}>
          {['Buy Schemes', 'Bank Transfer', 'Transfer Point'].map((item) => (
            <View key={item} style={styles.actionTile}>
              <Text style={styles.actionTileGlyph}>SRV</Text>
              <Text style={styles.actionTileText}>{item}</Text>
            </View>
          ))}
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={styles.sectionTitle}>Redeem Point History</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No data</Text>
          <Text style={styles.emptySub}>No redemption history found for the selected period.</Text>
        </View>
      </SectionCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.appBackground },
  content: { padding: 18, gap: 16, paddingBottom: 120 },
  summaryRow: { marginTop: 14, flexDirection: 'row', gap: 12 },
  summaryCard: { flex: 1, borderRadius: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: '#FFF7F1', padding: 16 },
  summaryLabel: { fontSize: 12, color: colors.mutedText },
  summaryValue: { marginTop: 8, fontSize: 28, fontWeight: '900', color: colors.text },
  balanceTitle: { fontSize: 28, fontWeight: '900', color: colors.text },
  balanceSub: { marginTop: 4, fontSize: 13, color: colors.primary, fontWeight: '700' },
  actionGrid: { marginTop: 18, flexDirection: 'row', gap: 12 },
  actionTile: { flex: 1, borderRadius: 18, backgroundColor: '#F7EFE8', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 8, gap: 10 },
  actionTileGlyph: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#FFFFFF', textAlign: 'center', textAlignVertical: 'center', paddingTop: 11, overflow: 'hidden', color: colors.primary, fontWeight: '800', fontSize: 11 },
  actionTileText: { textAlign: 'center', fontSize: 12, color: colors.text, fontWeight: '700' },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: colors.text },
  emptyState: { marginTop: 16, borderRadius: 22, backgroundColor: '#FFF7F1', paddingVertical: 28, paddingHorizontal: 18, alignItems: 'center' },
  emptyTitle: { fontSize: 20, fontWeight: '900', color: colors.primary },
  emptySub: { marginTop: 8, fontSize: 13, textAlign: 'center', color: colors.mutedText, lineHeight: 18 },
});
