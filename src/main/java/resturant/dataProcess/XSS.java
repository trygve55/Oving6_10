package resturant.dataProcess;

/**
 * Created by Trygve on 16.10.2017.
 */
public class XSS {

    public static String parse(String string) {
        return string.replace("<", "&lt;").replace(">", "&gt;").replace("\\","&quot;");
    }

    public static void main(String[] args) {
        System.out.println(XSS.parse("<tetsx>fvef<\\fefef>"));
    }
}
