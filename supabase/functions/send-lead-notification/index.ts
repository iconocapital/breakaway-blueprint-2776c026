import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface LeadPayload {
  name: string;
  email: string;
  phone?: string;
  firm?: string;
  score: string;
  tier: string;
  answers: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: LeadPayload = await req.json();

    const recipientEmail = Deno.env.get("NOTIFICATION_EMAIL");
    if (!recipientEmail) {
      console.error("NOTIFICATION_EMAIL secret not configured");
      return new Response(
        JSON.stringify({ error: "Email not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY secret not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const htmlBody = `
      <h2>New Breakaway Blueprint™ Assessment Submission</h2>
      <table style="border-collapse:collapse;width:100%;max-width:600px;">
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Name</td><td style="padding:8px;border:1px solid #ddd;">${payload.name}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Email</td><td style="padding:8px;border:1px solid #ddd;">${payload.email}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Phone</td><td style="padding:8px;border:1px solid #ddd;">${payload.phone || "—"}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Firm</td><td style="padding:8px;border:1px solid #ddd;">${payload.firm || "—"}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Score</td><td style="padding:8px;border:1px solid #ddd;">${payload.score}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Tier</td><td style="padding:8px;border:1px solid #ddd;">${payload.tier}</td></tr>
      </table>
      <h3 style="margin-top:20px;">Full Answers</h3>
      <pre style="background:#f5f5f5;padding:16px;border-radius:8px;font-size:12px;white-space:pre-wrap;">${payload.answers}</pre>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Breakaway Blueprint <onboarding@resend.dev>",
        to: [recipientEmail],
        subject: `BB Assessment: ${payload.name} — ${payload.tier} (${payload.score})`,
        html: htmlBody,
      }),
    });

    const resData = await res.json();

    if (!res.ok) {
      console.error("Resend error:", resData);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: resData }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
