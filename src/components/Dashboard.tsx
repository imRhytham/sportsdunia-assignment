import {
	Grid,
	Paper,
	Text,
	Title,
	Group,
	RingProgress,
	Stack,
	Loader,
	Center,
	useMantineTheme,
} from "@mantine/core";
import { useAppSelector } from "@/store/hooks";
import {
	IconArticle,
	IconUsers,
	IconCurrencyDollar,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { fetchNews } from "@/store/slices/newsSlice";

interface PayoutRate {
	author: string;
	rate: number;
}

const Dashboard = () => {
	const theme = useMantineTheme();
	const dispatch = useAppDispatch();
	const { filteredArticles, loading, error } = useAppSelector(
		(state) => state.news
	);
	const [payoutRates, setPayoutRates] = useState<PayoutRate[]>([]);

	// Define color mapping
	const colorMapping = {
		sports: theme.colors.blue[6],
		technology: theme.colors.green[6],
		business: theme.colors.yellow[6],
		entertainment: theme.colors.grape[6],
		health: theme.colors.teal[6],
		science: theme.colors.orange[6],
		general: theme.colors.gray[6],
		politics: theme.colors.cyan[6],
		education: theme.colors.violet[6],
		other: theme.colors.lime[6],
	};

	useEffect(() => {
		// Fetch news data
		dispatch(fetchNews());

		// Load payout rates from localStorage
		const savedRates = localStorage.getItem("payoutRates");
		if (savedRates) {
			setPayoutRates(JSON.parse(savedRates).rates);
		}
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

	// Calculate statistics
	const totalArticles = filteredArticles.length;
	const uniqueAuthors = new Set(
		filteredArticles.flatMap((article) => article.creator || [])
	).size;

	// Calculate total payout using localStorage data
	const totalPayout = filteredArticles.reduce((sum, article) => {
		const articlePayout = (article.creator || []).reduce(
			(authorSum, author) => {
				const rate = payoutRates.find((r) => r.author === author)?.rate || 0;
				return authorSum + rate;
			},
			0
		);
		return sum + articlePayout;
	}, 0);

	// Calculate category distribution
	const categoryCount = filteredArticles.reduce((acc, article) => {
		(article.category || []).forEach((cat) => {
			acc[cat] = (acc[cat] || 0) + 1;
		});
		return acc;
	}, {} as Record<string, number>);

	const categoryData = Object.entries(categoryCount).map(
		([category, count]) => ({
			category,
			count,
			percentage: (count / totalArticles) * 100,
			color:
				colorMapping[category.toLowerCase() as keyof typeof colorMapping] ||
				theme.colors.gray[6],
		})
	);

	return (
		<Stack gap="lg">
			<Title order={2}>Dashboard Overview</Title>

			<Grid>
				<Grid.Col span={{ base: 12, md: 4 }}>
					<Paper p="md" withBorder>
						<Group>
							<IconArticle size={32} color="blue" />
							<div>
								<Text size="xs" c="dimmed">
									Total Articles
								</Text>
								<Text fw={700} size="xl">
									{totalArticles}
								</Text>
							</div>
						</Group>
					</Paper>
				</Grid.Col>

				<Grid.Col span={{ base: 12, md: 4 }}>
					<Paper p="md" withBorder>
						<Group>
							<IconUsers size={32} color="green" />
							<div>
								<Text size="xs" c="dimmed">
									Unique Authors
								</Text>
								<Text fw={700} size="xl">
									{uniqueAuthors}
								</Text>
							</div>
						</Group>
					</Paper>
				</Grid.Col>

				<Grid.Col span={{ base: 12, md: 4 }}>
					<Paper p="md" withBorder>
						<Group>
							<IconCurrencyDollar size={32} color="yellow" />
							<div>
								<Text size="xs" c="dimmed">
									Total Payout
								</Text>
								<Text fw={700} size="xl">
									${totalPayout.toFixed(2)}
								</Text>
							</div>
						</Group>
					</Paper>
				</Grid.Col>
			</Grid>

			<Grid>
				<Grid.Col span={{ base: 12, md: 6 }}>
					<Paper p="md" withBorder>
						<Title order={3} mb="md">
							Category Distribution
						</Title>
						<Group align="flex-start">
							<RingProgress
								size={200}
								thickness={20}
								sections={categoryData.map(
									({ category, percentage, color }) => ({
										value: percentage,
										color,
										tooltip: `${category}: ${percentage.toFixed(1)}%`,
									})
								)}
								label={
									<Text ta="center" size="xl" fw={700}>
										{totalArticles}
									</Text>
								}
							/>
							<Stack gap="xs" mt="xl">
								{categoryData.map(({ category, percentage, color }) => (
									<Group key={category} gap="xs">
										<div
											style={{
												width: 12,
												height: 12,
												backgroundColor: color,
												borderRadius: "50%",
											}}
										/>
										<Text size="sm">{category}</Text>
										<Text size="sm" c="dimmed">
											({percentage.toFixed(1)}%)
										</Text>
									</Group>
								))}
							</Stack>
						</Group>
					</Paper>
				</Grid.Col>

				<Grid.Col span={{ base: 12, md: 6 }}>
					<Paper p="md" withBorder>
						<Title order={3} mb="md">
							Top Categories
						</Title>
						<Stack gap="xs">
							{categoryData
								.sort((a, b) => b.count - a.count)
								.slice(0, 5)
								.map(({ category, count, percentage, color }) => (
									<Group key={category} justify="space-between">
										<Group gap="xs">
											<div
												style={{
													width: 12,
													height: 12,
													backgroundColor: color,
													borderRadius: "50%",
												}}
											/>
											<Text>{category}</Text>
										</Group>
										<Group gap="xs">
											<Text fw={500}>{count}</Text>
											<Text size="sm" c="dimmed">
												({percentage.toFixed(1)}%)
											</Text>
										</Group>
									</Group>
								))}
						</Stack>
					</Paper>
				</Grid.Col>
			</Grid>
		</Stack>
	);
};

export default Dashboard;
