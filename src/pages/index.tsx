import { getSession } from "next-auth/react";
import { GetServerSidePropsContext } from "next";

export const getServerSideProps = async (
	context: GetServerSidePropsContext
) => {
	const session = await getSession(context);

	if (!session) {
		return { redirect: { destination: "/auth/signin", permanent: false } };
	}

	return { redirect: { destination: "dashboard", permanent: false } };
};

export default function Home() {
	return <></>;
}
