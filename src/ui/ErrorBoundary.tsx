import React from 'react';
import { ScrollView, Text, View } from 'react-native';

interface State {
  error: Error | null;
}

/**
 * Last line of defence: renders a readable recovery screen instead of a blank app.
 * Deliberately uses no theme or custom components so it still works if those are what failed.
 */
export class ErrorBoundary extends React.Component<{ children: React.ReactNode; onError?: (error: Error) => void }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    return (
      <View style={{ flex: 1, backgroundColor: '#0B0D10', padding: 24, paddingTop: 80, gap: 12 }}>
        <Text style={{ color: '#F2F4F7', fontSize: 22, fontWeight: '700' }}>Something broke</Text>
        <Text style={{ color: '#A3ABB8', fontSize: 15, lineHeight: 22 }}>
          The app hit an unexpected error. Your data is safe. Try again, and if it keeps happening, reopen the app.
        </Text>
        <ScrollView style={{ maxHeight: 160, backgroundColor: '#13161B', borderRadius: 12, padding: 12 }}>
          <Text selectable style={{ color: '#FF6B6B', fontFamily: 'monospace', fontSize: 12 }}>
            {error.message}
          </Text>
        </ScrollView>
        <Text
          accessibilityRole="button"
          onPress={() => this.setState({ error: null })}
          style={{ color: '#06110F', backgroundColor: '#F2F4F7', textAlign: 'center', paddingVertical: 14, borderRadius: 16, fontSize: 15, fontWeight: '600', overflow: 'hidden' }}
        >
          Try again
        </Text>
      </View>
    );
  }
}
