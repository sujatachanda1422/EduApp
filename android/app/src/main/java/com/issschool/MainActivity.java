package com.issschool;

import java.util.List;
import java.util.Arrays;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.react.ReactPackage;
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;
import android.os.Bundle;
import com.brentvatne.react.ReactVideoPackage;

public class MainActivity extends ReactActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this, R.style.SplashTheme);
      super.onCreate(savedInstanceState);
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Issschool";
  }

  protected List<ReactPackage> getPackages() {
      return Arrays.asList(
              new MainReactPackage(),
              new ReactVideoPackage()
      );
  }
}
