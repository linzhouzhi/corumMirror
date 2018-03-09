package com.lzz.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

/**
 * Created by lzz on 2018/2/7.
 */
public class PropertiesUtil {
    public static Map<String, String> propertiesMap = new HashMap<>();
    private static int UPDATE_TIME = 60000;
    private static String DEFAULT_CONFIG_FILE = "application.properties";
    static {
        loadProperties(true);
        Thread thread = new ScheduleLoadTask();
        thread.setName("schedule-load-config");
        thread.setDaemon(true);
        thread.start();
    }

    public static String get(String field){
        return propertiesMap.get( field );
    }

    private static void loadProperties(boolean isInit){
        Properties props = new Properties();
        try {
            String filePath = getFilePath();
            File file = new File(filePath);
            long modifyTime = file.lastModified();
            long currentTime = System.currentTimeMillis();
            if( !isInit && currentTime - modifyTime > UPDATE_TIME ){
                return;
            }
            InputStream in = new FileInputStream( file );
            props.load(in);
            in.close();
            Enumeration en = props.propertyNames();
            while (en.hasMoreElements())
            {
                String key = (String) en.nextElement();
                String value = props.getProperty(key);
                propertiesMap.put( key, value );
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally {
            props.clear();
        }
    }

    private static String getFilePath() {
        String filePath = Thread.currentThread().getContextClassLoader().getResource("").toString();
        String file = filePath.substring(5, filePath.length()) + DEFAULT_CONFIG_FILE;
        return file;
    }

    static class ScheduleLoadTask extends Thread{
        @Override
        public void run() {
            while (true){
                loadProperties(false);
                try {
                    Thread.sleep(UPDATE_TIME/2);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }
    }

}
