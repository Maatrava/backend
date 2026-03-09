import axios from "axios";

export default async function askAI(message) {

    const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a maternal and newborn health assistant. Give safe health advice and suggest consulting a doctor for serious symptoms."
                },
                {
                    role: "user",
                    content: message
                }
            ]
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            }
        }
    );

    return response.data.choices[0].message.content;
}