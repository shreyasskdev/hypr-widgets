import { App, Astal, Gtk, Gdk } from "astal/gtk3";
import Battery from "gi://AstalBattery";
import { bind } from "astal";
import Gio from "gi://Gio";
import GLib from "gi://GLib";
import {playSound,fadeIn,fadeOut,exec} from "./ChargingAlert.tsx"


const battery = Battery.get_default()
let alertWindow = null;
let fadeInId = 0;
let fadeOutId = 0;
let timeoutId = 0;

export default function LowBatteryAlert(gdkmonitor: Gdk.Monitor) {
  const battery = Battery.get_default();
  const homeDir = GLib.get_home_dir();

  const batteryPercentage = bind(battery, "percentage").as(
    (val) => `${(val * 100).toFixed(0)}%`,
  );

  const chargingIcon = bind(battery, "charging").as((val) => (val ? "󰂄" : "󰚦"));

  const labelClass = bind(battery, "charging").as(
    (val) => `charging-label${val ? "" : " not"}`,
  );

  alertWindow = (
    <window
      className="charging-widget"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.IGNORE}
      application={App}
      layer={Astal.Layer.TOP}
      visible={false}
      opacity={0}
      title="Charging Alert"
    >
      <box className="low-battery-box">
        <box
          halign={Gtk.Align.CENTER}
          valign={Gtk.Align.CENTER}
          spacing={10}
          hexpand={true}
          vexpand={true}
        >
          <label label={chargingIcon} className="charging-label" />
          <label label={batteryPercentage} className={labelClass} />
        </box>
      </box>
    </window>
  );


  battery.connect("notify::percentage", () => {
    const per = battery.percentage;
    log(per)
    if(per == 0.15 && !battery.charging){
    playSound(`~/.config/ags/audio/unplug.mp3`);

    fadeIn(alertWindow);

    timeoutId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 2500, () => {
      fadeOut(alertWindow);
      timeoutId = 0;
      return GLib.SOURCE_REMOVE;
    });
    }
      });


  return alertWindow;
}
