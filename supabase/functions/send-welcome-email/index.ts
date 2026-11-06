import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { name, email, phone } = await req.json();

    if (!email || typeof email !== "string") {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const fromEmail = Deno.env.get("FROM_EMAIL") || "Protech Digital <onboarding@resend.dev>";
    const adminEmail = Deno.env.get("ADMIN_EMAIL") || "chidikegprosper@gmail.com";

    const visitorName = name || "there";

    // Build the HTML welcome email
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f1a; padding: 40px 20px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display: inline-flex; align-items: center; gap: 8px;">
            <span style="font-size: 24px; font-weight: 800; color: #ffffff;">Protech</span>
            <span style="font-size: 24px; font-weight: 800; background: linear-gradient(90deg, #22d3ee, #10b981); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Digital</span>
          </div>
        </div>

        <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; text-align: center; margin-bottom: 8px;">
          Welcome, ${visitorName}!
        </h1>
        <p style="color: #94a3b8; font-size: 16px; text-align: center; line-height: 1.6; margin-bottom: 32px;">
          Thank you for joining Protech Digital. We're excited to have you explore our cutting-edge gadgets and enterprise-grade cyber security solutions.
        </p>

        <div style="background: #111827; border: 1px solid #1e293b; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <h2 style="color: #22d3ee; font-size: 16px; font-weight: 600; margin-bottom: 16px;">What you can do now:</h2>
          <ul style="color: #cbd5e1; font-size: 15px; line-height: 1.8; list-style: none; padding: 0;">
            <li style="margin-bottom: 8px;">&#10003; Browse our full product catalog</li>
            <li style="margin-bottom: 8px;">&#10003; Add items to your cart and check out securely</li>
            <li style="margin-bottom: 8px;">&#10003; Get personalized product recommendations</li>
            <li style="margin-bottom: 8px;">&#10003; Receive exclusive offers and updates</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="https://protech-digital.com" style="display: inline-block; background: linear-gradient(90deg, #22d3ee, #10b981); color: #000000; font-weight: 600; font-size: 16px; padding: 14px 32px; border-radius: 12px; text-decoration: none;">
            Start Shopping
          </a>
        </div>

        <div style="border-top: 1px solid #1e293b; margin-top: 32px; padding-top: 24px;">
          <p style="color: #64748b; font-size: 13px; text-align: center; line-height: 1.6;">
            Need help? Reach us on WhatsApp at +234 803 704 9003 or email us at chidikegprosper@gmail.com<br/>
            &copy; 2026 Protech Digital. Designed and owned by the Founder and CEO: Chidike Prosper Aaron Golden.
          </p>
        </div>
      </div>
    `;

    const textEmail = `Welcome to Protech Digital, ${visitorName}!

Thank you for joining Protech Digital. We're excited to have you explore our cutting-edge gadgets and enterprise-grade cyber security solutions.

What you can do now:
- Browse our full product catalog
- Add items to your cart and check out securely
- Get personalized product recommendations
- Receive exclusive offers and updates

Start shopping at https://protech-digital.com

Need help? Reach us on WhatsApp at +234 803 704 9003 or email us at chidikegprosper@gmail.com

© 2026 Protech Digital. Designed and owned by the Founder and CEO: Chidike Prosper Aaron Golden.`;

    // Send welcome email to the visitor
    const visitorResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: email,
        subject: `Welcome to Protech Digital, ${visitorName}!`,
        html: html,
        text: textEmail,
      }),
    });

    const visitorResult = await visitorResponse.json();

    // Send notification email to admin
    const adminHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f1a; padding: 40px 20px; border-radius: 16px;">
        <h1 style="color: #22d3ee; font-size: 22px; font-weight: 700; margin-bottom: 24px;">
          New Visitor Registration
        </h1>
        <div style="background: #111827; border: 1px solid #1e293b; border-radius: 12px; padding: 24px;">
          <table style="width: 100%; color: #cbd5e1; font-size: 15px; line-height: 1.8;">
            <tr><td style="color: #64748b; width: 100px;">Name:</td><td>${visitorName}</td></tr>
            <tr><td style="color: #64748b;">Email:</td><td>${email}</td></tr>
            <tr><td style="color: #64748b;">Phone:</td><td>${phone || "Not provided"}</td></tr>
            <tr><td style="color: #64748b;">Joined:</td><td>${new Date().toLocaleString()}</td></tr>
          </table>
        </div>
        <p style="color: #64748b; font-size: 13px; margin-top: 24px;">
          You can view this visitor's activity in your Admin Dashboard.
        </p>
      </div>
    `;

    const adminResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: adminEmail,
        subject: `New Visitor: ${visitorName} just signed up`,
        html: adminHtml,
        text: `New Visitor Registration\n\nName: ${visitorName}\nEmail: ${email}\nPhone: ${phone || "Not provided"}\nJoined: ${new Date().toLocaleString()}\n\nYou can view this visitor's activity in your Admin Dashboard.`,
      }),
    });

    const adminResult = await adminResponse.json();

    if (!visitorResponse.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to send welcome email", details: visitorResult }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        visitorEmail: visitorResult.id,
        adminEmail: adminResult.id,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
