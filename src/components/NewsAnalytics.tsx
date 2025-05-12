import {
	Grid,
	Paper,
	Title,
	Stack,
	Loader,
	Center,
	Text,
	Group,
} from "@mantine/core";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";
import { fetchNews } from "@/store/slices/newsSlice";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title as ChartTitle,
	Tooltip,
	Legend,
	ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	ChartTitle,
	Tooltip,
	Legend,
	ArcElement
);

const chartOptions = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			position: "right" as const,
		},
	},
};

// Consistent color palette for charts
const chartColors = {
	background: [
		"rgba(255, 99, 132, 0.5)",
		"rgba(54, 162, 235, 0.5)",
		"rgba(255, 206, 86, 0.5)",
		"rgba(75, 192, 192, 0.5)",
		"rgba(153, 102, 255, 0.5)",
		"rgba(255, 159, 64, 0.5)",
		"rgba(199, 199, 199, 0.5)",
		"rgba(83, 102, 255, 0.5)",
		"rgba(40, 159, 64, 0.5)",
		"rgba(210, 199, 199, 0.5)",
	],
	border: [
		"rgba(255, 99, 132, 1)",
		"rgba(54, 162, 235, 1)",
		"rgba(255, 206, 86, 1)",
		"rgba(75, 192, 192, 1)",
		"rgba(153, 102, 255, 1)",
		"rgba(255, 159, 64, 1)",
		"rgba(199, 199, 199, 1)",
		"rgba(83, 102, 255, 1)",
		"rgba(40, 159, 64, 1)",
		"rgba(210, 199, 199, 1)",
	],
};

const NewsAnalytics = () => {
	const dispatch = useAppDispatch();
	const { filteredArticles, loading, error } = useAppSelector(
		(state) => state.news
	);

	useEffect(() => {
		dispatch(fetchNews());
	}, [dispatch]);

	if (loading) {
		return (
			<Center h="50vh">
				<Loader size="lg" />
			</Center>
		);
	}

	if (error) {
		return (
			<Paper p="xl" withBorder>
				<Text c="red">{error}</Text>
			</Paper>
		);
	}

	// Author statistics
	const authorStats = filteredArticles.reduce((acc, article) => {
		(article.creator || []).forEach((author) => {
			acc[author] = (acc[author] || 0) + 1;
		});
		return acc;
	}, {} as Record<string, number>);

	// Category statistics
	const categoryStats = filteredArticles.reduce((acc, article) => {
		(article.category || []).forEach((category) => {
			acc[category] = (acc[category] || 0) + 1;
		});
		return acc;
	}, {} as Record<string, number>);

	// Prepare chart data
	const authorChartData = {
		labels: Object.keys(authorStats),
		datasets: [
			{
				label: "Articles per Author",
				data: Object.values(authorStats),
				backgroundColor: "rgba(53, 162, 235, 0.5)",
				borderColor: "rgba(53, 162, 235, 1)",
				borderWidth: 1,
			},
		],
	};

	const categoryChartData = {
		labels: Object.keys(categoryStats),
		datasets: [
			{
				label: "Articles per Category",
				data: Object.values(categoryStats),
				backgroundColor: chartColors.background,
				borderColor: chartColors.border,
				borderWidth: 1,
			},
		],
	};

	return (
		<Stack gap="lg">
			<Group justify="space-between">
				<Title order={2}>News Analytics</Title>
			</Group>

			<Grid>
				<Grid.Col span={{ base: 12, md: 6 }}>
					<Paper p="md" withBorder>
						<Title order={3} mb="md">
							Articles by Author
						</Title>
						<div style={{ height: "400px", position: "relative" }}>
							<Bar
								data={authorChartData}
								options={{
									...chartOptions,
									plugins: {
										...chartOptions.plugins,
										legend: {
											display: false,
										},
									},
								}}
							/>
						</div>
					</Paper>
				</Grid.Col>

				<Grid.Col span={{ base: 12, md: 6 }}>
					<Paper p="md" withBorder>
						<Title order={3} mb="md">
							Category Distribution
						</Title>
						<div style={{ height: "400px", position: "relative" }}>
							<Pie data={categoryChartData} options={chartOptions} />
						</div>
					</Paper>
				</Grid.Col>
			</Grid>
		</Stack>
	);
};

export default NewsAnalytics;
