-- Reference copy of the queries served by api/charts.php (that file is what the site actually runs; keep both in sync).
-- Database: MySQL (Mfcarlin_youtubetrending via api/config.php). Written to run on MySQL 5.7+, MySQL 8 and MariaDB:
-- no CTEs or window functions. REGEXP is case-insensitive under the default collation.
-- Table: USvideos with the original Kaggle columns. If the real table name differs, change VIDEOS_TABLE in api/charts.php.
-- trending_date is stored as text 'yy.dd.mm'; publish_time as ISO text '2017-11-13T17:13:01.000Z'.

-- Chart 2: view trajectories for the 8 most-viewed official trailers  (?chart=trajectories)
SELECT t.video_id,
       MAX(t.title) AS title,
       DATEDIFF(STR_TO_DATE(t.trending_date, '%y.%d.%m'), top8.first_td) AS day,
       MAX(t.views) AS views
FROM USvideos t
JOIN (
  SELECT video_id,
         MIN(STR_TO_DATE(trending_date, '%y.%d.%m')) AS first_td,
         MAX(views) AS peak
  FROM USvideos
  WHERE title REGEXP 'official.*(trailer|teaser)'
  GROUP BY video_id
  ORDER BY peak DESC
  LIMIT 8
) top8 ON top8.video_id = t.video_id
WHERE t.title REGEXP 'official.*(trailer|teaser)'
GROUP BY t.video_id, t.trending_date, top8.first_td
ORDER BY t.video_id, day;

-- Chart 3: unique trending videos by publish weekday (0 = Mon) and hour (UTC)  (?chart=heatmap)
SELECT WEEKDAY(STR_TO_DATE(LEFT(publish_time, 19), '%Y-%m-%dT%H:%i:%s')) AS weekday,
       HOUR(STR_TO_DATE(LEFT(publish_time, 19), '%Y-%m-%dT%H:%i:%s'))    AS hour,
       COUNT(DISTINCT video_id) AS videos
FROM USvideos
WHERE STR_TO_DATE(LEFT(publish_time, 19), '%Y-%m-%dT%H:%i:%s') IS NOT NULL
GROUP BY weekday, hour
ORDER BY weekday, hour;

-- Chart 5: controversy map for the 400 most-viewed videos  (?chart=controversy)
SELECT video_id,
       MAX(title) AS title,
       MAX(views) AS views,
       ROUND(MAX(comment_count) / MAX(views) * 100, 3) AS comment_rate,
       ROUND(MAX(dislikes) / NULLIF(MAX(likes) + MAX(dislikes), 0) * 100, 2) AS dislike_share
FROM USvideos
GROUP BY video_id
HAVING MAX(views) > 0
ORDER BY views DESC
LIMIT 400;
