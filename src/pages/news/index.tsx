import AppLayout from "@/components/layout/AppLayout";
import { NextPageWithLayout } from "@/types/common";
import { Container, Title, Text, Paper, Stack } from "@mantine/core";
import { ReactElement } from "react";

const News: NextPageWithLayout = () => {
	return (
		<Container size="lg">
			<Stack gap="xl">
				<Title order={2}>Latest News</Title>
				<Paper
					radius="lg"
					p="xl"
					withBorder
					style={{ background: "rgba(255, 255, 255, 0.9)" }}
				>
					<Text>News content will be displayed here.</Text>
				</Paper>
			</Stack>
		</Container>
	);
};

News.getLayout = (page: ReactElement) => {
	return <AppLayout>{page}</AppLayout>;
};

export default News;
