import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Tailwind,
    Text,
  } from '@react-email/components';
  import * as React from "react";

  const baseUrl = process.env.NODE_ENV === "production"
  ? `https://prexoai.xyz`
  : "http://localhost:3000";

  interface PrexoWelcomeMailProps {
    userName: string;
  }
  
  export default function PrexoWelcomeMail({
    userName,
  }: PrexoWelcomeMailProps) {
    return (
      <Html>
        <Head />
        <Preview>Welcome to Prexo AI</Preview>
        <Tailwind>
          <Body className="bg-white font-sans">
            <Container className="mx-auto w-full max-w-[600px] p-0">
              <Section className="p-8 text-center">
                <div className="flex flex-row items-center justify-center gap-2 mx-0 mt-4 mb-8 p-0">
                  <Img
                    src={`${baseUrl}/logo.png`}
                    width="42"
                    height="42"
                    alt="Logo"
                  />
                  <span className="font-bold tracking-tighter text-2xl">Prexo AI</span>
                </div>
                <Text className="font-normal text-sm uppercase tracking-wider">
                  Hii, {userName}
                </Text>
                <Heading className="my-4 font-medium text-4xl leading-tight">
                  Thanks, for choosing us!
                </Heading>
                <Text className="mb-8 text-lg leading-8">
                  Welcome again! We're excited to have you on board.
                  Get ready to integrate Prexo AI sales & support Agents in your apps.
                </Text>
                <Link
                  href={baseUrl}
                  className="inline-flex items-center rounded-full bg-gray-900 px-12 py-4 text-center font-bold text-sm text-white no-underline"
                >
                  Get Started
                </Link>
              </Section>
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  }