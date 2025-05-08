import { Body, Container, Heading, Html, Link, Preview, Section, Text } from "@react-email/components";
import * as React from 'react';

interface ConfirmTemplateProps {
  address: string;
}

export function ConfirmTemplate({ address }: ConfirmTemplateProps) {
  return (
    <Html>
      <Body
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          backgroundColor: '#ffffff',
          margin: 0,
          padding: 0,
        }}
      >
        <Preview>Подтвердите свой e-mail в Sachsen Launcher</Preview>

        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '24px' }}>
          <Heading
            style={{
              fontSize: '22px',
              fontWeight: 'bold',
              margin: '0 0 20px 0',
              color: '#000000',
            }}
          >
            SACHSEN
          </Heading>

          <Section
            style={{
              backgroundColor: '#EBDBB2',
              border: '1px solid #000000',
              padding: '20px',
              fontSize: '14px',
              color: '#000000',
            }}
          >
            <Heading
              style={{
                fontSize: '18px',
                margin: '0 0 12px 0',
              }}
            >
              Подтверждение почты
            </Heading>

            <Text style={{ margin: '0 0 16px 0', lineHeight: '1.5' }}>
              Привет! Чтобы подтвердить свой e-mail, нажмите на кнопку ниже:
            </Text>

            <table
              role="presentation"
              cellPadding="0"
              cellSpacing="0"
              width="100%"
              style={{ marginBottom: '16px' }}
            >
              <tr>
                <td align="center">
                  <a
                    href={address}
                    style={{
                      display: 'block',
                      width: '100%',
                      maxWidth: '100%',
                      backgroundColor: '#005A9E',
                      color: '#ffffff',
                      textDecoration: 'none',
                      padding: '12px 0',
                      border: '1px solid #000000',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      textAlign: 'center',
                    }}
                  >
                    Подтвердить почту
                  </a>
                </td>
              </tr>
            </table>

            <Text style={{ fontSize: '12px', lineHeight: '1.4', margin: 0 }}>
              Если вы не запрашивали подтверждение, просто проигнорируйте это письмо.
              Кнопка подтверждения будет активна в течение 1 часа.
            </Text>
          </Section>

          <Section style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #ccc', textAlign: 'center' }}>
            <Text style={{ fontSize: '12px', color: '#282828', margin: 0 }}>
              <Link
                href="https://molnikas.su"
                style={{ color: '#282828', textDecoration: 'underline', marginRight: '12px' }}
              >
                Наш сайт
              </Link>
              <Link
                href="https://t.me/sachsen_launcher"
                style={{ color: '#282828', textDecoration: 'underline', marginRight: '12px' }}
              >
                Наш Telegram
              </Link>
              <Link
                href="https://molnikas.su/privacy"
                style={{ color: '#282828', textDecoration: 'underline' }}
              >
                Политика конфиденциальности
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
