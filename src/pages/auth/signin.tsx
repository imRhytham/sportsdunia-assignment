import { getSession, signIn, useSession } from "next-auth/react";
import { Container, Text, Button, Paper, Stack, Box } from "@mantine/core";
import { IconBrandGoogle } from "@tabler/icons-react";
import { GetServerSidePropsContext } from "next";

export const getServerSideProps = async (
	context: GetServerSidePropsContext
) => {
	const session = await getSession(context);

	if (session) {
		return { redirect: { destination: "/dashboard", permanent: false } };
	}

	return { props: {} };
};

export default function SignIn() {
	const { status } = useSession();

	if (status === "loading") {
		return (
			<Container
				size="xs"
				h="100vh"
				className="flex items-center justify-center"
			>
				<Text size="xl">Loading...</Text>
			</Container>
		);
	}

	return (
		<Box className="flex items-center justify-center h-screen bg-gradient-to-b from-[#1a1b1e] to-[#2c2e33]">
			<Container size="xs" px="md">
				<Paper
					radius="lg"
					p="xl"
					withBorder
					className="bg-white/95 backdrop-blur-lg"
				>
					<Stack gap="md" w="100%">
						<Text size="xl" fw={700} ta="center">
							Sign in to your account
						</Text>
						<Button
							size="lg"
							leftSection={<IconBrandGoogle className="w-5 h-5" />}
							onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
							fullWidth
							radius="md"
							className="border-2 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md"
						>
							Continue with Google
						</Button>
					</Stack>
				</Paper>
			</Container>
		</Box>
	);
}
