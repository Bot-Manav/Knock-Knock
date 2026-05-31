import re

def detect_leaks(traffic_data):
    """
    Scans request URLs and payloads for potential sensitive data leaks.
    """
    leaks = []
    
    email_pattern = re.compile(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+')
    location_keywords = ['latitude', 'longitude', 'lat=', 'lon=']
    cookie_keywords = ['cookie', 'set-cookie', '_ga', '_fbp', 'sessionid']
    
    found_email = False
    found_location = False
    found_cookie_signal = False
    
    for req in traffic_data:
        content_to_scan = f"{req.get('url', '')} {req.get('post_data', '') or ''}"
        
        # Check for emails
        if not found_email and email_pattern.search(content_to_scan):
            leaks.append(
                "An email-like value appeared in a request — verify this is disclosed "
                "in your privacy policy and covered by user consent."
            )
            found_email = True
            
        # Check for location
        if not found_location:
            for kw in location_keywords:
                if kw in content_to_scan.lower():
                    leaks.append(
                        "Possible location data (latitude/longitude) appeared in a request — "
                        "ensure your policy explains location collection and user consent."
                    )
                    found_location = True
                    break

        if not found_cookie_signal:
            for kw in cookie_keywords:
                if kw in content_to_scan.lower():
                    leaks.append(
                        "Cookie or session identifiers may be sent to a third party — "
                        "disclose this in your cookie policy and consent banner."
                    )
                    found_cookie_signal = True
                    break
                    
        if found_email and found_location and found_cookie_signal:
            break
            
    return leaks
