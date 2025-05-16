import { Gtk } from "astal/gtk4";
import AstalHyprland from "gi://AstalHyprland";
import { bind } from "astal";
import { Variable } from "astal";
import { ButtonProps } from "astal/gtk4/widget";

type WsButtonProps = ButtonProps & {
  ws: AstalHyprland.Workspace;
};

function WorkspaceButton({ ws, ...props }: WsButtonProps) {
  const hyprland = AstalHyprland.get_default();
  const classNames = Variable.derive(
    [bind(hyprland, "focusedWorkspace"), bind(hyprland, "clients")],
    (fws, _) => {
      const classes = ["workspace-button"];
      const active = fws.id == ws.id - 1;
      active && classes.push("active");
      const occupied =
        hyprland.get_workspace(ws.id - 1)?.get_clients().length > 0;
      occupied && classes.push("occupied");
      return classes;
    },
  );

  return (
    <button
      cssClasses={classNames().as((classes) => classes)}
      // onDispose={() => classNames.drop()}
      onClicked={() => ws.focus()}
      width_request={2}
      height_request={2}
      {...props}
    />
  );
}

export default function WorkspacesPanelButton() {
  return (
    <box
      cssClasses={["workspace-container"]}
      halign={Gtk.Align.CENTER}
      hexpand={true}
      orientation={Gtk.Orientation.VERTICAL}
    >
      {range(6).map((i) => (
        <WorkspaceButton ws={AstalHyprland.Workspace.dummy(i + 1, null)} />
      ))}
    </box>
  );
}

function range(max: number) {
  return Array.from({ length: max }, (_, i) => i + 1);
}
