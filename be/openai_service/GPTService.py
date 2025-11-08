from openai import OpenAI
import json
import os

API_KEY = os.environ.get("HF_API_KEY")


class GPTService:
    def __init__(self, model_name="openai/gpt-oss-20b:together"):
        self.model_name = model_name

        if not API_KEY:
            raise ValueError(
                "HF_API_KEY environment variable is not set. Please check your .env file."
            )

        self.client = OpenAI(
            base_url="https://router.huggingface.co/v1",
            api_key=API_KEY,
        )

    def determine_assignee_ro(self, location, description, max_tokens=500):
        """
        Determines the appropriate municipal department and city hall in Romania for a given location and issue description.

        Args:
            location (str): City / town or specific street location in Romania.
            description (str): Description of the problem/issue.
            max_tokens (int): Maximum tokens for the model response.

        Returns:
            dict: JSON object including:
                - city: City / Town
                - city_hall: Exact City Hall responsible
                - department: Department responsible
                - key_points: List of key points from the issue
        """
        try:
            prompt = f"""
            You are an assistant specialized in routing municipal issues in Romania.
            Given the location and issue description, provide the output as a JSON object with the following fields:

            {{
                "city": "<City or town>",
                "city_hall": "<Exact City Hall responsible>",
                "department": "<Municipal department responsible>",
                "key_points": ["<Key point 1>", "<Key point 2>", "..."]
            }}

            ONLY consider Romanian cities and town halls.

            Location: {location}
            Issue Description: {description}
            """

            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a municipal routing assistant specialized in Romanian cities and town halls. Always respond in valid JSON format.",
                    },
                    {"role": "user", "content": prompt},
                ],
                max_tokens=max_tokens,
                temperature=0.5,
            )
            if response.choices[0].message.content is not None:
                content = response.choices[0].message.content.strip()
                return json.loads(content)

        except Exception as e:
            print(f"Error determining assignee: {e}")
            return {"error": str(e)}


# Create a singleton instance for use throughout the application
gpt_service = GPTService()
