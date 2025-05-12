import { App, Astal, Gtk, Gdk } from "astal/gtk3";
import Battery from "gi://AstalBattery";
import { bind } from "astal";
import Gio from "gi://Gio";
import GLib from "gi://GLib";

let alertWindow = null;
let fadeInId = 0;
let fadeOutId = 0;
let timeoutId = 0;

export function playSound(path: string) {
  path = path.replace(/^~/, GLib.get_home_dir());
  try {
    Gio.Subprocess.new(
      ["mpv", "--no-video", "--quiet", path],
      Gio.SubprocessFlags.NONE,
    );
  } catch (e) {
    console.error("Failed to play sound:", e);
  }
}

export function exec(cmd: string) {
  Gio.Subprocess.new(cmd.split(" "), Gio.SubprocessFlags.NONE);
}

function stopAnimations() {
  if (fadeInId) GLib.source_remove(fadeInId);
  if (fadeOutId) GLib.source_remove(fadeOutId);
  if (timeoutId) GLib.source_remove(timeoutId);
  fadeInId = fadeOutId = timeoutId = 0;
}

function fadeIn(window: Gtk.Window) {
  stopAnimations();
  window.opacity = 0;
  window.visible = true;

  let opacity = 0;
  const interval = 20;
  const step = 0.05;

  fadeInId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, interval, () => {
    opacity = Math.min(opacity + step, 1);
    window.opacity = opacity;

    if (opacity >= 1) {
      fadeInId = 0;
      return GLib.SOURCE_REMOVE;
    }
    return GLib.SOURCE_CONTINUE;
  });
}

function fadeOut(window: Gtk.Window) {
  let opacity = 1;
  const interval = 20;
  const step = 0.05;

  fadeOutId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, interval, () => {
    opacity = Math.max(opacity - step, 0);
    window.opacity = opacity;

    if (opacity <= 0) {
      window.visible = false;
      fadeOutId = 0;
      return GLib.SOURCE_REMOVE;
    }
    return GLib.SOURCE_CONTINUE;
  });
}

export default function ChargingAlert(gdkmonitor: Gdk.Monitor) {
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
      <box className="charging-box">
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

  battery.connect("notify::charging", () => {
    stopAnimations();

    const sound = battery.charging ? "plug.mp3" : "unplug.mp3";
    playSound(`~/.config/ags/audio/${sound}`);

    exec(
      `hyprctl keyword decoration:screen_shader ${
        homeDir
      }/.config/hypr/shaders/charging.frag`,
    );

    fadeIn(alertWindow);

    timeoutId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 2500, () => {
      fadeOut(alertWindow);
      timeoutId = 0;
      return GLib.SOURCE_REMOVE;
    });
  });

  return alertWindow;
}
