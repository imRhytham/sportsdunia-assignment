import { Container, Paper } from "@mantine/core";
import AppLayout from "@/components/layout/AppLayout";
import { ReactElement } from "react";
import { NextPageWithLayout } from "@/types/common";
import NewsAnalytics from "@/components/NewsAnalytics";
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

const Analytics: NextPageWithLayout = () => {
	return (
		<Container size="lg">
			<Paper radius="lg" p="xl" withBorder>
				<NewsAnalytics />
			</Paper>
		</Container>
	);
};

Analytics.getLayout = (page: ReactElement) => {
	return <AppLayout>{page}</AppLayout>;
};

export default Analytics;
