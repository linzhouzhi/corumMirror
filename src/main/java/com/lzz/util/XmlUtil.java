package com.lzz.util;

import com.lzz.model.Common;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.OutputFormat;
import org.dom4j.io.SAXReader;
import org.dom4j.io.XMLWriter;

import java.io.File;
import java.io.PrintWriter;
import java.io.Writer;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Created by lzz on 2018/2/7.
 */
public class XmlUtil {
    private static String BASE_PATH = Common.XML_DB_PATH;
    private static String TEMPLATE_FILE = "template.xml";
    private static final String UNDEFINED_NAME = "undefined";
    private static Map<String, Map<String, String>> mxlMap = new HashMap();
    private String fileName;

    public XmlUtil(String fileName) {
        if( fileName.equals(UNDEFINED_NAME)){
            return ;
        }
        synchronized (this){
            this.fileName = getFile( fileName );
            File f = new File(this.fileName);
            if( !f.exists() ){
                boolean res = createXmlFile( getFile(TEMPLATE_FILE), this.fileName);
                if( !res ){
                    createXmlFile( getFile(TEMPLATE_FILE), this.fileName);
                };
            }
            Map<String, String> fileMap = mxlMap.get( this.fileName );
            if( null == fileMap ){
                try {
                    fileMap = readXml( this.fileName );
                } catch (DocumentException e) {
                    e.printStackTrace();
                }
                if( !fileMap.isEmpty() ){
                    mxlMap.put( this.fileName, fileMap);
                }
            }
        }
    }

    public boolean add(String key, String value){
        boolean addRes = false;
        boolean deleteRes = deleteRow(this.fileName, key);
        if( deleteRes ){
            addRes = addRow( this.fileName, key, value);
        }
        return addRes && deleteRes;
    }

    public boolean remove(String key){
        return deleteRow(this.fileName, key);
    }

    public String get(String key){
        Map<String, String> allMap = getAllMap();
        return  allMap.get( key );
    }
    public Map<String, String> getAllMap(){
        Map<String, String> fileMap = mxlMap.get( this.fileName );
        return fileMap;
    }

    private boolean deleteRow(String fileName, String key){
        boolean res = true;
        Map<String, String> fileMap = mxlMap.get( this.fileName );
        synchronized( fileMap ){
            try {
                SAXReader reader = new SAXReader();
                Document doc = reader.read( this.fileName );
                Element root = doc.getRootElement();
                Element element;
                for (Iterator i = root.elementIterator("element"); i.hasNext();) {
                    element = (Element) i.next();
                    String keyName = element.attributeValue("key");
                    if( key.equals( keyName )){
                        element.detach();
                    }
                }
                Writer out = new PrintWriter( this.fileName, "UTF-8");
                OutputFormat format = new OutputFormat("\t", true);
                format.setTrimText(true);
                XMLWriter writer = new XMLWriter(out, format);
                writer.write(doc);
                out.close();
                writer.close();
                fileMap.remove( key );
            } catch (Exception e) {
                e.printStackTrace();
                res = false;
            }

        }
        return res;
    }


    private boolean addRow(String fileName, String key, String value){
        boolean res = true;
        Map<String, String> fileMap = mxlMap.get( this.fileName );
        synchronized( fileMap ){
            try {
                SAXReader reader = new SAXReader();
                Document doc = reader.read( this.fileName );
                Element root = doc.getRootElement();
                Element element = root.addElement( "element" );
                element.addAttribute("key", key);
                element.addAttribute("value", value);
                Writer out = new PrintWriter( this.fileName, "UTF-8");
                OutputFormat format = new OutputFormat("\t", true);
                format.setTrimText(true);
                XMLWriter writer = new XMLWriter(out, format);
                writer.write(doc);
                out.close();
                writer.close();
                fileMap.put( key, value );
            }catch (Exception e){
                res = false;
            }
        }
        return res;
    }

    private Map<String, String> readXml(String fileName) throws DocumentException {
        Map<String, String> elements = new ConcurrentHashMap<>();
        File f = new File( this.fileName );
        SAXReader reader = new SAXReader();
        Document doc = reader.read(f);
        Element root = doc.getRootElement();
        Element element;
        for (Iterator i = root.elementIterator("element"); i.hasNext();) {
            element = (Element) i.next();
            String key = element.attributeValue("key");
            String value = element.attributeValue("value");
            elements.put( key, value );
        }
        if( elements.isEmpty() ){
            deleteFile(fileName);
        }
        return elements;
    }

    public static String getFile(String filename){
        return BASE_PATH + filename;
    }

    public static String getFormatName(String name){
        return "flow-" + name + ".xml";
    }

    private static boolean createXmlFile(String template, String target){
        boolean res = true;
        try {
            File templateFile = new File( template );
            File targetFile = new File( target );
            FileUtil.copyFile( templateFile, targetFile );
        }catch (Exception e){
            res = false;
            e.printStackTrace();
        }
        return res;
    }

    public static boolean deleteFile(String fileName) {
        File f = new File( fileName );
        boolean res = f.delete();
        if( res ){
            mxlMap.remove( fileName );
        }
        return res;
    }
}
