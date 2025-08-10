// lib/auth.js
import { AppConfig, UserSession, showConnect } from "@stacks/connect";
import { STACKS_TESTNET } from "@stacks/network";

const appConfig = new AppConfig(["store_write", "publish_data"]);
export const userSession = new UserSession({ appConfig });

export function authenticate() {
  showConnect({
    appDetails: {
      name: "School Reward",
      icon: "/favicon.ico"
    },
    redirectTo: "/",
    onFinish: () => {
      window.location.reload();
    },
    userSession
  });
}
