package com.scholearly.testzapp.sat.chemistry;

import com.phonegap.*;
import android.os.Bundle;

public class TestZappChemActivity extends DroidGap {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.init();
        super.loadUrl("file:///android_asset/www/index.html");
    }
}
