# SnapShare Scaling Plan

## 1. Assumptions
- **Total Registered Users:** 10,000,000
- **Daily Active Users (DAU):** 10% of total = 1,000,000 active users
- **Daily Uploads:** 1 photo per active user = 1,000,000 uploads per day
- **Daily Feed Views:** 50 pages per active user = 50,000,000 feed views per day
- **File Sizes:** 2 MB photo + 50 KB thumbnail = 2.05 MB total per upload
- **Seconds in a day:** 86,400 seconds
- **Peak Multiplier:** 5x average traffic

## 2. Estimates
- **Uploads per second (Average):** 1,000,000 / 86,400 = 11.57 uploads per second
- **Uploads per second (Peak):** 11.57 * 5 = 57.87 uploads per second
- **Feed views per second (Average):** 50,000,000 / 86,400 = 578.70 feed views per second
- **Feed views per second (Peak):** 578.70 * 5 = 2893.5 feed views per second
- **Storage per year:** 1,000,000 uploads * 2.05 MB = 2.05 TB per day. 2.05 TB * 365 days = 748.25 TB storage per year

## 3. Read-Heavy or Write-Heavy
SnapShare is a read-heavy system. This means the system processes significantly more feed views (50 million/day) than uploads (1 million/day), so the design must prioritize caching and read replication to handle the retrieval load without crashing.

## 4. Photo Storage Location
Photos should not be stored inside the database because storing large binary files in a relational database will quickly exhaust storage and slow down transactional queries. Instead, the photo files should go into object storage, and the database should only store a link or URL pointing to the file.

## 5. Architecture Diagram

[ CDN ]
   |
[ load balancer ]
   |
[ app servers ] --------- [ cache ]
   |
[ database with a read replica ]
   |
[ queue with a worker that creates thumbnails ]
   |
[ object storage for the photo files ]

## 6. Component Explanations
- **CDN:** It caches static images geographically closer to users to reduce latency and save server bandwidth.
- **load balancer:** It distributes incoming web traffic evenly across multiple app servers so no single server gets overwhelmed.
- **app servers:** It handles the core business logic like authenticating users and generating feed data.
- **cache:** It stores frequently accessed feed data in memory to drastically reduce the number of queries hitting the database.
- **database with a read replica:** It stores structured metadata where the primary handles writes and the read replica handles the massive volume of read queries.
- **object storage for the photo files:** It provides cheap, scalable, and durable storage specifically designed for holding large binary files like images.
- **queue with a worker that creates thumbnails:** It decouples the slow image processing task from the main user request, allowing the app to respond instantly while the thumbnail is generated in the background.

## 7. Upload Flow
1. The user uploads a photo, and the request is routed through the CDN and load balancer to the app servers.
2. The app servers save the original 2 MB photo directly to object storage for the photo files.
3. The app servers save the photo's metadata (like URL and uploader ID) in the primary database.
4. The app servers place a message onto the queue with a worker that creates thumbnails.
5. The worker picks up the message, downloads the photo, generates the 50 KB thumbnail, uploads it to object storage, and updates the database.
6. The app servers respond to the user with a success message.

## 8. Trade-offs
- **Queue Worker vs Consistency:** Using a background worker queue for thumbnails makes the upload feel instantly fast to the user, but the trade-off is eventual consistency where followers might see a broken thumbnail for a few seconds before it finishes generating.
- **Read Replicas vs Data Staleness:** Using a database with a read replica allows the system to handle the massive read load, but the trade-off is replication lag where a newly uploaded photo might take a moment to sync and appear on the replica.