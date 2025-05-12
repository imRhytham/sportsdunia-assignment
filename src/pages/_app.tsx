import "@/styles/globals.css";
import "@mantine/core/styles.css";
import "@mantine/nprogress/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";

import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import RouterTransition from "@/components/RouterTransition";
import { Notifications } from "@mantine/notifications";
import theme from "@/styles/theme";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import type { NextPageWithLayout } from "@/types/common";

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

function AppContent({
	Component,
	pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
	const getLayout = Component.getLayout ?? ((page) => page);

	return (
		<SessionProvider session={session}>
			<ColorSchemeScript defaultColorScheme="dark" />
			<MantineProvider theme={theme} defaultColorScheme="dark">
				<RouterTransition />
				<Notifications />
				{getLayout(<Component {...pageProps} />)}
			</MantineProvider>
		</SessionProvider>
	);
}

export default function App(props: AppProps) {
	return (
		<Provider store={store}>
			<AppContent {...props} />
		</Provider>
	);
}
