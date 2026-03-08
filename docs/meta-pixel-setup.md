# Meta Pixel - Complete Setup in Facebook Events Manager

Pixel is installed via GTM and working. Facebook Events Manager shows setup as incomplete because the **event configuration** step hasn't been done yet.

## Steps to Complete

1. Go to [Facebook Events Manager](https://eventsmanager.facebook.com) → Saint 6 Studio (ID 1212673647702213)
2. Click **"Set up the event"** button
3. Choose **"Use the event setup tool"** (or manually configure)
4. Confirm **PageView** event is active (GTM's FB Pixel tag fires this automatically)
5. Optionally add events like **Contact**, **Lead**, or **ViewContent** depending on what you want to track

## Verify It's Working

1. Go to the **"Event testing"** tab in Events Manager
2. Visit saint6.studio in another browser tab
3. Check if PageView events appear in the testing tab

## Optional: Conversion API Gateway

Facebook suggests setting up Conversion API for better tracking accuracy (shown as ~13% cost reduction). This can be done later from the Events Manager.
