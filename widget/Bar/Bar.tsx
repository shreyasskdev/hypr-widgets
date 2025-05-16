import { App, Astal, Gtk, Gdk } from "astal/gtk4";
import { Variable } from "astal";
import { bind } from "astal";
import Battery from "gi://AstalBattery";
import AstalHyprland from "gi://AstalHyprland";

// Import WorkspacesPanelButton component
import WorkspacesPanelButton from "./WorkspacesPanelButton";

// Time variables
const hour = Variable("").poll(1000, "date +%I");
const minute = Variable("").poll(1000, "date +%M");
const ampm = Variable("").poll(1000, "date +%p");
const date = Variable("").poll(1000, "date '+%A, %d'");

export default function Bar(gdkmonitor: Gdk.Monitor) {
  const hyprland = AstalHyprland.get_default();

  // Reactive class names for clock container
  const clockClassNames = Variable.derive(
    [bind(hyprland, "focusedWorkspace"), bind(hyprland, "clients")],
    (fws, _) => {
      const workspace = hyprland.get_workspace(fws.id);
      const occupied = workspace ? workspace.get_clients().length > 0 : false;
      const classes = ["clock-container"];
      if (occupied) classes.push("occupied");
      else classes.push("not-occupied");
      return classes;
    },
  );

  const { TOP, LEFT, BOTTOM } = Astal.WindowAnchor;

  // Battery handling
  const battery = Battery.get_default();
  const b = bind(battery, "percentage").as((val) => {
    return (val * 100).toFixed(0) + "";
  });

  const batteryFillVariable = b.as((percentStr) => {
    const pct = parseInt(percentStr);
    return `--battery-pct: ${pct}%`;
  });

  return (
    <window
      visible
      cssClasses={["Bar"]}
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | BOTTOM}
      application={App}
    >
      <centerbox
        orientation={Gtk.Orientation.VERTICAL}
        cssClasses={["bar-container"]}
      >
        <box valign={Gtk.Align.START}>
          <WorkspacesPanelButton />
        </box>
        {/* Clock container with reactive classNames */}
        <box
          cssClasses={clockClassNames().as((classes) => classes)}
          orientation={Gtk.Orientation.VERTICAL}
          heightRequest={100}
          valign={Gtk.Align.CENTER}
          onDestroy={() => clockClassNames.drop()}
        >
          <label label={hour()} cssClasses={["clock"]} />
          <label label=":" cssClasses={["clock", "rotate"]} />
          <label label={minute()} cssClasses={["clock"]} />
        </box>
        <box
          valign={Gtk.Align.END}
          orientation={Gtk.Orientation.VERTICAL}
          cssClasses={["battery"]}
          // css={batteryFillVariable}
        >
          <label label={b} />
          {/* <label label="" cssName="battery-icon" /> */}
        </box>
      </centerbox>
    </window>
  );
}
