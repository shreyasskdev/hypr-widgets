import { App } from "astal/gtk3";
import style from "./style.scss";
import DesktopClock from "./widget/DesktopClock";
import Bar from "./widget/Bar";
import ChargingAlert from "./widget/ChargingAlert";
import LowBatteryAlert from "./widget/LowBatteryAlert";


App.start({
  css: style,
  main() {
    App.get_monitors().forEach((gdkmonitor) => {
      Bar(gdkmonitor);
      DesktopClock(gdkmonitor);
      ChargingAlert(gdkmonitor);
      LowBatteryAlert(gdkmonitor);
    });
  },
});
