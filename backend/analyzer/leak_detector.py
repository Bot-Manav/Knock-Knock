import re

def detect_leaks(traffic_data):
    """
    Scans request URLs and payloads for potential sensitive data leaks.
    """
    leaks = []
    
    email_pattern = re.compile(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+')
    location_keywords = ['latitude', 'longitude', 'lat=', 'lon=']
    
    found_email = False
    found_location = False
    
    for req in traffic_data:
        content_to_scan = f"{req.get('url', '')} {req.get('post_data', '') or ''}"
        
        # Check for emails
        if not found_email and email_pattern.search(content_to_scan):
            leaks.append("Possible email detected in request payload/URL.")
            found_email = True
            
        # Check for location
        if not found_location:
            for kw in location_keywords:
                if kw in content_to_scan.lower():
                    leaks.append("Possible location data (latitude/longitude) detected in request.")
                    found_location = True
                    break
                    
        # Stop early if both are found to avoid redundant alerts
        if found_email and found_location:
            break
            
    return leaks
