import { ColorSchemeScript } from "@mantine/core";
import { Head, Html, Main, NextScript } from "next/document";

const Document = () => (
	<Html lang="en">
		<Head>
			<ColorSchemeScript defaultColorScheme="auto" />
		</Head>
		<body>
			<Main />
			<NextScript />
		</body>
	</Html>
);

export default Document;
