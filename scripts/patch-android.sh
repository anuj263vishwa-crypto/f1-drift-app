#!/bin/bash
set -e
A=android/app/src/main
VER=${VER:-1}
sed -i "s/versionCode [0-9]*/versionCode $VER/; s/versionName \"[^\"]*\"/versionName \"1.$VER\"/" android/app/build.gradle
# landscape + fullscreen + keep hardware accel
sed -i 's|<activity|<activity android:screenOrientation="sensorLandscape" android:hardwareAccelerated="true"|' $A/AndroidManifest.xml
sed -i 's|android:largeHeap="[a-z]*"||; s|<application|<application android:largeHeap="true"|' $A/AndroidManifest.xml
# immersive fullscreen + keep screen on + audio without gesture
cat > $A/java/com/f1drift/game/MainActivity.java <<'JAVA'
package com.f1drift.game;

import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.webkit.WebSettings;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    try { getBridge().getWebView().getSettings().setMediaPlaybackRequiresUserGesture(false); } catch (Exception e) {}
    hideBars();
  }
  @Override
  public void onWindowFocusChanged(boolean hasFocus) {
    super.onWindowFocusChanged(hasFocus);
    if (hasFocus) hideBars();
  }
  private void hideBars() {
    WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
    WindowInsetsControllerCompat c = new WindowInsetsControllerCompat(getWindow(), getWindow().getDecorView());
    c.hide(androidx.core.view.WindowInsetsCompat.Type.systemBars());
    c.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
  }
}
JAVA
