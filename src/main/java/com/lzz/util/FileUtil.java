package com.lzz.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by lzz on 2018/2/20.
 */
public class FileUtil {
    public static List<String> getDirFiles(String filePath){
        List<String> fileNames = new ArrayList<>();
        File root = new File(filePath);
        File[] files = root.listFiles();
        for(File file:files){
            if( !file.isDirectory() ) {
                fileNames.add( file.getName() );
            }
        }
        return fileNames;
    }

    public static void copyFile(File fromFile,File toFile) throws IOException {
        FileInputStream ins = new FileInputStream(fromFile);
        FileOutputStream out = new FileOutputStream(toFile);
        byte[] b = new byte[1024];
        int n=0;
        while((n=ins.read(b))!=-1){
            out.write(b, 0, n);
        }

        ins.close();
        out.close();
    }

}
