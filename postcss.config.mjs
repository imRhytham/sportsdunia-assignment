const config = {
	plugins: ["@tailwindcss/postcss"],
	preset: "postcss-preset-mantine",
	simpleVars: {
		variables: {
			"mantine-breakpoint-xs": "36em",
			"mantine-breakpoint-sm": "48em",
			"mantine-breakpoint-md": "62em",
			"mantine-breakpoint-lg": "75em",
		},
	},
	autoprefixer: {},
	tailwindcss: {},
};

export default config;
