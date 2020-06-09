import Noty from 'noty';
import "../../node_modules/noty/lib/noty.css"
import "../../node_modules/noty/lib/themes/metroui.css"

export default function noty(text, type) {
    return new Noty({
        theme: "metroui", 
        text, 
        type,
        timeout: 8000
    }).show();
}
