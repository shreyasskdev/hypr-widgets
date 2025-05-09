import { App, Astal, Gtk, Gdk } from "astal/gtk3";
import Battery from "gi://AstalBattery";
import { bind } from "astal";
import Gio from "gi://Gio";
import GLib from "gi://GLib";

let chargingWindow = null;
let fadeTimeout = 0;

export default function ChargingAlert(gdkmonitor: Gdk.Monitor) {
  const battery = Battery.get_default();
  const homeDir = GLib.get_home_dir();

  const batteryPercentage = bind(battery, "percentage").as((val) => {
    return `${(val * 100).toFixed(0)}%`;
  });

  chargingWindow = (
    <window
      className="charging-widget"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.IGNORE}
      application={App}
      layer={Astal.Layer.TOP}
      visible={false}
      opacity={1.0}
      title="Charging Widget"
    >
      <box className="charging-box">
        <box
          halign={Gtk.Align.CENTER}
          valign={Gtk.Align.CENTER}
          spacing={10}
          hexpand={true}
          vexpand={true}
        >
          <label label="󰂄" className="charging-label" />
          <label label={batteryPercentage} className="charging-label" />
        </box>
      </box>
    </window>
  );

  function fadeOutWindow() {
    let opacity = 1.0;
    const fadeStep = 0.05;
    const interval = 20;

    GLib.timeout_add(GLib.PRIORITY_DEFAULT, interval, () => {
      opacity -= fadeStep;
      chargingWindow.opacity = opacity;

      if (opacity <= 0) {
        chargingWindow.visible = false;
        return GLib.SOURCE_REMOVE;
      }
      return GLib.SOURCE_CONTINUE;
    });
  }

  function fadeInWindow() {
    let opacity = 0.0;
    const fadeStep = 0.05;
    const interval = 20;

    chargingWindow.opacity = opacity;
    chargingWindow.visible = true;

    GLib.timeout_add(GLib.PRIORITY_DEFAULT, interval, () => {
      opacity += fadeStep;
      chargingWindow.opacity = Math.min(opacity, 1.0);

      if (opacity >= 1.0) return GLib.SOURCE_REMOVE;
      return GLib.SOURCE_CONTINUE;
    });
  }

  battery.connect("notify::charging", () => {
    const isCharging = battery.charging;

    if (isCharging) {
      GLib.timeout_add(GLib.PRIORITY_DEFAULT, 100, () => {
        fadeInWindow();
        return GLib.SOURCE_REMOVE;
      });

      Gio.Subprocess.new(
        [
          "hyprctl",
          "keyword",
          "decoration:screen_shader",
          `${homeDir}/.config/hypr/shaders/charging.frag`,
        ],
        Gio.SubprocessFlags.NONE,
      );

      if (fadeTimeout) GLib.source_remove(fadeTimeout);

      fadeTimeout = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 2000, () => {
        fadeOutWindow();
        return GLib.SOURCE_REMOVE;
      });
    }
  });

  return chargingWindow;
}
