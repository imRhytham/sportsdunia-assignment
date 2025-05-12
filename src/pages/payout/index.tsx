import { Container } from "@mantine/core";
import AppLayout from "@/components/layout/AppLayout";
import { ReactElement } from "react";
import { NextPageWithLayout } from "@/types/common";
import PayoutTable from "@/components/PayoutTable";
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

const Payout: NextPageWithLayout = () => {
	return (
		<Container size="lg">
			<PayoutTable />
		</Container>
	);
};

Payout.getLayout = (page: ReactElement) => {
	return <AppLayout>{page}</AppLayout>;
};

export default Payout;
