import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Container, Text, Button, Paper, Stack, rem, Box } from "@mantine/core";
import { IconBrandGoogle } from "@tabler/icons-react";

export default function SignIn() {
	const { status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status === "authenticated") {
			router.push("/dashboard");
		}
	}, [status, router]);

	if (status === "loading") {
		return (
			<Container
				size="xs"
				h="100vh"
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Text size="xl">Loading...</Text>
			</Container>
		);
	}

	return (
		<Box
			style={{
				minHeight: "100vh",
				background: "linear-gradient(135deg, #1a1b1e 0%, #2c2e33 100%)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Container size="xs" px="md">
				<Paper
					radius="lg"
					p="xl"
					withBorder
					style={{
						background: "rgba(255, 255, 255, 0.95)",
						backdropFilter: "blur(10px)",
					}}
				>
					<Stack gap="md" w="100%">
						<Button
							variant="light"
							size="lg"
							leftSection={
								<IconBrandGoogle style={{ width: rem(20), height: rem(20) }} />
							}
							onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
							fullWidth
							radius="md"
							style={{
								borderWidth: 2,
								transition: "all 0.2s ease",
								"&:hover": {
									transform: "translateY(-2px)",
									boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
								},
							}}
						>
							Continue with Google
						</Button>
					</Stack>

					<Text c="dimmed" size="sm" ta="center" mt="md">
						By signing in, you agree to our Terms of Service and Privacy Policy
					</Text>
				</Paper>
			</Container>
		</Box>
	);
}
