import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function ChatScreen() {
  const webviewRef = useRef<WebView>(null);

  useEffect(() => {
    if (webviewRef.current) {
      webviewRef.current.injectJavaScript(`
        window.location.reload();
        true;
      `);
    }
  }, []);

  return (
    <WebView
      ref={webviewRef}
      style={styles.container}
      source={{ uri: 'https://static.zdassets.com/web_widget/latest/liveChat.html?v=10#key=fptuniversity7761.zendesk.com' }}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
