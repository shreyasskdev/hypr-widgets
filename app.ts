import { App } from "astal/gtk3";
import style from "./style.scss";
import DesktopClock from "./widget/DesktopClock";
import Bar from "./widget/Bar";

App.start({
  css: style,
  main() {
    // Loop over each monitor and render both widgets
    App.get_monitors().forEach((gdkmonitor) => {
      Bar(gdkmonitor); // Render the Bar on each monitor
      DesktopClock(gdkmonitor); // Render the DesktopClock on each monitor
    });
  },
});
