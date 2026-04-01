import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenTitle, SectionCard } from '../../components/Common';
import { rewards } from '../../data/mock';
import { colors } from '../../theme';

export function RewardsScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <SectionCard>
        <ScreenTitle title="Rewards Store" subtitle="Redeem your scanned points for cashback, vouchers, and SRV benefits." />
        <View style={styles.balanceBox}>
          <Text style={styles.balanceLabel}>Current balance</Text>
          <Text style={styles.balanceValue}>4,250 pts</Text>
        </View>
      </SectionCard>

      {rewards.map((reward) => (
        <SectionCard key={reward.id}>
          <View style={styles.rewardRow}>
            <View style={[styles.rewardIcon, { backgroundColor: `${reward.accent}15` }]}>
              <Text style={[styles.rewardIconText, { color: reward.accent }]}>RW</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rewardTitle}>{reward.name}</Text>
              <Text style={styles.rewardDescription}>{reward.description}</Text>
              <Text style={styles.rewardPoints}>{reward.points} pts</Text>
            </View>
            <View style={[styles.redeemButton, { backgroundColor: reward.accent }]}>
              <Text style={styles.redeemText}>Redeem</Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${reward.progress}%`, backgroundColor: reward.accent }]} />
          </View>
          <Text style={styles.progressText}>{reward.progress}% to unlock</Text>
        </SectionCard>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.appBackground },
  content: { padding: 18, gap: 16, paddingBottom: 120 },
  balanceBox: { marginTop: 14, borderRadius: 20, backgroundColor: '#FFF6EF', padding: 16 },
  balanceLabel: { fontSize: 12, color: colors.mutedText },
  balanceValue: { marginTop: 4, fontSize: 26, fontWeight: '900', color: colors.text },
  rewardRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  rewardIcon: { width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  rewardIconText: { fontSize: 13, fontWeight: '900' },
  rewardTitle: { fontSize: 15, fontWeight: '800', color: colors.text },
  rewardDescription: { marginTop: 4, fontSize: 12, color: colors.mutedText },
  rewardPoints: { marginTop: 8, fontSize: 12, fontWeight: '800', color: colors.text },
  redeemButton: { borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10 },
  redeemText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  progressTrack: { height: 8, marginTop: 16, borderRadius: 999, backgroundColor: '#F1E6DD', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 999 },
  progressText: { marginTop: 8, fontSize: 11, color: colors.mutedText },
});

