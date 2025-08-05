// Email service for sending magic links using Resend
import { Resend } from 'resend';
import { generateMagicToken, createMagicLink, saveMagicToken } from './auth';

export interface EmailServiceResponse {
  success: boolean;
  error?: string;
  token?: string;
  emailId?: string;
}

// Initialize Resend client
const getResendClient = () => {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY;
  if (!apiKey || apiKey === 're_placeholder_key_replace_with_real_key') {
    console.warn('⚠️ Resend API key not configured. Using mock mode.');
    return null;
  }
  return new Resend(apiKey);
};

// Real email service using Resend
export const sendMagicLinkEmail = async (
  email: string,
  baseUrl: string = import.meta.env.VITE_APP_URL || window.location.origin
): Promise<EmailServiceResponse> => {
  try {
    const token = generateMagicToken();
    const magicLink = createMagicLink(token, baseUrl);
    
    // Save token for verification
    saveMagicToken(email, token);
    
    const resend = getResendClient();
    
    // If Resend is not configured, fall back to mock mode for development
    if (!resend) {
      console.log(`🔗 [MOCK MODE] Magic link for ${email}: ${magicLink}`);
      console.log('📧 To enable real email sending, configure VITE_RESEND_API_KEY in your .env.local file');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        token,
        emailId: 'mock-email-id'
      };
    }
    
    // Get email template
    const emailTemplate = getMagicLinkEmailTemplate(magicLink, email);
    const fromEmail = import.meta.env.VITE_FROM_EMAIL || 'noreply@kaya.com';
    
    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    });
    
    if (error) {
      console.error('Resend API error:', error);
      throw new Error(`Email delivery failed: ${error.message}`);
    }
    
    console.log(`✅ Magic link email sent successfully to ${email} (ID: ${data?.id})`);
    
    return {
      success: true,
      token,
      emailId: data?.id
    };
  } catch (error) {
    console.error('Failed to send magic link:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to send magic link';
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'Email service configuration error. Please try again later.';
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'Too many emails sent. Please wait before trying again.';
      } else if (error.message.includes('invalid email')) {
        errorMessage = 'Invalid email address provided.';
      } else {
        errorMessage = error.message;
      }
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

// Enhanced email template for magic link with professional Kaya branding
export const getMagicLinkEmailTemplate = (magicLink: string, email: string) => {
  const isLabfoxUser = email.toLowerCase().endsWith('@labfox.studio');
  const baseUrl = import.meta.env.VITE_APP_URL || 'http://localhost:8080';
  
  return {
    subject: '🔐 Your Kaya CEO Dashboard Login Link',
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <title>Kaya CEO Dashboard - Secure Login</title>
          <!--[if mso]>
          <noscript>
            <xml>
              <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
            </xml>
          </noscript>
          <![endif]-->
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f9fafb;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9fafb;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
                  
                  <!-- Header with gradient background -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 40px 30px; text-align: center;">
                      <img src="${baseUrl}/lovable-uploads/81ad7cb6-4886-4daf-a947-f8f754e313f9.png" alt="Kaya" style="height: 50px; width: auto; margin-bottom: 20px;" />
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.025em;">
                        Welcome to Kaya
                      </h1>
                      <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px; font-weight: 400;">
                        Your AI-Powered CEO Dashboard
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Main content -->
                  <tr>
                    <td style="padding: 40px;">
                      <div style="text-align: center; margin-bottom: 32px;">
                        <h2 style="margin: 0 0 16px; color: #1f2937; font-size: 24px; font-weight: 600;">
                          Secure Login Request
                        </h2>
                        <p style="margin: 0; color: #6b7280; font-size: 16px; line-height: 1.5;">
                          Click the button below to securely access your dashboard
                        </p>
                      </div>
                      
                      <!-- CTA Button -->
                      <div style="text-align: center; margin: 40px 0;">
                        <a href="${magicLink}"
                           style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; letter-spacing: 0.025em; box-shadow: 0 4px 14px 0 rgba(102, 126, 234, 0.39); transition: all 0.3s ease;">
                          🚀 Access Your Dashboard
                        </a>
                      </div>
                      
                      <!-- Security notice -->
                      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 32px 0;">
                        <div style="display: flex; align-items: flex-start;">
                          <div style="flex-shrink: 0; margin-right: 12px;">
                            <span style="font-size: 20px;">🔒</span>
                          </div>
                          <div>
                            <h3 style="margin: 0 0 8px; color: #92400e; font-size: 14px; font-weight: 600;">
                              Security Notice
                            </h3>
                            <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.4;">
                              This secure login link will expire in <strong>15 minutes</strong> for your protection.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      ${!isLabfoxUser ? `
                      <!-- New user welcome -->
                      <div style="background-color: #eff6ff; border: 1px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 32px 0;">
                        <h3 style="margin: 0 0 12px; color: #1e40af; font-size: 16px; font-weight: 600;">
                          🎉 Welcome to Kaya!
                        </h3>
                        <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.5;">
                          After logging in, you'll be guided through our onboarding process to help you get the most out of your AI-powered CEO dashboard.
                        </p>
                      </div>
                      ` : ''}
                      
                      <!-- Alternative link -->
                      <div style="text-align: center; margin: 32px 0; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
                        <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">
                          Having trouble with the button above?
                        </p>
                        <p style="margin: 0; color: #6b7280; font-size: 12px; word-break: break-all;">
                          Copy and paste this link: <br>
                          <a href="${magicLink}" style="color: #3b82f6; text-decoration: underline;">${magicLink}</a>
                        </p>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 32px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0 0 8px; color: #9ca3af; font-size: 12px;">
                        If you didn't request this login link, you can safely ignore this email.
                      </p>
                      <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                        © ${new Date().getFullYear()} Kaya CEO Dashboard. All rights reserved.
                      </p>
                      <div style="margin-top: 16px;">
                        <a href="#" style="color: #9ca3af; text-decoration: none; font-size: 12px; margin: 0 8px;">Privacy Policy</a>
                        <span style="color: #d1d5db;">|</span>
                        <a href="#" style="color: #9ca3af; text-decoration: none; font-size: 12px; margin: 0 8px;">Terms of Service</a>
                        <span style="color: #d1d5db;">|</span>
                        <a href="#" style="color: #9ca3af; text-decoration: none; font-size: 12px; margin: 0 8px;">Support</a>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `
🔐 KAYA CEO DASHBOARD - SECURE LOGIN

Welcome to Kaya - Your AI-Powered CEO Dashboard

SECURE LOGIN REQUEST
Click this link to access your dashboard: ${magicLink}

SECURITY NOTICE
🔒 This secure login link will expire in 15 minutes for your protection.

${!isLabfoxUser ? `
🎉 WELCOME TO KAYA!
After logging in, you'll be guided through our onboarding process to help you get the most out of your AI-powered CEO dashboard.
` : ''}

HAVING TROUBLE?
If the link above doesn't work, copy and paste this URL into your browser:
${magicLink}

SECURITY
If you didn't request this login link, you can safely ignore this email.

© ${new Date().getFullYear()} Kaya CEO Dashboard. All rights reserved.
    `
  };
};

// Integration helpers for popular email services
export const emailServiceConfigs = {
  resend: {
    apiUrl: 'https://api.resend.com/emails',
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    })
  },
  emailjs: {
    serviceId: 'your_service_id',
    templateId: 'your_template_id',
    publicKey: 'your_public_key'
  },
  sendgrid: {
    apiUrl: 'https://api.sendgrid.com/v3/mail/send',
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    })
  }
};