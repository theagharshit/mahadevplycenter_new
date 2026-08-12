-- Enterprise CMS Database Schema for Mahadev Ply Center
-- Dialect: PostgreSQL / Cloud SQL

CREATE TABLE IF NOT EXISTS admin_users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(32) NOT NULL DEFAULT 'editor', -- 'super_admin', 'admin', 'editor', 'manager'
    profile_picture TEXT,
    permissions JSONB,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    last_login_ip VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS site_settings (
    id INT PRIMARY KEY DEFAULT 1,
    brand_name VARCHAR(255) NOT NULL,
    tagline TEXT,
    tagline_ne TEXT,
    phone VARCHAR(100),
    alt_phone VARCHAR(100),
    whatsapp_number VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    store_location TEXT,
    opening_hours TEXT,
    maps_embed_url TEXT,
    facebook_url TEXT,
    instagram_url TEXT,
    hero_headline TEXT,
    hero_headline_ne TEXT,
    hero_subtitle TEXT,
    hero_badge_text VARCHAR(255),
    banner_image TEXT,
    primary_color VARCHAR(20) DEFAULT '#0f766e',
    accent_color VARCHAR(20) DEFAULT '#d97706',
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT,
    google_analytics_id VARCHAR(64),
    maintenance_mode BOOLEAN DEFAULT FALSE,
    default_language VARCHAR(10) DEFAULT 'EN',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    grade VARCHAR(100),
    application JSONB DEFAULT '[]',
    brand VARCHAR(100),
    image TEXT,
    description TEXT,
    material TEXT,
    standard_size VARCHAR(100),
    properties TEXT,
    ideal_use TEXT,
    store_location TEXT,
    in_stock BOOLEAN DEFAULT TRUE,
    stock_status VARCHAR(32) DEFAULT 'in_stock',
    price_estimate VARCHAR(100),
    thickness VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS laminate_brands (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    logo TEXT,
    cover_image TEXT,
    banner_image TEXT,
    short_description TEXT,
    description TEXT,
    pdf_url TEXT,
    pdf_cover_image TEXT,
    available_finishes JSONB DEFAULT '[]',
    available_collections JSONB DEFAULT '[]',
    applications JSONB DEFAULT '[]',
    benefits JSONB DEFAULT '[]',
    thickness VARCHAR(50),
    warranty VARCHAR(100),
    available_colors JSONB DEFAULT '[]',
    featured_designs JSONB DEFAULT '[]',
    display_order INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blog_posts (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    snippet TEXT,
    content TEXT,
    image TEXT,
    date VARCHAR(50),
    author VARCHAR(100),
    read_time VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inquiries (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    category VARCHAR(100),
    quantity VARCHAR(100),
    project_type VARCHAR(100),
    message TEXT,
    city VARCHAR(100),
    status VARCHAR(32) DEFAULT 'New', -- 'New', 'In Progress', 'Resolved', 'Replied'
    notes TEXT,
    assigned_admin VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS media_library (
    id VARCHAR(64) PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    mime_type VARCHAR(100),
    size INT,
    folder VARCHAR(100) DEFAULT 'general',
    alt_text TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_role VARCHAR(32) NOT NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(64),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    old_value TEXT,
    new_value TEXT
);

CREATE TABLE IF NOT EXISTS navigation_menu (
    id VARCHAR(64) PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    label_ne VARCHAR(100),
    path VARCHAR(255) NOT NULL,
    target_view VARCHAR(50) NOT NULL,
    position VARCHAR(20) DEFAULT 'both', -- 'header', 'footer', 'both'
    display_order INT DEFAULT 0,
    visible BOOLEAN DEFAULT TRUE
);

-- Seed initial Super Admin User
INSERT INTO admin_users (id, email, name, role, active)
VALUES ('usr_super_01', 'admin@mahadevply.com', 'Mahadev Store Owner', 'super_admin', true)
ON CONFLICT (email) DO NOTHING;
