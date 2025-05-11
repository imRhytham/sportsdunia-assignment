import { SessionProvider } from "next-auth/react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import RouterTransition from "@/components/RouterTransition";
import { Notifications } from "@mantine/notifications";
import theme from "@/styles/theme";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}: AppProps) {
	return (
		<Provider store={store}>
			<SessionProvider session={session}>
				<ColorSchemeScript defaultColorScheme="light" />
				<MantineProvider theme={theme} defaultColorScheme="light">
					<RouterTransition />
					<Notifications />
					<Component {...pageProps} />
				</MantineProvider>
			</SessionProvider>
		</Provider>
	);
}
