import { Container } from "@mantine/core";
import Dashboard from "@/components/Dashboard";
import AppLayout from "@/components/layout/AppLayout";
import { NextPageWithLayout } from "@/types/common";
import { ReactElement } from "react";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";

export const getServerSideProps = async (
	context: GetServerSidePropsContext
) => {
	const session = await getSession(context);

	if (!session) {
		return { redirect: { destination: "/auth/signin", permanent: false } };
	}

	return { props: {} };
};

const DashboardPage: NextPageWithLayout = () => {
	return (
		<Container size="xl">
			<Dashboard />
		</Container>
	);
};

DashboardPage.getLayout = (page: ReactElement) => {
	return <AppLayout>{page}</AppLayout>;
};

export default DashboardPage;
