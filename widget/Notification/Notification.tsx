import { GLib } from "astal";
import { Gtk, Astal } from "astal/gtk4";
// import { type EventBox } from "astal/gtk4/widget";
import Notifd from "gi://AstalNotifd";

// const isIcon = (icon: string) => !!Astal.Icon.lookup_icon(icon);

const fileExists = (path: string) => GLib.file_test(path, GLib.FileTest.EXISTS);

const time = (time: number, format = "%H:%M") =>
  GLib.DateTime.new_from_unix_local(time).format(format)!;

const urgency = (n: Notifd.Notification) => {
  const { LOW, NORMAL, CRITICAL } = Notifd.Urgency;
  switch (n.urgency) {
    case LOW:
      return "low";
    case CRITICAL:
      return "critical";
    case NORMAL:
    default:
      return "normal";
  }
};

type Props = {
  // setup(self: EventBox): void;
  // onHoverLost(self: EventBox): void;
  notification: Notifd.Notification;
};

export default function Notification(props: Props) {
  // const { notification: n, onHoverLost, setup } = props;
  const { notification: n } = props;
  const { START, CENTER, END } = Gtk.Align;

  return (
    // <eventbox
    //   cssClasses={["Notification", urgency(n)]}
    //   setup={setup}
    //   onHoverLost={onHoverLost}
    // >
    <box
      orientation={Gtk.Orientation.VERTICAL}
      // onHoverLeave={onHoverLost}
    >
      <box cssClasses={["header"]} orientation={Gtk.Orientation.HORIZONTAL}>
        {/* {(n.appIcon || n.desktopEntry) && (
          <icon
            cssClasses={["app-icon"]}
            visible={Boolean(n.appIcon || n.desktopEntry)}
            icon={n.appIcon || n.desktopEntry}
          />
        )} */}
        <label
          cssClasses={["app-name"]}
          halign={START}
          // ellipsize={Gtk.EllipsizeMode.END}
          label={n.appName || "Unknown"}
        />
        <label
          cssClasses={["time"]}
          hexpand
          halign={END}
          label={time(n.time)}
        />
        <button onClicked={() => n.dismiss()}>
          {/* <icon icon="window-close-symbolic" /> */}
        </button>
      </box>
      {/* <separator visible /> */}
      <box cssClasses={["content"]} orientation={Gtk.Orientation.HORIZONTAL}>
        {n.image && fileExists(n.image) && (
          <box
            valign={START}
            cssClasses={["image"]}
            // css={`
            //   background-image: url("${n.image}");
            // `}
          />
        )}
        {/* {n.image && isIcon(n.image) && (
          <box
            expand={false}
            valign={START}
            cssClasses={["icon-image"]}
          >
            <icon icon={n.image} expand halign={CENTER} valign={CENTER} />
          </box>
        )} */}
        <box orientation={Gtk.Orientation.VERTICAL}>
          <label
            cssClasses={["summary"]}
            halign={START}
            xalign={0}
            label={n.summary}
            // ellipsize={Gtk.EllipsizeMode.END}
          />
          {n.body && (
            <label
              cssClasses={["body"]}
              wrap
              useMarkup
              halign={START}
              xalign={0}
              justify={Gtk.Justification.FILL}
              label={n.body}
            />
          )}
        </box>
      </box>
      {n.get_actions().length > 0 && (
        <box cssClasses={["actions"]} orientation={Gtk.Orientation.HORIZONTAL}>
          {n.get_actions().map(({ label, id }) => (
            <button hexpand onClicked={() => n.invoke(id)}>
              <label label={label} halign={CENTER} hexpand />
            </button>
          ))}
        </box>
      )}
    </box>
    // </eventbox>
  );
}
