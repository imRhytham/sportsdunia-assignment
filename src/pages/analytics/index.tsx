import { Container, Title, Text, Paper, Stack } from "@mantine/core";
import AppLayout from "@/components/layout/AppLayout";
import { ReactElement } from "react";
import { NextPageWithLayout } from "@/types/common";

const Analytics: NextPageWithLayout = () => {
	return (
		<Container size="lg">
			<Stack gap="xl">
				<Title order={2}>Analytics Dashboard</Title>
				<Paper
					radius="lg"
					p="xl"
					withBorder
					style={{ background: "rgba(255, 255, 255, 0.9)" }}
				>
					<Text>Analytics charts and data will be displayed here.</Text>
				</Paper>
			</Stack>
		</Container>
	);
};

Analytics.getLayout = (page: ReactElement) => {
	return <AppLayout>{page}</AppLayout>;
};

export default Analytics;
