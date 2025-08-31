import {
    Body,
    Column,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text,
  } from '@react-email/components';
  import * as React from 'react';
  
  const baseUrl =
  process.env.NODE_ENV === "production"
    ? `https://prexoai.xyz`
    : "http://localhost:3000";

    interface CheckoutCreatedEmailProps {
        userName: string;
        productId: string;
        checkoutUrl: string;
        billingAddress?: string;
      }

  export const CheckoutCreatedEmail = ({ userName, productId, checkoutUrl, billingAddress }: CheckoutCreatedEmailProps) => (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>
          Get your checkout summary, estimated cost and more
        </Preview>
        <Container style={container}>
          <Section style={track.container}>
            <Row>
              <Column>
                <Text style={global.paragraphWithBold}>Product ID</Text>
                <Text style={track.number}>{productId}</Text>
              </Column>
              <Column align="right">
                <Link href={checkoutUrl} style={global.button}>Continue Checkout</Link>
              </Column>
            </Row>
          </Section>
          <Hr style={global.hr} />
          <Section style={message}>
            <Img
              src={`${baseUrl}/logo.png`}
              width="66"
              height="22"
              alt="Nike"
              style={{ margin: 'auto' }}
            />
            <Heading style={global.heading}>Complete Your Checkout!</Heading>
            <Text style={global.text}>
              You're almost there! Click the button above to finish your purchase and secure your product.
            </Text>
            <Text style={{ ...global.text, marginTop: 24 }}>
              If you have any questions or need assistance, feel free to contact our support team. Thank you for choosing us!
            </Text>
          </Section>
          <Hr style={global.hr} />
          <Section style={global.defaultPadding}>
            <Text style={adressTitle}>Shipping to: {userName}</Text>
            <Text style={{ ...global.text, fontSize: 14 }}>
                {billingAddress || 'No address provided'}
            </Text>
          </Section>
          <Hr style={global.hr} />
        </Container>
      </Body>
    </Html>
  );
  
  export default CheckoutCreatedEmail;
  
  const paddingX = {
    paddingLeft: '40px',
    paddingRight: '40px',
  };
  
  const paddingY = {
    paddingTop: '22px',
    paddingBottom: '22px',
  };
  
  const paragraph = {
    margin: '0',
    lineHeight: '2',
  };
  
  const global = {
    paddingX,
    paddingY,
    defaultPadding: {
      ...paddingX,
      ...paddingY,
    },
    paragraphWithBold: { ...paragraph, fontWeight: 'bold' },
    heading: {
      fontSize: '32px',
      lineHeight: '1.3',
      fontWeight: '700',
      textAlign: 'center',
      letterSpacing: '-1px',
    } as React.CSSProperties,
    text: {
      ...paragraph,
      color: '#747474',
      fontWeight: '500',
    },
    button: {
      border: '1px solid #929292',
      fontSize: '16px',
      textDecoration: 'none',
      padding: '10px 0px',
      width: '220px',
      display: 'block',
      textAlign: 'center',
      fontWeight: 500,
      color: '#000',
    } as React.CSSProperties,
    hr: {
      borderColor: '#E5E5E5',
      margin: '0',
    },
  };
  
  const main = {
    backgroundColor: '#ffffff',
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  };
  
  const container = {
    margin: '10px auto',
    width: '600px',
    maxWidth: '100%',
    border: '1px solid #E5E5E5',
  };
  
  const track = {
    container: {
      padding: '22px 40px',
      backgroundColor: '#F7F7F7',
    },
    number: {
      margin: '12px 0 0 0',
      fontWeight: 500,
      lineHeight: '1.4',
      color: '#6F6F6F',
    },
  };
  
  const message = {
    padding: '40px 74px',
    textAlign: 'center',
  } as React.CSSProperties;
  
  const adressTitle = {
    ...paragraph,
    fontSize: '15px',
    fontWeight: 'bold',
  };
  
  const recomendationsText = {
    margin: '0',
    fontSize: '15px',
    lineHeight: '1',
    paddingLeft: '10px',
    paddingRight: '10px',
  };
  
  const recomendations = {
    container: {
      padding: '20px 0',
    },
    product: {
      verticalAlign: 'top',
      textAlign: 'left' as const,
      paddingLeft: '2px',
      paddingRight: '2px',
    },
    title: { ...recomendationsText, paddingTop: '12px', fontWeight: '500' },
    text: {
      ...recomendationsText,
      paddingTop: '4px',
      color: '#747474',
    },
  };
  
  const menu = {
    container: {
      paddingLeft: '20px',
      paddingRight: '20px',
      paddingTop: '20px',
      backgroundColor: '#F7F7F7',
    },
    content: {
      ...paddingY,
      paddingLeft: '20px',
      paddingRight: '20px',
    },
    title: {
      paddingLeft: '20px',
      paddingRight: '20px',
      fontWeight: 'bold',
    },
    text: {
      fontSize: '13.5px',
      marginTop: 0,
      fontWeight: 500,
      color: '#000',
    },
    tel: {
      paddingLeft: '20px',
      paddingRight: '20px',
      paddingTop: '32px',
      paddingBottom: '22px',
    },
  };
  
  const categories = {
    container: {
      width: '370px',
      margin: 'auto',
      paddingTop: '12px',
    },
    text: {
      fontWeight: '500',
      color: '#000',
    },
  };
  
  const footer = {
    policy: {
      width: '166px',
      margin: 'auto',
    },
    text: {
      margin: '0',
      color: '#AFAFAF',
      fontSize: '13px',
      textAlign: 'center',
    } as React.CSSProperties,
  };
  