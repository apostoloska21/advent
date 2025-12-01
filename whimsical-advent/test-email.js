// Test EmailJS configuration using REST API
const EMAILJS_SERVICE_ID = "service_xvvuuis";
const EMAILJS_TEMPLATE_ID = "template_kq93r1e";
const EMAILJS_PUBLIC_KEY = "vzkwVpMTyWf-wppGa";
const EMAILJS_PRIVATE_KEY = "PdSJ5Wc9LopG5hEscfqy-";

async function testEmailJS() {
  try {
    console.log('🧪 Testing EmailJS configuration...');

    const templateParams = {
      to_email: 'aleksandarmiloseski96@gmail.com',
      from_name: 'December Quest Test',
      subject: '🎄 EmailJS Test - December Advent',
      message: 'This is a test email from your December Advent calendar!',
      day: '1'
    };

    const requestBody = {
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      accessToken: EMAILJS_PRIVATE_KEY,
      template_params: templateParams
    };

    console.log('📨 Sending test email via REST API...');
    console.log('🔧 Service ID:', EMAILJS_SERVICE_ID);
    console.log('📝 Template ID:', EMAILJS_TEMPLATE_ID);
    console.log('📧 Sending to:', templateParams.to_email);

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ EmailJS API Response:', response.status, errorText);
      console.log('📨 Request Body Sent:', JSON.stringify(requestBody, null, 2));
      throw new Error(`EmailJS API error: ${response.status} - ${errorText}`);
    }

    const result = await response.text();
    console.log('✅ EmailJS test successful!');
    console.log('Result:', result);

  } catch (error) {
    console.error('❌ EmailJS test failed:', error.message);

    if (error.message.includes('403') || error.message.includes('non-browser applications')) {
      console.log('\n🚨 CRITICAL: You MUST enable server-side sending in EmailJS!');
      console.log('\n📋 EXACT STEPS:');
      console.log('1. Go to: https://dashboard.emailjs.com/');
      console.log('2. Click your profile name (top right)');
      console.log('3. Click "Account"');
      console.log('4. Find "Server-side sending" section');
      console.log('5. TURN ON the toggle: "Allow server-side sending"');
      console.log('6. Click "Save changes"');
      console.log('7. Wait 2-3 minutes for changes to take effect');
      console.log('8. Run this test again');
      console.log('\n❗ This is REQUIRED for Vercel functions to send emails!');
    } else {
      console.log('\n📋 Troubleshooting:');
      console.log('1. Check your Service ID and Template ID are correct');
      console.log('2. Verify your email service is active in EmailJS');
      console.log('3. Make sure template variables match your EmailJS template');
      console.log('4. Check that your email service allows SMTP sending');
    }
  }
}

testEmailJS();
