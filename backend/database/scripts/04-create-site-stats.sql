-- Table for site-wide analytics with aggregation (Supabase Free Tier friendly)
CREATE TABLE IF NOT EXISTS site_stats (
    date DATE PRIMARY KEY DEFAULT CURRENT_DATE,
    visit_count INTEGER DEFAULT 0
);
