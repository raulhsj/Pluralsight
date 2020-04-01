package pluralsight.demo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RefreshScope
public class RateController {
    @Value("${rate}")
    String rate;
    @Value("${lanecount}")
    String laneCount;
    @Value("${tollstart}")
    String tollStart;
    @Value("${connstring}")
    String connstring;

    @GetMapping(path="/rate")
    public String getRate(Model m) {

        m.addAttribute("rateamount", rate);
        m.addAttribute("lanes", laneCount);
        m.addAttribute("tollstart", tollStart);
        m.addAttribute("connstring", connstring);

        //name of the view
        return "rateview";
    }
}
