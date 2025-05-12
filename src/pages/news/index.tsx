import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { NextPageWithLayout } from "@/types/common";
import {
	Container,
	Title,
	Text,
	Paper,
	Stack,
	SimpleGrid,
	Card,
	Group,
	Badge,
	Loader,
	Center,
	TextInput,
	Select,
	Button,
	Grid,
	Collapse,
	ActionIcon,
} from "@mantine/core";
import { ReactElement } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchNews, setFilters, resetFilters } from "@/store/slices/newsSlice";
import { format } from "date-fns";
import { IconSearch, IconFilter, IconX } from "@tabler/icons-react";
import { useDebouncedValue } from "@mantine/hooks";
import { getSession } from "next-auth/react";
import { GetServerSidePropsContext } from "next";

export const getServerSideProps = async (
	context: GetServerSidePropsContext
) => {
	const session = await getSession(context);

	if (!session) {
		return { redirect: { destination: "/auth/signin", permanent: false } };
	}

	return { props: {} };
};

const News: NextPageWithLayout = () => {
	const dispatch = useAppDispatch();
	const {
		filteredArticles: articles,
		loading,
		error,
		filters,
	} = useAppSelector((state) => state.news);
	const [showFilters, setShowFilters] = useState(false);
	const [debouncedSearchQuery] = useDebouncedValue(filters.searchQuery, 500);

	useEffect(() => {
		dispatch(fetchNews(debouncedSearchQuery));
	}, [dispatch, debouncedSearchQuery]);

	const handleSearch = (value: string) => {
		dispatch(setFilters({ searchQuery: value }));
	};

	const handleAuthorChange = (value: string | null) => {
		dispatch(setFilters({ author: value || "" }));
	};

	const handleCategoryChange = (value: string | null) => {
		dispatch(setFilters({ category: value || "" }));
	};

	const handleResetFilters = () => {
		dispatch(resetFilters());
	};

	if (loading) {
		return (
			<Center h="50vh">
				<Loader size="lg" />
			</Center>
		);
	}

	if (error) {
		return (
			<Container size="lg">
				<Paper p="xl" withBorder>
					<Text c="red">{error}</Text>
				</Paper>
			</Container>
		);
	}

	// Get unique authors and categories from articles
	const authors = Array.from(
		new Set(articles.flatMap((article) => article.creator || []))
	);
	const categories = Array.from(
		new Set(articles.flatMap((article) => article.category || []))
	);

	return (
		<Container size="lg">
			<Stack gap="xl">
				<Group justify="space-between" align="center">
					<Title order={2}>Latest News</Title>
					<Group>
						<TextInput
							placeholder="Search news..."
							value={filters.searchQuery}
							onChange={(e) => handleSearch(e.target.value)}
							leftSection={<IconSearch size={16} />}
							rightSection={
								filters.searchQuery && (
									<ActionIcon onClick={() => handleSearch("")}>
										<IconX size={16} />
									</ActionIcon>
								)
							}
						/>
						<Button
							variant="light"
							leftSection={<IconFilter size={16} />}
							onClick={() => setShowFilters(!showFilters)}
						>
							Filters
						</Button>
					</Group>
				</Group>

				<Collapse in={showFilters}>
					<Paper p="md" withBorder>
						<Grid>
							<Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
								<Select
									label="Author"
									placeholder="Select author"
									value={filters.author || null}
									onChange={handleAuthorChange}
									data={authors.map((author) => ({
										value: author,
										label: author,
									}))}
									clearable
								/>
							</Grid.Col>
							<Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
								<Select
									label="Category"
									placeholder="Select category"
									value={filters.category || null}
									onChange={handleCategoryChange}
									data={categories.map((category) => ({
										value: category,
										label: category,
									}))}
									clearable
								/>
							</Grid.Col>

							<Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
								<Button
									variant="light"
									color="red"
									fullWidth
									style={{ marginTop: "24px" }}
									onClick={handleResetFilters}
								>
									Reset
								</Button>
							</Grid.Col>
						</Grid>
					</Paper>
				</Collapse>

				<SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
					{articles.map((article) => (
						<Card key={article.link} withBorder radius="md" p="md">
							<Stack gap="xs" mt="md">
								<Text fw={500} size="lg" lineClamp={2}>
									{article.title}
								</Text>
								<Text size="sm" c="dimmed" lineClamp={3}>
									{article.description}
								</Text>
								<Group justify="space-between" mt="xs">
									<Badge size="sm">{article.source_name}</Badge>
									<Text size="xs" c="dimmed">
										{format(new Date(article.pubDate), "MMM d, yyyy")}
									</Text>
								</Group>
								{article.creator && (
									<Text size="xs" c="dimmed">
										By {article.creator[0]}
									</Text>
								)}
								<Group gap="xs">
									{article.category &&
										article.category.length > 0 &&
										article.category.map((cat) => (
											<Badge key={cat} size="xs" variant="light">
												{cat}
											</Badge>
										))}
								</Group>
							</Stack>
						</Card>
					))}
				</SimpleGrid>
			</Stack>
		</Container>
	);
};

News.getLayout = (page: ReactElement) => {
	return <AppLayout>{page}</AppLayout>;
};

export default News;
