import os
import httpx
import asyncio
from dotenv import load_dotenv

# Load env from parent dir or backend dir
load_dotenv()

async def test_connection():
    api_url = "https://cursos.canvas.uc.cl"
    token = os.getenv("CANVAS_API_TOKEN")
    
    if not token:
        load_dotenv("backend/.env")
        token = os.getenv("CANVAS_API_TOKEN")
        
    if not token:
        print("❌ Error: CANVAS_API_TOKEN not found in environment!")
        return

    print(f"Using Token: {token[:10]}...")
    headers = {"Authorization": f"Bearer {token}"}
    
    async with httpx.AsyncClient() as client:
        try:
            # Let's request the announcements of Seguridad Computacional (ID: 104135)
            course_id = 104135
            url = f"{api_url}/api/v1/courses/{course_id}/discussion_topics"
            print(f"Requesting GET {url} (Announcements)...")
            response = await client.get(
                url, 
                headers=headers,
                params={"only_announcements": True, "per_page": 10}
            )
            
            if response.status_code == 200:
                print("✅ Success! Fetched announcements successfully.")
                announcements = response.json()
                print(f"Retrieved {len(announcements)} announcements:")
                for ann in announcements:
                    print(f"\nTitle: {ann.get('title')}")
                    print(f"Date: {ann.get('posted_at') or ann.get('created_at')}")
                    # Print first 200 characters of message plain text (removing simple html tags)
                    message = ann.get('message', '')
                    import re
                    clean_msg = re.sub('<[^<]+?>', '', message)
                    print(f"Snippet: {clean_msg[:200].strip()}...")
            else:
                print(f"❌ Failed with status code {response.status_code}")
                print(response.text)
                
        except Exception as e:
            print(f"❌ Error during request: {e}")

if __name__ == "__main__":
    asyncio.run(test_connection())
