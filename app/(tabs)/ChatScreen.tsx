import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function ChatScreen() {
  return (
    <View style={styles.container}>
      <WebView
        source={{
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  iframe {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border: none;
                  }
                </style>
              </head>
              <body>
                <iframe src="https://embed.tawk.to/67375a762480f5b4f59e9eb3/1ico3inpr"></iframe>
              </body>
            </html>
          `,
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        originWhitelist={['*']}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
});
