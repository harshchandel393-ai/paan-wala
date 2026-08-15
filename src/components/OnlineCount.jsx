import { useEffect, useState } from "react";
import {
  onValue,
  onDisconnect,
  push,
  ref,
  set,
} from "firebase/database";
import {
  onAuthStateChanged,
  signInAnonymously,
} from "firebase/auth";

import { auth, db } from "../firebase";

export default function OnlineCount() {
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    let presenceListener = null;
    let connectionListener = null;

    const setupPresence = (user) => {
      const connectionsRef = ref(
        db,
        `presence/${user.uid}/connections`
      );

      const connectedRef = ref(
        db,
        ".info/connected"
      );

      // =========================
      // COUNT ONLINE USERS
      // =========================
      const presenceRef = ref(
        db,
        "presence"
      );

      presenceListener = onValue(
        presenceRef,
        (snapshot) => {
          const data = snapshot.val();

          if (!data) {
            setOnlineCount(0);
            return;
          }

          let count = 0;

          Object.values(data).forEach(
            (userData) => {
              if (userData?.connections) {
                count += Object.keys(
                  userData.connections
                ).length;
              }
            }
          );

          setOnlineCount(count);
        },
        (error) => {
          console.error(
            "Presence read error:",
            error
          );
        }
      );

      // =========================
      // CREATE CONNECTION
      // =========================
      connectionListener = onValue(
        connectedRef,
        async (snapshot) => {
          if (snapshot.val() !== true) {
            return;
          }

          const connectionRef =
            push(connectionsRef);

          try {
            await onDisconnect(
              connectionRef
            ).remove();

            await set(
              connectionRef,
              true
            );

            console.log(
              "🟢 Online connection created"
            );
          } catch (error) {
            console.error(
              "Connection error:",
              error
            );
          }
        }
      );
    };

    // =========================
    // AUTHENTICATION
    // =========================
    const unsubscribeAuth =
      onAuthStateChanged(
        auth,
        async (user) => {
          try {
            if (user) {
              console.log(
                "🔥 Firebase user:",
                user.uid
              );

              setupPresence(user);
            } else {
              console.log(
                "🔐 Signing in anonymously..."
              );

              await signInAnonymously(
                auth
              );
            }
          } catch (error) {
            console.error(
              "Authentication error:",
              error
            );
          }
        }
      );

    // =========================
    // CLEANUP
    // =========================
    return () => {
      unsubscribeAuth();

      if (presenceListener) {
        presenceListener();
      }

      if (connectionListener) {
        connectionListener();
      }
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        color: "#f1e4c8",
        fontSize: "14px",
        fontWeight: "500",
        letterSpacing: "0.08em",
        textShadow:
          "0 2px 10px rgba(0,0,0,0.8)",
        whiteSpace: "nowrap",
      }}
    >
      {/* GREEN DOT */}
      <span
        style={{
          width: "9px",
          height: "9px",
          minWidth: "9px",
          borderRadius: "50%",
          backgroundColor: "#22c55e",
          boxShadow:
            "0 0 8px rgba(34,197,94,0.9)",
          display: "inline-block",
        }}
      />

      {/* ONLINE COUNT */}
      <span>
        {onlineCount} online
      </span>
    </div>
  );
}