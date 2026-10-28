{
  "title": "Common Firebase app analytics issues and Google Tag Manager for Firebase",
  "date": "2020-08-19T13:14:34+06:00",
  "description": "Historical notes on issues encountered when integrating app analytics with Firebase and Google Tag Manager for Firebase.",
  "draft": true
}

This archived draft collected issues encountered while implementing app analytics with Firebase and Google Tag Manager for Firebase.

## Attribution in the older Firebase / Google Analytics setup

The original article documented a workflow in which disabling automatic Firebase events could affect campaign attribution in the then-current Google Analytics integration. It recommended creating a Google Analytics event tag, enabling the Firebase campaign-attribution option, and using the **Campaign** trigger.

That guidance belongs to the 2020 implementation model and should not be treated as current GA4/Firebase documentation.

## Monetary ecommerce parameters

The draft also documented a recurring validation issue: monetary values such as price, revenue or shipping cost had to reach the analytics implementation as numeric values rather than strings.

Examples from the original note:

- `15.50` ✅
- `"15,50"` ❌
- `"15.50"` ❌

When a monetary field was missing, the recommended debugging path was to verify first that the app actually produced the parameter and then check its type in Firebase/analytics logs.

## Ecommerce event compatibility

The original draft compared recommended Firebase ecommerce events with support in Google Tag Manager for Firebase. That matrix was incomplete and reflects a 2020 product state, so it is intentionally not reproduced here as current guidance.

For current implementations, use the latest official Firebase Analytics and GA4 ecommerce documentation and validate behavior against the SDK version deployed in the app.
