import { LinearGradient } from 'expo-linear-gradient';
import { useState, type PropsWithChildren, type ReactNode } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../theme';

export function SectionCard({ children, style }: PropsWithChildren<{ style?: object }>) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function ScreenTitle({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <View style={styles.headerRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

export function StatPill({ label, value, accent = colors.primary }: { label: string; value: string; accent?: string }) {
  return (
    <View style={[styles.statPill, { borderColor: `${accent}30` }]}>
      <Text style={[styles.statValue, { color: accent }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  secureTextEntry,
  right,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'numeric' | 'phone-pad' | 'email-address';
  secureTextEntry?: boolean;
  right?: ReactNode;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.inputShell, focused && styles.inputShellFocused]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#A8978D"
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={styles.input}
        />
        {right}
      </View>
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <View style={[styles.button, styles.buttonDisabled]}>
        <Text style={styles.buttonDisabledText}>{label}</Text>
      </View>
    );
  }

  return (
    <Pressable onPress={onPress}>
      <LinearGradient colors={['#B8261D', '#DE3B30', '#F08A49']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.button}>
        <Text style={styles.buttonText}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

export function LogoMark({ size = 146 }: { size?: number }) {
  return (
    <View style={styles.logoStack}>
      <View style={styles.logoShadow} />
      <View style={styles.platformBack} />
      <View style={styles.platformFront} />
      <View style={styles.logoPlate}>
        <Image source={require('../../assets/srv-logo.png')} style={{ width: size, height: size * 0.34 }} resizeMode="contain" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    shadowColor: '#704430',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: colors.mutedText,
  },
  statPill: {
    minWidth: 84,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1,
    backgroundColor: '#FFF9F4',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    marginTop: 2,
    fontSize: 11,
    color: colors.mutedText,
  },
  fieldWrap: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    fontWeight: '800',
    color: '#8F5B47',
  },
  inputShell: {
    minHeight: 56,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#EDD8CB',
    backgroundColor: '#FFFDFC',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputShellFocused: {
    borderColor: '#4F6DAF',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  button: {
    minHeight: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  buttonDisabled: {
    backgroundColor: '#E8DDD3',
  },
  buttonDisabledText: {
    color: '#A89386',
    fontSize: 15,
    fontWeight: '800',
  },
  logoStack: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    marginTop: 18,
  },
  logoShadow: {
    position: 'absolute',
    bottom: 8,
    width: 170,
    height: 24,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.24)',
  },
  platformBack: {
    position: 'absolute',
    bottom: 28,
    width: 164,
    height: 76,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    transform: [{ rotate: '11deg' }],
  },
  platformFront: {
    position: 'absolute',
    bottom: 32,
    width: 164,
    height: 76,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    transform: [{ rotate: '-11deg' }],
  },
  logoPlate: {
    borderRadius: 28,
    paddingHorizontal: 12,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000000',
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
});
