package com.issschool;

import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Arrays;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.react.ReactPackage;
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;
import android.os.Bundle;
import com.brentvatne.react.ReactVideoPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage; 
import com.imagepicker.ImagePickerPackage;

public class MainActivity extends ReactActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
                
     try {
         PackageInfo info = getPackageManager().getPackageInfo("com.issschool", PackageManager.GET_SIGNATURES);
         for (Signature signature : info.signatures) {
             MessageDigest md = MessageDigest.getInstance("SHA");
             md.update(signature.toByteArray());
             }
          } catch (PackageManager.NameNotFoundException e) {
                  
          } catch (NoSuchAlgorithmException e) {
                  
          }

    SplashScreen.show(this, R.style.SplashTheme);
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
              new ReactVideoPackage(),
              new ImagePickerPackage(),
              new RNGoogleSigninPackage() 
      );
  }
}
