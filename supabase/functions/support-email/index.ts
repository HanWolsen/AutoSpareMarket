import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

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
    const { category, subject, message, email } = await req.json();

    if (!subject || !message || !email) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl  = Deno.env.get("SUPABASE_URL")!;
    const serviceKey   = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase     = createClient(supabaseUrl, serviceKey);

    const { error: dbErr } = await supabase.from("support_requests").insert({
      category: category || "other",
      subject,
      message,
      sender_email: email,
      created_at: new Date().toISOString(),
    });

    if (dbErr) {
      console.error("DB insert error:", dbErr.message);
    }

    const resendKey = Deno.env.get("RESEND_API_KEY");
    const adminEmail = Deno.env.get("ADMIN_EMAIL") || "admin@example.com";

    if (resendKey) {
      const emailBody = `
Новое обращение в техническую поддержку

Категория: ${category || "—"}
Тема: ${subject}
От: ${email}

Сообщение:
${message}
      `.trim();

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "noreply@autosparemarket.ru",
          to: [adminEmail],
          subject: `[Поддержка] ${subject}`,
          text: emailBody,
        }),
      });
    }

    return new Response(
      JSON.stringify({ success: true, message: "Support request received" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
