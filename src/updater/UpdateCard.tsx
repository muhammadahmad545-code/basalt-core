import { ArrowDownToLine, CheckCircle2, CircleAlert, Sparkles } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Text } from '../ui/Text';
import { formatBytes } from '../utils/format';
import type { Updater } from './useUpdater';

/** Renders nothing unless there is something to tell the user about an update. */
export function UpdateCard({ updater }: { updater: Updater }) {
  const { colors, spacing } = useTheme();
  const { state } = updater;
  if (state.phase === 'idle' || state.phase === 'checking') return null;

  const header = (Icon: typeof Sparkles, tone: string, title: string) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
      <Icon size={18} color={tone} />
      <Text variant="bodyStrong">{title}</Text>
    </View>
  );

  if (state.phase === 'up-to-date') {
    return (
      <Card style={{ gap: spacing.sm }}>
        {header(CheckCircle2, colors.success, `You're on the latest version (${updater.currentVersion})`)}
      </Card>
    );
  }

  if (state.phase === 'error') {
    return (
      <Card style={{ gap: spacing.md }}>
        {header(CircleAlert, colors.danger, 'Update problem')}
        <Text color="textMuted">{state.message}</Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          {state.update ? <Button label="Retry" onPress={updater.download} style={{ flex: 1 }} /> : null}
          <Button label="Dismiss" variant="secondary" onPress={updater.dismiss} style={{ flex: 1 }} />
        </View>
      </Card>
    );
  }

  const { update } = state;
  return (
    <Card style={{ gap: spacing.md, borderColor: colors.accent }}>
      {header(Sparkles, colors.accent, `Version ${update.version} is available`)}
      <Text variant="caption" color="textMuted">
        You have {updater.currentVersion} · {formatBytes(update.sizeBytes)}
      </Text>
      {update.notes ? (
        <Text color="textMuted" numberOfLines={6}>
          {update.notes}
        </Text>
      ) : null}
      {state.phase === 'downloading' ? (
        <View style={{ gap: spacing.sm }}>
          <ProgressBar progress={state.progress} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text variant="caption" color="textMuted">
              Downloading… {Math.round(state.progress * 100)}%
            </Text>
            <Button label="Cancel" variant="ghost" onPress={updater.cancel} />
          </View>
        </View>
      ) : state.phase === 'ready' ? (
        <Button label="Install update" icon={ArrowDownToLine} onPress={updater.install} />
      ) : (
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <Button label="Update" icon={ArrowDownToLine} onPress={updater.download} style={{ flex: 1 }} />
          <Button label="Skip" variant="secondary" onPress={updater.skip} style={{ flex: 1 }} />
        </View>
      )}
    </Card>
  );
}
