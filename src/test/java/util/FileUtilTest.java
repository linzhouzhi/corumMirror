package util;

import com.lzz.util.FileUtil;
import org.junit.Test;

import java.io.File;
import java.util.List;

/**
 * Created by lzz on 2018/2/20.
 */
public class FileUtilTest {
    @Test
    public void test001(){
        List res = FileUtil.getDirFiles("db/");
        System.out.println( res );
    }

    @Test
    public void deleteFile(){
        File f = new File( "db/flow-ha.xml");
        f.delete();
    }
}
